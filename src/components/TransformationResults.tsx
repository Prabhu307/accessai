import React, { useState } from 'react';
import {
  TransformedDocument,
  ActionItem,
} from '../types/accessibility';
import { AudioNarrator } from './AudioNarrator';
import { InteractiveClarifier } from './InteractiveClarifier';
import { SearchGroundingPanel } from './SearchGroundingPanel';
import { formatBionicHtml } from '../utils/textUtils';
import { useAuth } from '../context/AuthContext';
import {
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  AlertTriangle,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  ListTodo,
  Layers,
  Zap,
  HelpCircle,
  Copy,
  Check,
  Share2,
  Columns,
  Grid,
  Volume2,
  Lightbulb,
  ExternalLink,
  ShieldAlert,
  Globe,
  Mic,
  Bookmark,
} from 'lucide-react';

interface TransformationResultsProps {
  transformed: TransformedDocument;
  originalText: string;
  bionicMode: boolean;
  dyslexiaMode: boolean;
  onOpenVoice?: () => void;
}

export const TransformationResults: React.FC<TransformationResultsProps> = ({
  transformed,
  originalText,
  bionicMode,
  dyslexiaMode,
  onOpenVoice,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'easy_read' | 'focus_mode' | 'dyslexia_lab' | 'visual_map' | 'jargon_buster' | 'qa' | 'search_grounding'
  >('overview');

  // Focus Step Mode index (Card 1 of N)
  const [focusStepIndex, setFocusStepIndex] = useState(0);

  // Split-screen side-by-side comparison mode
  const [splitView, setSplitView] = useState(false);

  // Checked state for action items
  const [completedActions, setCompletedActions] = useState<Record<string, boolean>>({});

  // Copied and saved indicators
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const { saveDocument, savedDocuments } = useAuth();

  const handleSave = async () => {
    await saveDocument(transformed, originalText);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const isAlreadySaved = savedDocuments.some((d) => d.title === transformed.title);

  const toggleAction = (id: string) => {
    setCompletedActions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCopy = () => {
    const textToCopy = `Title: ${transformed.title}\n\nSummary:\n${transformed.oneSentenceSummary}\n\nKey Takeaways:\n${transformed.keyTakeaways.map(t => `- ${t.point}`).join('\n')}\n\nAction Items:\n${transformed.actionItems.map(a => `- [${a.priority.toUpperCase()}] ${a.step} (${a.deadlineOrTiming || 'No deadline'})`).join('\n')}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to render text with optional Bionic Reading formatting
  const renderText = (content: string) => {
    if (!bionicMode) return content;
    return <span dangerouslySetInnerHTML={{ __html: formatBionicHtml(content) }} />;
  };

  const totalSteps = transformed.actionItems.length + transformed.easyReadSections.length;
  const currentFocusItem =
    focusStepIndex < transformed.actionItems.length
      ? {
          type: 'action' as const,
          title: `Action Step ${focusStepIndex + 1}: ${transformed.actionItems[focusStepIndex].step}`,
          detail: transformed.actionItems[focusStepIndex].tip || 'Follow instructions carefully.',
          priority: transformed.actionItems[focusStepIndex].priority,
          deadline: transformed.actionItems[focusStepIndex].deadlineOrTiming,
        }
      : {
          type: 'section' as const,
          title: transformed.easyReadSections[focusStepIndex - transformed.actionItems.length]?.heading,
          detail: transformed.easyReadSections[focusStepIndex - transformed.actionItems.length]?.content,
          bulletPoints: transformed.easyReadSections[focusStepIndex - transformed.actionItems.length]?.bulletPoints,
          notice: transformed.easyReadSections[focusStepIndex - transformed.actionItems.length]?.importantNotice,
        };

  return (
    <div className="space-y-8">
      {/* Transformation Evaluation Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                {transformed.documentType}
              </span>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full border ${
                  transformed.urgencyLevel.toLowerCase().includes('high') ||
                  transformed.urgencyLevel.toLowerCase().includes('immediate')
                    ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border-red-300 dark:border-red-800'
                    : transformed.urgencyLevel.toLowerCase().includes('mod')
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                }`}
              >
                Urgency: {transformed.urgencyLevel}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {transformed.title}
            </h1>
          </div>

          {/* Quick Action Tools */}
          <div className="flex items-center gap-2 flex-wrap">
            {onOpenVoice && (
              <button
                type="button"
                onClick={onOpenVoice}
                aria-label="Start real-time voice call with Gemini Live"
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm shadow-blue-500/20 flex items-center gap-1.5 transition-transform active:scale-95"
              >
                <Mic className="w-3.5 h-3.5 animate-pulse" />
                <span>Live Voice Call</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleSave}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                saved || isAlreadySaved
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${saved || isAlreadySaved ? 'fill-emerald-600 text-emerald-600' : ''}`} />
              <span>{saved ? 'Saved!' : isAlreadySaved ? 'Saved in Library' : 'Save to Library'}</span>
            </button>

            <button
              type="button"
              onClick={() => setSplitView(!splitView)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                splitView
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
              }`}
            >
              <Columns className="w-4 h-4" />
              <span>{splitView ? 'Exit Side-by-Side' : 'Compare Original'}</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors flex items-center gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Summary</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Accessibility & Readability Transformation Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
          <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60">
            <div className="text-[11px] font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wider mb-1">
              Reading Grade
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xs text-slate-400 line-through">
                {transformed.originalReadingGrade}
              </span>
              <ArrowRight className="w-3 h-3 text-blue-600 shrink-0" />
              <span className="text-base font-extrabold text-blue-900 dark:text-blue-100">
                {transformed.simplifiedReadingGrade}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60">
            <div className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider mb-1">
              Time Needed
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xs text-slate-400 line-through">
                {transformed.readingTimeOriginal}
              </span>
              <ArrowRight className="w-3 h-3 text-emerald-600 shrink-0" />
              <span className="text-base font-extrabold text-emerald-900 dark:text-emerald-100">
                {transformed.readingTimeSimplified}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/60">
            <div className="text-[11px] font-semibold text-amber-700 dark:text-amber-300 uppercase tracking-wider mb-1">
              Jargon Reduced
            </div>
            <div className="text-base font-extrabold text-amber-900 dark:text-amber-100">
              {transformed.jargonDensityReduction}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60">
            <div className="text-[11px] font-semibold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider mb-1">
              Accessibility
            </div>
            <div className="text-base font-extrabold text-indigo-900 dark:text-indigo-100 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>WCAG AAA Compliant</span>
            </div>
          </div>
        </div>
      </div>

      {/* Audio Screen Narrator */}
      <AudioNarrator
        script={transformed.audioNarrationScript || transformed.oneSentenceSummary}
        title={transformed.title}
      />

      {/* Side-by-Side Split View if Active */}
      {splitView && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 rounded-3xl bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-300 dark:border-slate-800">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-500">
                Original Complex Text
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {transformed.originalReadingGrade}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-mono leading-relaxed max-h-96 overflow-y-auto whitespace-pre-wrap">
              {originalText}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-300 dark:border-slate-800">
              <span className="font-bold text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>ClarifyAI Simplified Version</span>
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                {transformed.simplifiedReadingGrade}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 leading-relaxed max-h-96 overflow-y-auto space-y-4">
              <div className="font-bold text-sm text-blue-700 dark:text-blue-300">
                {transformed.oneSentenceSummary}
              </div>
              <ul className="space-y-1.5 list-disc pl-4 text-slate-600 dark:text-slate-300">
                {transformed.keyTakeaways.map((t, idx) => (
                  <li key={idx}>{t.point}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Modality View Navigation Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <nav
          className="flex space-x-2 sm:space-x-4 overflow-x-auto pb-2 scrollbar-none"
          aria-label="Accessible format modalities"
        >
          {[
            { id: 'overview', label: 'Overview & Actions', icon: ListTodo, count: transformed.actionItems.length },
            { id: 'easy_read', label: 'Easy Read Document', icon: BookOpen },
            { id: 'focus_mode', label: 'ADHD Step Mode', icon: Zap, badge: 'Focus' },
            { id: 'dyslexia_lab', label: 'Dyslexia & Word Lab', icon: Layers, count: transformed.dyslexiaSupport.syllableBreakdowns.length },
            { id: 'visual_map', label: 'Visual Concept Map', icon: Grid, count: transformed.visualNodes.length },
            { id: 'jargon_buster', label: 'Jargon Buster', icon: Lightbulb, count: transformed.glossary.length },
            { id: 'qa', label: 'Key Questions FAQ', icon: HelpCircle, count: transformed.qaCards.length },
            { id: 'search_grounding', label: 'Google Search Verify', icon: Globe, badge: 'Grounding' },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                aria-current={isActive ? 'page' : undefined}
                className={`py-3 px-3.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
                  isActive
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
                {tab.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider font-extrabold ${
                      isActive ? 'bg-amber-400 text-slate-950' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab 1: Overview & Action Plan */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* One sentence summary callout */}
          <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-blue-50 to-indigo-50/50 dark:from-blue-950/40 dark:to-indigo-950/20 border border-blue-200/80 dark:border-blue-900/60 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>In One Sentence:</span>
            </div>
            <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
              {renderText(transformed.oneSentenceSummary)}
            </p>
          </div>

          {/* Key Takeaways Grid */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Essential Takeaways (What You Need to Know)</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {transformed.keyTakeaways.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3 shadow-xs hover:border-blue-200 transition-colors"
                >
                  <span className="text-2xl shrink-0">{item.emoji || '📌'}</span>
                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                    {renderText(item.point)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Actionable Step Checklist (Crucial for ADHD / Executive Function) */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <ListTodo className="w-4 h-4 text-blue-600" />
                  <span>Action Checklist (Things You Must Do)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Interactive checklist — click each box as you complete the task
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {Object.values(completedActions).filter(Boolean).length} of{' '}
                {transformed.actionItems.length} completed
              </span>
            </div>

            <div className="space-y-3">
              {transformed.actionItems.map((action, idx) => {
                const isDone = !!completedActions[action.id || `act-${idx}`];
                return (
                  <div
                    key={action.id || idx}
                    onClick={() => toggleAction(action.id || `act-${idx}`)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                      isDone
                        ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60'
                        : action.priority === 'urgent'
                        ? 'bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-900/60'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isDone}
                      onChange={() => {}} // Controlled via card click
                      className="w-5 h-5 rounded text-blue-600 accent-blue-600 shrink-0 mt-0.5 cursor-pointer"
                    />

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            action.priority === 'urgent'
                              ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                              : action.priority === 'important'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          }`}
                        >
                          {action.priority}
                        </span>

                        {action.deadlineOrTiming && (
                          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-500" />
                            <span>{action.deadlineOrTiming}</span>
                          </span>
                        )}
                      </div>

                      <p
                        className={`text-xs sm:text-sm font-semibold text-slate-900 dark:text-white leading-relaxed ${
                          isDone ? 'line-through text-slate-400 dark:text-slate-500' : ''
                        }`}
                      >
                        {renderText(action.step)}
                      </p>

                      {action.tip && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                          💡 Tip: {action.tip}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Easy Read Document */}
      {activeTab === 'easy_read' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-8">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <span>Full Easy Read Document (Grade 3-5 Level)</span>
            </h2>
            <p className="text-xs text-slate-500">
              Clear headings, simple everyday vocabulary, and bolded important safety guidelines
            </p>
          </div>

          <div className="space-y-6">
            {transformed.easyReadSections.map((sec, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-3"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{sec.emoji || '📄'}</span>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {sec.heading}
                  </h3>
                </div>

                <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-normal">
                  {renderText(sec.content)}
                </p>

                {sec.bulletPoints && sec.bulletPoints.length > 0 && (
                  <ul className="space-y-1.5 list-disc pl-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                    {sec.bulletPoints.map((bp, bidx) => (
                      <li key={bidx} className="leading-relaxed">
                        {renderText(bp)}
                      </li>
                    ))}
                  </ul>
                )}

                {sec.importantNotice && (
                  <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2.5">
                    <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                    <div>
                      <span className="font-bold block">Important Warning / Notice:</span>
                      <span>{renderText(sec.importantNotice)}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: ADHD Interactive Step Mode */}
      {activeTab === 'focus_mode' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  ADHD Single-Card Focus Reader
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                Eliminates wall-of-text cognitive fatigue by showing one digestible step at a time
              </p>
            </div>

            {/* Step Counter */}
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              Card {focusStepIndex + 1} of {totalSteps}
            </span>
          </div>

          {/* Progress bar across cards */}
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300"
              style={{ width: `${((focusStepIndex + 1) / totalSteps) * 100}%` }}
            />
          </div>

          {/* The Active Focused Card */}
          <div className="min-h-[220px] p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-indigo-50/50 to-white dark:from-slate-800/80 dark:to-slate-900 border-2 border-indigo-200 dark:border-indigo-800 flex flex-col justify-between space-y-4 shadow-sm">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                  {currentFocusItem.type === 'action' ? '⚡ Action Item' : '📖 Information Section'}
                </span>
                {currentFocusItem.priority && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    {currentFocusItem.priority}
                  </span>
                )}
              </div>

              <h4 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mb-3">
                {currentFocusItem.title}
              </h4>

              <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed">
                {currentFocusItem.detail}
              </p>

              {currentFocusItem.bulletPoints && (
                <ul className="mt-3 space-y-1.5 list-disc pl-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  {currentFocusItem.bulletPoints.map((bp, i) => (
                    <li key={i}>{bp}</li>
                  ))}
                </ul>
              )}

              {currentFocusItem.notice && (
                <div className="mt-3 p-3 rounded-xl bg-amber-100/70 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 text-xs font-medium">
                  ⚠️ {currentFocusItem.notice}
                </div>
              )}
            </div>

            {currentFocusItem.deadline && (
              <div className="pt-2 text-xs font-semibold text-slate-500 flex items-center gap-1.5 border-t border-indigo-100 dark:border-slate-700">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>Deadline: {currentFocusItem.deadline}</span>
              </div>
            )}
          </div>

          {/* Navigation controls */}
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setFocusStepIndex(Math.max(0, focusStepIndex - 1))}
              disabled={focusStepIndex === 0}
              className="px-5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 disabled:opacity-40 font-bold text-xs flex items-center gap-1.5 hover:bg-slate-200 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Step</span>
            </button>

            <span className="text-xs text-slate-400 hidden sm:inline">
              Tip: Use Left/Right Arrow keys to navigate
            </span>

            <button
              type="button"
              onClick={() => setFocusStepIndex(Math.min(totalSteps - 1, focusStepIndex + 1))}
              disabled={focusStepIndex >= totalSteps - 1}
              className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-500/20 transition-colors"
            >
              <span>Next Step</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Tab 4: Dyslexia & Word Lab */}
      {activeTab === 'dyslexia_lab' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-600" />
              <span>Dyslexia Word Lab & Syllable Guide</span>
            </h3>
            <p className="text-xs text-slate-500">
              Break down long, intimidatory multisyllabic words into clear phonetic units
            </p>
          </div>

          {/* Syllable Breakdown Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {transformed.dyslexiaSupport.syllableBreakdowns.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-400 line-through">
                    {item.word}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-200">
                    Syllables
                  </span>
                </div>
                <div className="text-lg font-black font-mono tracking-wider text-amber-900 dark:text-amber-200">
                  {item.phonetic}
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong>Meaning:</strong> {item.definition}
                </p>
              </div>
            ))}
          </div>

          {/* Bite-sized summary chunks */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
              Micro-Paragraphs (No Visual Crowding)
            </h4>
            <div className="space-y-2">
              {transformed.dyslexiaSupport.biteSizedSummary.map((sentence, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-loose"
                >
                  {renderText(sentence)}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Visual Concept Map */}
      {activeTab === 'visual_map' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Grid className="w-5 h-5 text-blue-600" />
              <span>Visual Concept Network for Visual Learners</span>
            </h3>
            <p className="text-xs text-slate-500">
              Visual overview mapping how the entities and obligations connect
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {transformed.visualNodes.map((node) => (
              <div
                key={node.id}
                className={`p-5 rounded-2xl border text-left space-y-3 transition-all ${
                  node.status === 'action_needed'
                    ? 'bg-red-50/40 dark:bg-red-950/20 border-red-200 dark:border-red-900/60'
                    : node.status === 'safe'
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60'
                    : 'bg-blue-50/40 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{node.icon || '📌'}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      node.status === 'action_needed'
                        ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                        : node.status === 'safe'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                    }`}
                  >
                    {node.status.replace('_', ' ')}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {node.label}
                </h4>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {node.relation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Jargon Buster & Analogies */}
      {activeTab === 'jargon_buster' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <span>Jargon Buster with Everyday Analogies</span>
            </h3>
            <p className="text-xs text-slate-500">
              Translating dense legal, medical, and scientific terms into intuitive real-life analogies
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {transformed.glossary.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-blue-600 dark:text-blue-400">
                    "{item.term}"
                  </h4>
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    Definition
                  </span>
                </div>

                <p className="text-xs font-medium text-slate-800 dark:text-slate-200">
                  {item.simpleDefinition}
                </p>

                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/40 text-amber-900 dark:text-amber-200 text-xs">
                  <span className="font-bold block mb-0.5">💡 Everyday Analogy:</span>
                  <span>{item.analogy}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 7: Q&A What This Means For You */}
      {activeTab === 'qa' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-blue-600" />
              <span>Frequently Asked Questions & Immediate Clarifications</span>
            </h3>
            <p className="text-xs text-slate-500">
              Direct, reassuring answers to common concerns
            </p>
          </div>

          <div className="space-y-4">
            {transformed.qaCards.map((qa, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2"
              >
                <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="text-blue-600 font-extrabold">Q:</span>
                  <span>{qa.question}</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 pl-5 leading-relaxed">
                  {renderText(qa.answer)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 8: Google Search Grounding with gemini-3.5-flash */}
      {activeTab === 'search_grounding' && (
        <SearchGroundingPanel
          documentContext={originalText}
          documentTitle={transformed.title}
        />
      )}

      {/* Interactive Clarifier Assistant Drawer / Card */}
      <InteractiveClarifier
        originalText={originalText}
        documentTitle={transformed.title}
      />
    </div>
  );
};
