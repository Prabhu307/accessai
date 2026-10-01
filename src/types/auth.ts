import { ContrastTheme, ReadingFont, TransformedDocument } from './accessibility';

export type AccessibilityNeed = 'adhd' | 'dyslexia' | 'low_vision' | 'esl' | 'general';

export interface UserAccessibilityProfile {
  primaryNeed: AccessibilityNeed;
  theme: ContrastTheme;
  fontFamily: ReadingFont;
  fontSize: number; // e.g. 100
  dyslexiaMode: boolean;
  bionicMode: boolean;
  readingRuler: boolean;
  voiceSpeed: number; // 0.75, 1.0, 1.25, 1.5
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  profile: UserAccessibilityProfile;
}

export interface SavedUserDocument {
  id: string;
  userId: string;
  title: string;
  documentType: string;
  originalGrade: string;
  simplifiedGrade: string;
  oneSentenceSummary: string;
  savedAt: string;
  originalText: string;
  data: TransformedDocument;
}
