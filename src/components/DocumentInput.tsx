import React, { useState, useRef, useMemo } from 'react';
import { TargetAudience, SampleDoc } from '../types/accessibility';
import { SAMPLE_DOCUMENTS } from '../data/sampleDocuments';
import { calculateReadabilityMetrics } from '../utils/textUtils';
import {
  FileText,
  UploadCloud,
  Sparkles,
  Layers,
  Brain,
  Zap,
  Eye,
  Globe,
  Loader2,
  Trash2,
  Info,
  CheckCircle,
  AlertCircle,
  FileCheck,
} from 'lucide-react';

interface DocumentInputProps {
  inputText: string;
  setInputText: (text: string) => void;
  targetAudience: TargetAudience;
  setTargetAudience: (aud: TargetAudience) => void;
  customInstructions: string;
  setCustomInstructions: (inst: string) => void;
  tone: string;
  setTone: (t: string) => void;
  onTransform: () => void;
  isLoading: boolean;
  selectedSampleId: string;
  setSelectedSampleId: (id: string) => void;
  onSelectSampleDoc?: (sample: SampleDoc) => void;
}

export const DocumentInput: React.FC<DocumentInputProps> = ({
  inputText,
  setInputText,
  targetAudience,
  setTargetAudience,
  customInstructions,
  setCustomInstructions,
  tone,
  setTone,
  onTransform,
  isLoading,
  selectedSampleId,
  setSelectedSampleId,
  onSelectSampleDoc,
}) => {
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrError, setOcrError] = useState<string | null>(null);
  const [ocrSuccess, setOcrSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Readability statistics calculated live
  const metrics = useMemo(() => calculateReadabilityMetrics(inputText), [inputText]);

  const handleSelectSample = (sample: SampleDoc) => {
    setSelectedSampleId(sample.id);
    setInputText(sample.content);
    setOcrSuccess(false);
    setOcrError(null);
    if (onSelectSampleDoc) {
      onSelectSampleDoc(sample);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';

    // If text file
    if (file.type.startsWith('text/') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          setInputText(content);
          setSelectedSampleId('custom');
          setOcrSuccess(true);
        }
      };
      reader.readAsText(file);
      return;
    }

    // If image file -> run multimodal OCR via server endpoint
    if (file.type.startsWith('image/')) {
      setOcrLoading(true);
      setOcrError(null);
      setOcrSuccess(false);

      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Data = event.target?.result as string;
        try {
          const res = await fetch('/api/ocr', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              imageBase64: base64Data,
              mimeType: file.type,
            }),
          });
          const data = await res.json();
          if (data.success && data.text) {
            setInputText(data.text);
            setSelectedSampleId('custom');
            setOcrSuccess(true);
          } else {
            setOcrError(data.error || 'Could not extract text from image');
          }
        } catch (err: any) {
          setOcrError(err.message || 'Network error extracting text from image');
        } finally {
          setOcrLoading(false);
        }
      };
      reader.readAsDataURL(file);
    } else {
      setOcrError('Please upload an image (.png, .jpg, .webp) or text file (.txt, .md)');
    }
  };

  const audienceOptions: Array<{
    id: TargetAudience;
    label: string;
    icon: any;
    desc: string;
    badge: string;
  }> = [
    {
      id: 'plain_language',
      label: 'Plain Language / Easy Read',
      icon: Brain,
      desc: 'Transforms into Grade 3-5 reading level with short sentences and zero jargon.',
      badge: 'Cognitive & Clarity',
    },
    {
      id: 'dyslexia_friendly',
      label: 'Dyslexia Friendly',
      icon: Layers,
      desc: 'Bite-sized chunks, syllable breakdown of long terms, and phonetic guides.',
      badge: 'Visual Ease',
    },
    {
      id: 'adhd_executive',
      label: 'ADHD & Focus Mode',
      icon: Zap,
      desc: 'Actionable step-by-step checklist, deadlines highlighted, and one-card-at-a-time view.',
      badge: 'Executive Function',
    },
    {
      id: 'low_vision_screenreader',
      label: 'Vision & Screen-Reader',
      icon: Eye,
      desc: 'Semantic landmark hierarchy, spoken script description, and high clarity.',
      badge: 'Screen Reader',
    },
    {
      id: 'esl_learner',
      label: 'Non-Native / ESL',
      icon: Globe,
      desc: 'Idioms simplified, everyday vocabulary, and straightforward grammar.',
      badge: 'Language Support',
    },
    {
      id: 'all',
      label: 'All Modalities (Comprehensive)',
      icon: Sparkles,
      desc: 'Generates full plain language, checklists, syllables, glossary, and audio script.',
      badge: 'Complete Suite',
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden p-6 sm:p-8 space-y-8">
      {/* Real-World Evaluation Library */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-blue-600" />
              <span>Real-World Evaluation Library</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select an authentic complex document to test or paste your own below
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 w-fit">
            5 Domains Available
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {SAMPLE_DOCUMENTS.map((doc) => {
            const isSelected = selectedSampleId === doc.id;
            return (
              <button
                key={doc.id}
                type="button"
                onClick={() => handleSelectSample(doc)}
                className={`p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between group ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/40 ring-2 ring-blue-500/30'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{doc.icon}</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                      {doc.category}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 line-clamp-1 group-hover:text-blue-600">
                    {doc.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                    {doc.summary}
                  </p>
                </div>
                {isSelected && (
                  <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Selected</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Text Input Area & OCR Upload */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <label htmlFor="source-document-text" className="font-bold text-sm text-slate-900 dark:text-white">
              Complex Document Content
            </label>
          </div>

          {/* Action buttons (Clear, OCR Upload) */}
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*,.txt,.md"
              className="hidden"
              id="file-upload-input"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={ocrLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              {ocrLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                  <span>Gemini OCR Scanning...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-3.5 h-3.5 text-blue-600" />
                  <span>Upload Photo or Text</span>
                </>
              )}
            </button>

            {inputText && (
              <button
                type="button"
                onClick={() => {
                  setInputText('');
                  setSelectedSampleId('custom');
                  setOcrSuccess(false);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                title="Clear text"
                aria-label="Clear document text"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* OCR Status notifications */}
        {ocrSuccess && (
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>Document text successfully loaded from file! Ready for accessibility transformation.</span>
          </div>
        )}
        {ocrError && (
          <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{ocrError}</span>
          </div>
        )}

        {/* Textarea */}
        <div className="relative">
          <textarea
            id="source-document-text"
            rows={7}
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              setSelectedSampleId('custom');
            }}
            placeholder="Paste your complex letter, medical discharge note, legal agreement, insurance policy, tax notice, or research abstract here..."
            className="w-full p-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50/40 dark:bg-slate-900/80 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-sm focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-mono leading-relaxed"
          />
        </div>

        {/* Live Readability Evaluation Banner */}
        {inputText.trim().length > 0 && (
          <div className="bg-slate-100 dark:bg-slate-800/80 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-4 flex-wrap">
              <div>
                <span className="text-slate-400 block">Length:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {metrics.words} words ({metrics.sentences} sentences)
                </span>
              </div>
              <div className="h-6 w-px bg-slate-300 dark:bg-slate-700 hidden sm:block" />
              <div>
                <span className="text-slate-400 block">Current Reading Grade:</span>
                <span className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                  Grade {metrics.gradeLevel} (
                  {metrics.gradeLevel >= 13
                    ? 'College / Dense Professional'
                    : metrics.gradeLevel >= 9
                    ? 'High School'
                    : 'Middle School'}
                  )
                </span>
              </div>
              <div className="h-6 w-px bg-slate-300 dark:bg-slate-700 hidden sm:block" />
              <div>
                <span className="text-slate-400 block">Flesch Reading Ease:</span>
                <span className={`font-bold ${
                  metrics.readingEase < 40 ? 'text-red-600 dark:text-red-400' : 'text-blue-600'
                }`}>
                  {metrics.readingEase}/100 ({metrics.readingEase < 40 ? 'Very Difficult' : 'Moderate'})
                </span>
              </div>
              <div className="h-6 w-px bg-slate-300 dark:bg-slate-700 hidden sm:block" />
              <div>
                <span className="text-slate-400 block">Estimated Read Time:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  ~{metrics.estimatedMinutes} min
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[11px] text-slate-500">
              <Info className="w-3.5 h-3.5 text-blue-500" />
              <span>Target: Grade 3-5 Plain English</span>
            </div>
          </div>
        )}
      </div>

      {/* Target Audience Selector */}
      <div className="space-y-3">
        <label className="block text-sm font-bold text-slate-900 dark:text-white">
          Primary Accessibility Need & Modality
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {audienceOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = targetAudience === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setTargetAudience(opt.id)}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 ring-2 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/30'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {opt.badge}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                    {opt.label}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                    {opt.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tone & Custom Instructions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div>
          <label htmlFor="tone-select" className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
            Explanation Tone
          </label>
          <select
            id="tone-select"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium"
          >
            <option value="warm and reassuring">Warm, gentle, and reassuring</option>
            <option value="direct and concise">Direct, concise, and punchy</option>
            <option value="step by step tutor">Step-by-step patient tutor</option>
            <option value="everyday conversational">Everyday casual conversation</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="custom-instructions" className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
            Specific Focus or Constraints (Optional)
          </label>
          <input
            id="custom-instructions"
            type="text"
            value={customInstructions}
            onChange={(e) => setCustomInstructions(e.target.value)}
            placeholder="e.g. 'Focus on exact medication dosages', 'Highlight my payment obligations and deadlines', 'Explain for an elderly parent'..."
            className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Transform Action CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="text-xs text-slate-500 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Powered by Gemini 3.8 Flash • Preserves 100% of crucial facts & figures</span>
        </div>

        <button
          type="button"
          onClick={onTransform}
          disabled={isLoading || !inputText.trim()}
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold text-sm shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Simplifying & Restructuring...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Transform with ClarifyAI</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
