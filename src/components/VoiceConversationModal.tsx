import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  X,
  Radio,
  Loader2,
  AlertCircle,
  Sparkles,
  PhoneCall,
  PhoneOff,
  VolumeX,
} from 'lucide-react';

interface VoiceConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentContext?: string;
  documentTitle?: string;
}

export const VoiceConversationModal: React.FC<VoiceConversationModalProps> = ({
  isOpen,
  onClose,
  documentContext,
  documentTitle,
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [transcriptLog, setTranscriptLog] = useState<
    Array<{ sender: 'user' | 'gemini'; text: string }>
  >([]);

  const wsRef = useRef<WebSocket | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const nextPlayTimeRef = useRef<number>(0);

  // PCM Float32 to 16-bit PCM base64
  const pcmToBase64 = (channelData: Float32Array): string => {
    const l = channelData.length;
    const arrayBuffer = new ArrayBuffer(l * 2);
    const view = new DataView(arrayBuffer);
    for (let i = 0; i < l; i++) {
      let s = Math.max(-1, Math.min(1, channelData[i]));
      view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true); // Little endian
    }
    const bytes = new Uint8Array(arrayBuffer);
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  // Play incoming 24kHz 16-bit PCM chunks progressively
  const playAudioChunk = (base64Audio: string) => {
    if (!outputAudioCtxRef.current) return;
    const ctx = outputAudioCtxRef.current;

    const binaryString = atob(base64Audio);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const int16Array = new Int16Array(bytes.buffer);
    const float32Array = new Float32Array(int16Array.length);
    for (let i = 0; i < int16Array.length; i++) {
      float32Array[i] = int16Array[i] / 32768.0;
    }

    const audioBuffer = ctx.createBuffer(1, float32Array.length, 24000);
    audioBuffer.getChannelData(0).set(float32Array);

    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);

    const currentTime = ctx.currentTime;
    if (nextPlayTimeRef.current < currentTime) {
      nextPlayTimeRef.current = currentTime;
    }

    source.start(nextPlayTimeRef.current);
    nextPlayTimeRef.current += audioBuffer.duration;
    setIsAiSpeaking(true);

    source.onended = () => {
      if (ctx.currentTime >= nextPlayTimeRef.current - 0.05) {
        setIsAiSpeaking(false);
      }
    };
  };

  const startVoiceSession = async () => {
    setErrorMessage(null);
    setIsConnecting(true);

    try {
      // Create output audio context for 24kHz model speech
      outputAudioCtxRef.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)({ sampleRate: 24000 });

      // Create input audio context for 16kHz microphone stream
      inputAudioCtxRef.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)({ sampleRate: 16000 });

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      mediaStreamRef.current = stream;

      // Connect WebSocket to /api/live
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/api/live`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        setIsConnecting(false);

        // Send initial context if available
        if (documentContext) {
          ws.send(
            JSON.stringify({
              text: `The user is currently reading the document titled "${documentTitle || 'Document'}". Here is the document content: ${documentContext.slice(0, 1000)}. Please be ready to help answer any questions verbally in very simple, plain English. Say a warm brief hello to welcome the user.`,
            })
          );
        }
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.error) {
            setErrorMessage(msg.error);
          }
          if (msg.audio) {
            playAudioChunk(msg.audio);
          }
          if (msg.text) {
            setTranscriptLog((prev) => [...prev, { sender: 'gemini', text: msg.text }]);
          }
          if (msg.interrupted) {
            // Stop scheduled playback if user spoke
            if (outputAudioCtxRef.current) {
              nextPlayTimeRef.current = outputAudioCtxRef.current.currentTime;
            }
            setIsAiSpeaking(false);
          }
        } catch (e) {
          console.error('Error handling live message:', e);
        }
      };

      ws.onerror = (err) => {
        console.error('WebSocket Live API error:', err);
        setErrorMessage('Failed to connect to Live Voice Assistant.');
        setIsConnecting(false);
        setIsConnected(false);
      };

      ws.onclose = () => {
        setIsConnected(false);
        setIsConnecting(false);
      };

      // Set up microphone capture processor
      const source = inputAudioCtxRef.current.createMediaStreamSource(stream);
      const processor = inputAudioCtxRef.current.createScriptProcessor(4096, 1, 1);
      scriptProcessorRef.current = processor;

      processor.onaudioprocess = (e) => {
        if (isMuted || !ws || ws.readyState !== WebSocket.OPEN) return;
        const inputData = e.inputBuffer.getChannelData(0);
        const base64Pcm = pcmToBase64(inputData);
        ws.send(JSON.stringify({ audio: base64Pcm }));
      };

      source.connect(processor);
      processor.connect(inputAudioCtxRef.current.destination);
    } catch (err: any) {
      console.error('Mic or Live API initialization error:', err);
      setErrorMessage(
        err.name === 'NotAllowedError'
          ? 'Microphone permission was denied. Please allow mic access.'
          : err.message || 'Could not start voice session.'
      );
      setIsConnecting(false);
      setIsConnected(false);
    }
  };

  const stopVoiceSession = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    if (scriptProcessorRef.current) {
      scriptProcessorRef.current.disconnect();
      scriptProcessorRef.current = null;
    }
    if (inputAudioCtxRef.current) {
      inputAudioCtxRef.current.close();
      inputAudioCtxRef.current = null;
    }
    if (outputAudioCtxRef.current) {
      outputAudioCtxRef.current.close();
      outputAudioCtxRef.current = null;
    }

    setIsConnected(false);
    setIsConnecting(false);
    setIsAiSpeaking(false);
  };

  useEffect(() => {
    if (isOpen) {
      startVoiceSession();
    } else {
      stopVoiceSession();
    }
    return () => {
      stopVoiceSession();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="voice-modal-title"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div className="w-full max-w-lg bg-gradient-to-b from-slate-900 to-slate-950 text-white rounded-3xl border border-slate-700/80 shadow-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6 relative overflow-hidden">
        {/* Ambient background glow */}
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
            isAiSpeaking
              ? 'bg-blue-500/20 scale-125'
              : isConnected
              ? 'bg-emerald-500/15 scale-100'
              : 'bg-indigo-500/10 scale-90'
          }`}
        />

        {/* Modal Top Bar */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/20 border border-blue-400/30 text-blue-400">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 id="voice-modal-title" className="font-extrabold text-base text-white flex items-center gap-2">
                <span>Gemini Live Voice Companion</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-300 font-bold border border-blue-400/30">
                  gemini-3.8-live
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Real-time, two-way conversational accessibility support
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
            aria-label="Close voice modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Central Pulse Orb & Audio Visualizer */}
        <div className="flex flex-col items-center justify-center py-6 relative z-10 space-y-4">
          <div
            className={`w-28 h-28 rounded-full flex items-center justify-center transition-all duration-500 relative ${
              isAiSpeaking
                ? 'bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-400 shadow-lg shadow-blue-500/40 animate-pulse'
                : isConnected
                ? 'bg-gradient-to-tr from-emerald-600 to-teal-600 shadow-md shadow-emerald-500/30'
                : 'bg-slate-800'
            }`}
          >
            {isConnecting ? (
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            ) : isAiSpeaking ? (
              <Volume2 className="w-12 h-12 text-white animate-bounce" />
            ) : isMuted ? (
              <MicOff className="w-10 h-10 text-red-300" />
            ) : (
              <Mic className="w-10 h-10 text-white" />
            )}
          </div>

          {/* Status Label */}
          <div className="text-center space-y-1">
            <div className="text-sm font-bold text-white">
              {isConnecting
                ? 'Connecting to Gemini Live API...'
                : isAiSpeaking
                ? 'Gemini is speaking...'
                : isConnected
                ? isMuted
                  ? 'Microphone Muted'
                  : 'Listening... Speak naturally anytime'
                : 'Disconnected'}
            </div>
            <div className="text-xs text-slate-400">
              Low-latency full-duplex voice • Interrupt anytime
            </div>
          </div>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="p-3 rounded-2xl bg-red-950/60 border border-red-800/80 text-red-200 text-xs flex items-center gap-2 relative z-10">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Live Controls */}
        <div className="flex items-center justify-center gap-4 relative z-10 pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            disabled={!isConnected}
            aria-label={isMuted ? 'Unmute microphone' : 'Mute microphone'}
            className={`p-4 rounded-2xl transition-all font-bold text-xs flex items-center gap-2 ${
              isMuted
                ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            <span>{isMuted ? 'Unmute' : 'Mute Mic'}</span>
          </button>

          {isConnected ? (
            <button
              type="button"
              onClick={stopVoiceSession}
              className="px-6 py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-red-600/30 transition-all"
            >
              <PhoneOff className="w-4 h-4" />
              <span>End Voice Call</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={startVoiceSession}
              disabled={isConnecting}
              className="px-6 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Reconnect Call</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
