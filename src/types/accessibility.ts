export type TargetAudience =
  | 'plain_language'
  | 'dyslexia_friendly'
  | 'adhd_executive'
  | 'low_vision_screenreader'
  | 'esl_learner'
  | 'all';

export type ContrastTheme = 'default' | 'dark' | 'yellow-black' | 'sepia';

export type ReadingFont = 'default' | 'dyslexic' | 'hyperlegible' | 'lexend';

export interface ActionItem {
  id: string;
  step: string;
  priority: 'urgent' | 'important' | 'routine';
  deadlineOrTiming?: string | null;
  tip?: string;
  completed?: boolean;
}

export interface EasyReadSection {
  heading: string;
  emoji?: string;
  content: string;
  bulletPoints?: string[];
  importantNotice?: string;
}

export interface SyllableBreakdown {
  word: string;
  phonetic: string;
  definition: string;
}

export interface GlossaryItem {
  term: string;
  simpleDefinition: string;
  analogy: string;
}

export interface QACard {
  question: string;
  answer: string;
}

export interface VisualNode {
  id: string;
  icon: string;
  label: string;
  relation: string;
  status: 'safe' | 'action_needed' | 'info';
}

export interface TransformedDocument {
  title: string;
  documentType: string;
  originalReadingGrade: string;
  simplifiedReadingGrade: string;
  readingTimeOriginal: string;
  readingTimeSimplified: string;
  jargonDensityReduction: string;
  oneSentenceSummary: string;
  urgencyLevel: 'Low' | 'Moderate' | 'High / Immediate Action Required' | string;
  keyTakeaways: Array<{ emoji: string; point: string }>;
  actionItems: ActionItem[];
  easyReadSections: EasyReadSection[];
  dyslexiaSupport: {
    syllableBreakdowns: SyllableBreakdown[];
    biteSizedSummary: string[];
  };
  glossary: GlossaryItem[];
  qaCards: QACard[];
  visualNodes: VisualNode[];
  audioNarrationScript: string;
}

export interface SampleDoc {
  id: string;
  title: string;
  category: string;
  icon: string;
  summary: string;
  content: string;
}
