import React, { useState, useEffect } from 'react';
import {
  TargetAudience,
  ContrastTheme,
  ReadingFont,
  TransformedDocument,
} from './types/accessibility';
import { SAMPLE_DOCUMENTS } from './data/sampleDocuments';
import { INITIAL_DEMO_RESULT, PRECOMPUTED_DEMOS } from './data/initialDemoData';
import { Header } from './components/Header';
import { DocumentInput } from './components/DocumentInput';
import { TransformationResults } from './components/TransformationResults';
import { VoiceConversationModal } from './components/VoiceConversationModal';
import { AuthModal } from './components/AuthModal';
import { SavedDocumentsDrawer } from './components/SavedDocumentsDrawer';
import { useAuth } from './context/AuthContext';
import {
  Sparkles,
  AlertCircle,
  Accessibility,
  HeartHandshake,
  ShieldCheck,
  CheckCircle2,
  FileText,
  RefreshCw,
} from 'lucide-react';

export default function App() {
  // Accessibility states
  const [theme, setTheme] = useState<ContrastTheme>('default');
  const [fontFamily, setFontFamily] = useState<ReadingFont>('hyperlegible');
  const [fontSize, setFontSize] = useState<number>(100);
  const [dyslexiaMode, setDyslexiaMode] = useState<boolean>(false);
  const [bionicMode, setBionicMode] = useState<boolean>(false);
  const [rulerActive, setRulerActive] = useState<boolean>(false);
  const [rulerY, setRulerY] = useState<number>(200);

  // Document states (Preloaded with default Medical Discharge for instant exploration)
  const [selectedSampleId, setSelectedSampleId] = useState<string>('medical-discharge');
  const [inputText, setInputText] = useState<string>(SAMPLE_DOCUMENTS[0].content);
  const [targetAudience, setTargetAudience] = useState<TargetAudience>('all');
  const [customInstructions, setCustomInstructions] = useState<string>('');
  const [tone, setTone] = useState<string>('warm and reassuring');

  // Transformation states
  const [transformed, setTransformed] = useState<TransformedDocument | null>(INITIAL_DEMO_RESULT);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);

  // User Auth & Saved Documents Drawer states
  const { user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'signup' | 'login'>('signup');
  const [isSavedDocsOpen, setIsSavedDocsOpen] = useState<boolean>(false);

  // Automatically apply user accessibility preferences when user logs in or updates profile
  useEffect(() => {
    if (user?.profile) {
      setTheme(user.profile.theme);
      setFontFamily(user.profile.fontFamily);
      setFontSize(user.profile.fontSize);
      setDyslexiaMode(user.profile.dyslexiaMode);
      setBionicMode(user.profile.bionicMode);
      setRulerActive(user.profile.readingRuler);
    }
  }, [user]);

  // Handle Reading Ruler mouse movement
  useEffect(() => {
    if (!rulerActive) return;

    const handleMouseMove = (e: MouseEvent) => {
      setRulerY(e.clientY - 24);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [rulerActive]);

  // Keyboard accessibility shortcuts (WCAG compliant)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in textarea or input
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') {
        return;
      }

      if (e.altKey && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault();
        setTheme((prev) => {
          if (prev === 'default') return 'dark';
          if (prev === 'dark') return 'yellow-black';
          if (prev === 'yellow-black') return 'sepia';
          return 'default';
        });
      }

      if (e.altKey && (e.key === 'b' || e.key === 'B')) {
        e.preventDefault();
        setBionicMode((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle API transformation call
  const handleTransform = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/transform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputText,
          targetAudience,
          customInstructions,
          tone,
        }),
      });

      const data = await response.json();
      if (data.success && data.data) {
        setTransformed(data.data);
        // Scroll to results smoothly
        const resultsEl = document.getElementById('transformation-results-anchor');
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        setError(data.error || 'Failed to transform document');
      }
    } catch (err: any) {
      setError(err.message || 'Network error occurred while transforming content');
    } finally {
      setIsLoading(false);
    }
  };

  // Determine container classes based on selected theme & font
  const themeClass =
    theme === 'dark'
      ? 'theme-dark'
      : theme === 'yellow-black'
      ? 'theme-yellow-black'
      : theme === 'sepia'
      ? 'theme-sepia'
      : 'theme-default';

  const fontClass = dyslexiaMode
    ? 'font-dyslexia'
    : fontFamily === 'dyslexic'
    ? 'font-dyslexia'
    : fontFamily === 'hyperlegible'
    ? 'font-hyper'
    : fontFamily === 'lexend'
    ? 'font-lexend'
    : 'font-sans';

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${themeClass} ${fontClass}`}
      style={{ fontSize: `${fontSize}%` }}
    >
      {/* Reading Ruler overlay */}
      {rulerActive && (
        <div
          className="reading-ruler"
          style={{ top: `${rulerY}px` }}
          aria-hidden="true"
        />
      )}

      {/* Main Header with WCAG AAA toolbar */}
      <Header
        theme={theme}
        setTheme={setTheme}
        fontFamily={fontFamily}
        setFontFamily={setFontFamily}
        fontSize={fontSize}
        setFontSize={setFontSize}
        dyslexiaMode={dyslexiaMode}
        setDyslexiaMode={setDyslexiaMode}
        bionicMode={bionicMode}
        setBionicMode={setBionicMode}
        rulerActive={rulerActive}
        setRulerActive={setRulerActive}
        onOpenVoice={() => setIsVoiceModalOpen(true)}
        onOpenAuth={(mode) => {
          setAuthModalMode(mode);
          setIsAuthModalOpen(true);
        }}
        onOpenSavedDocs={() => setIsSavedDocsOpen(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Hero Banner for Problem 29 */}
        <section aria-labelledby="hero-title" className="text-center max-w-3xl mx-auto space-y-3 pt-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold">
            <Accessibility className="w-3.5 h-3.5" />
            <span>AI Hackathon Problem #29: AI Accessibility Assistant</span>
          </div>

          <h1
            id="hero-title"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight"
          >
            Transform Complex Information into{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500 bg-clip-text text-transparent">
              Accessible Formats for Everyone
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Medical discharge summaries, legal agreements, tax notices, and scientific abstracts rewritten into Grade 3-5 plain language, ADHD focus cards, dyslexia-friendly syllables, visual concept maps, and audio narration.
          </p>
        </section>

        {/* Error notification if API fails */}
        {error && (
          <div
            role="alert"
            className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 text-sm flex items-center justify-between gap-3 shadow-sm"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={handleTransform}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Input Document Workspace */}
        <DocumentInput
          inputText={inputText}
          setInputText={setInputText}
          targetAudience={targetAudience}
          setTargetAudience={setTargetAudience}
          customInstructions={customInstructions}
          setCustomInstructions={setCustomInstructions}
          tone={tone}
          setTone={setTone}
          onTransform={handleTransform}
          isLoading={isLoading}
          selectedSampleId={selectedSampleId}
          setSelectedSampleId={setSelectedSampleId}
          onSelectSampleDoc={(sample) => {
            if (PRECOMPUTED_DEMOS[sample.id]) {
              setTransformed(PRECOMPUTED_DEMOS[sample.id]);
              setError(null);
            }
          }}
        />

        {/* Anchor for auto-scroll after transformation */}
        <div id="transformation-results-anchor" />

        {/* Transformation Results Presentation */}
        {transformed && (
          <TransformationResults
            transformed={transformed}
            originalText={inputText}
            bionicMode={bionicMode}
            dyslexiaMode={dyslexiaMode}
            onOpenVoice={() => setIsVoiceModalOpen(true)}
          />
        )}

        {/* Real-time Voice Assistant Modal with gemini-3.8-live */}
        <VoiceConversationModal
          isOpen={isVoiceModalOpen}
          onClose={() => setIsVoiceModalOpen(false)}
          documentContext={inputText}
          documentTitle={transformed?.title}
        />

        {/* User Sign Up / Log In Modal */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          defaultMode={authModalMode}
        />

        {/* Saved User Documents Drawer */}
        <SavedDocumentsDrawer
          isOpen={isSavedDocsOpen}
          onClose={() => setIsSavedDocsOpen(false)}
          onSelectDocument={(doc) => {
            setInputText(doc.originalText);
            setTransformed(doc.data);
            setSelectedSampleId('');
            const el = document.getElementById('transformation-results-anchor');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Accessibility & Ethical AI Statement Footer */}
        <footer className="pt-12 pb-8 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Inclusive Design • WCAG 2.2 AAA Guidance • Flesch-Kincaid Verified
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                <HeartHandshake className="w-3.5 h-3.5 text-blue-500" />
                <span>Cognitive, Visual & Neurodivergent Accessibility</span>
              </span>
            </div>
          </div>

          <p className="text-center text-[11px] text-slate-400 leading-relaxed max-w-xl mx-auto">
            ClarifyAI is engineered for the Gemma / AI Hackathon (Problem Statement 29). It preserves essential facts while adapting syntax, visual layout, and auditory cadence for users of all abilities.
          </p>
        </footer>
      </main>
    </div>
  );
}
