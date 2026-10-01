import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  Gauge,
  User,
  Check,
  AlertCircle,
} from 'lucide-react';

interface AudioNarratorProps {
  script: string;
  title: string;
}

export const AudioNarrator: React.FC<AudioNarratorProps> = ({ script, title }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRate] = useState<number>(1.0);
  const [voiceIndex, setVoiceIndex] = useState<number>(0);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState<number>(0);
  const [audioSource, setAudioSource] = useState<'browser' | 'gemini_studio'>('browser');
  const [geminiAudioUrl, setGeminiAudioUrl] = useState<string | null>(null);
  const [geminiAudioLoading, setGeminiAudioLoading] = useState(false);
  const [geminiAudioError, setGeminiAudioError] = useState<string | null>(null);

  const sentences = useRef<string[]>([]);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  // Parse sentences
  useEffect(() => {
    if (!script) return;
    const splitSentences = script
      .match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g)
      ?.map((s) => s.trim())
      .filter((s) => s.length > 0) || [script];
    sentences.current = splitSentences;
    setCurrentSentenceIndex(0);
  }, [script]);

  // Load browser speech voices
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;

      const updateVoices = () => {
        const voices = window.speechSynthesis.getVoices().filter((v) => v.lang.startsWith('en'));
        setAvailableVoices(voices.length > 0 ? voices : window.speechSynthesis.getVoices());
      };

      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;

      return () => {
        window.speechSynthesis.cancel();
      };
    }
  }, []);

  // Stop playback on unmount
  useEffect(() => {
    return () => {
      if (synthRef.current) synthRef.current.cancel();
      if (audioElementRef.current) {
        audioElementRef.current.pause();
      }
    };
  }, []);

  const playSentence = (idx: number) => {
    if (!synthRef.current || !sentences.current[idx]) {
      setIsPlaying(false);
      setIsPaused(false);
      return;
    }

    synthRef.current.cancel();
    const sentenceText = sentences.current[idx];
    const utterance = new SpeechSynthesisUtterance(sentenceText);
    utterance.rate = rate;

    if (availableVoices[voiceIndex]) {
      utterance.voice = availableVoices[voiceIndex];
    }

    utterance.onend = () => {
      if (idx + 1 < sentences.current.length) {
        setCurrentSentenceIndex(idx + 1);
        playSentence(idx + 1);
      } else {
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentSentenceIndex(0);
      }
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      setIsPlaying(false);
    };

    currentUtteranceRef.current = utterance;
    synthRef.current.speak(utterance);
    setCurrentSentenceIndex(idx);
    setIsPlaying(true);
    setIsPaused(false);
  };

  const handlePlayPause = async () => {
    if (audioSource === 'gemini_studio') {
      if (!geminiAudioUrl) {
        // Fetch from Gemini TTS endpoint
        await fetchGeminiSpeech();
        return;
      }
      if (audioElementRef.current) {
        if (isPlaying) {
          audioElementRef.current.pause();
          setIsPlaying(false);
        } else {
          audioElementRef.current.play();
          setIsPlaying(true);
        }
      }
      return;
    }

    // Browser speech synthesis
    if (!synthRef.current) return;

    if (isPlaying) {
      synthRef.current.pause();
      setIsPlaying(false);
      setIsPaused(true);
    } else if (isPaused) {
      synthRef.current.resume();
      setIsPlaying(true);
      setIsPaused(false);
    } else {
      playSentence(currentSentenceIndex);
    }
  };

  const handleRestart = () => {
    if (audioSource === 'gemini_studio' && audioElementRef.current) {
      audioElementRef.current.currentTime = 0;
      audioElementRef.current.play();
      setIsPlaying(true);
      return;
    }

    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setCurrentSentenceIndex(0);
    playSentence(0);
  };

  const handleStop = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setIsPaused(false);
  };

  const fetchGeminiSpeech = async () => {
    try {
      setGeminiAudioLoading(true);
      setGeminiAudioError(null);
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: script, voice: 'Kore' }),
      });
      const data = await res.json();
      if (data.success && data.audioBase64) {
        const audioBlob = new Blob([
          Uint8Array.from(atob(data.audioBase64), (c) => c.charCodeAt(0)),
        ], { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setGeminiAudioUrl(url);

        // Auto play
        if (audioElementRef.current) {
          audioElementRef.current.src = url;
          audioElementRef.current.play();
          setIsPlaying(true);
        }
      } else {
        setGeminiAudioError('Could not load Gemini voice; using instant browser voice');
        setAudioSource('browser');
        playSentence(0);
      }
    } catch (err: any) {
      setGeminiAudioError('Fallback to browser voice');
      setAudioSource('browser');
      playSentence(0);
    } finally {
      setGeminiAudioLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-blue-800/60 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-4">
        {/* Top bar with audio mode toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-400/30">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <span>Audio Screen Narrator</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-200 border border-blue-400/30 font-semibold">
                  WCAG Auditory Support
                </span>
              </h3>
              <p className="text-xs text-blue-200/70">
                Natural sentence-by-sentence spoken readout with real-time highlighting
              </p>
            </div>
          </div>

          {/* Engine selector */}
          <div className="flex items-center gap-2 text-xs bg-black/40 p-1 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => {
                handleStop();
                setAudioSource('browser');
              }}
              className={`px-2.5 py-1 rounded-lg transition-all font-medium ${
                audioSource === 'browser'
                  ? 'bg-blue-600 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Instant Browser Voice
            </button>
            <button
              type="button"
              onClick={() => {
                handleStop();
                setAudioSource('gemini_studio');
              }}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 font-medium ${
                audioSource === 'gemini_studio'
                  ? 'bg-gradient-to-r from-amber-500 to-indigo-600 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Gemini AI Voice</span>
            </button>
          </div>
        </div>

        {/* Playback Controls & Voice Settings */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
          {/* Main Play Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePlayPause}
              disabled={geminiAudioLoading}
              aria-label={isPlaying ? 'Pause narration' : 'Play narration'}
              className="px-5 py-2.5 rounded-2xl bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-500/30 transition-transform active:scale-95"
            >
              {geminiAudioLoading ? (
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-slate-950" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>{isPaused ? 'Resume' : 'Listen Now'}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleRestart}
              aria-label="Restart narration from beginning"
              title="Restart from beginning"
              className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleStop}
              aria-label="Stop narration"
              title="Stop narration"
              className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <VolumeX className="w-4 h-4" />
            </button>
          </div>

          {/* Speed & Voice Options */}
          <div className="flex items-center gap-3 text-xs flex-wrap">
            {/* Speed Selector */}
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
              <Gauge className="w-3.5 h-3.5 text-blue-300" />
              <span className="text-blue-200 text-[11px]">Speed:</span>
              <div className="flex items-center gap-1">
                {[0.75, 1.0, 1.25, 1.5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setRate(s);
                      if (synthRef.current && isPlaying) {
                        handleStop();
                      }
                      if (audioElementRef.current) {
                        audioElementRef.current.playbackRate = s;
                      }
                    }}
                    className={`px-1.5 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                      rate === s ? 'bg-blue-500 text-slate-950' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>

            {/* Voice Dropdown for Browser Engine */}
            {audioSource === 'browser' && availableVoices.length > 0 && (
              <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1.5 rounded-xl border border-white/10">
                <User className="w-3.5 h-3.5 text-blue-300" />
                <select
                  aria-label="Select narrator voice"
                  value={voiceIndex}
                  onChange={(e) => {
                    setVoiceIndex(Number(e.target.value));
                    if (isPlaying) handleStop();
                  }}
                  className="bg-transparent text-white text-[11px] font-medium outline-hidden cursor-pointer max-w-[140px] truncate"
                >
                  {availableVoices.map((v, i) => (
                    <option key={i} value={i} className="bg-slate-900 text-white">
                      {v.name.replace(/Google|Microsoft/g, '').trim()}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Live Sentence Tracking Display */}
        <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-blue-300">
            <span>
              Sentence {sentences.current.length > 0 ? currentSentenceIndex + 1 : 0} of{' '}
              {sentences.current.length}
            </span>
            <span className="font-mono text-slate-400">
              {Math.round(
                sentences.current.length > 0
                  ? ((currentSentenceIndex + 1) / sentences.current.length) * 100
                  : 0
              )}
              % completed
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-indigo-400 transition-all duration-300"
              style={{
                width: `${
                  sentences.current.length > 0
                    ? ((currentSentenceIndex + 1) / sentences.current.length) * 100
                    : 0
                }%`,
              }}
            />
          </div>

          {/* Current highlighted sentence */}
          <p className="text-sm sm:text-base font-medium text-slate-200 leading-relaxed min-h-[48px] flex items-center">
            {sentences.current[currentSentenceIndex] ? (
              <span className="bg-blue-500/20 text-blue-200 px-2 py-0.5 rounded border border-blue-400/40">
                "{sentences.current[currentSentenceIndex]}"
              </span>
            ) : (
              <span className="text-slate-400 italic text-xs">
                Press "Listen Now" to hear the plain-language audio narration.
              </span>
            )}
          </p>
        </div>

        {/* Hidden audio element for Gemini TTS stream */}
        <audio
          ref={audioElementRef}
          onEnded={() => setIsPlaying(false)}
          onError={() => setIsPlaying(false)}
          className="hidden"
        />

        {geminiAudioError && (
          <p className="text-xs text-amber-300 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{geminiAudioError}</span>
          </p>
        )}
      </div>
    </div>
  );
};
