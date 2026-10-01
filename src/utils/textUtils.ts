/**
 * Utility functions for readability assessment, Bionic Reading transformation,
 * and text processing for accessibility.
 */

// Count syllables in an English word using phonetic heuristics
export function countSyllables(word: string): number {
  word = word.toLowerCase().trim();
  if (word.length <= 3) return 1;
  word = word.replace(/(?:[^laeiouy]|ed|es|e)$/, '');
  word = word.replace(/^y/, '');
  const matches = word.match(/[aeiouy]{1,2}/g);
  return matches ? Math.max(1, matches.length) : 1;
}

// Calculate Flesch-Kincaid Reading Ease & Grade Level
export function calculateReadabilityMetrics(text: string): {
  words: number;
  sentences: number;
  syllables: number;
  readingEase: number;
  gradeLevel: number;
  estimatedMinutes: number;
} {
  if (!text || text.trim().length === 0) {
    return { words: 0, sentences: 0, syllables: 0, readingEase: 100, gradeLevel: 0, estimatedMinutes: 0 };
  }

  const rawWords = text.trim().split(/\s+/).filter(Boolean);
  const words = rawWords.length;
  if (words === 0) {
    return { words: 0, sentences: 0, syllables: 0, readingEase: 100, gradeLevel: 0, estimatedMinutes: 0 };
  }

  // Count sentences
  const sentenceMatches = text.match(/[^.!?]+[.!?]+(\s|$)/g) || [text];
  const sentences = Math.max(1, sentenceMatches.length);

  // Total syllables
  let syllables = 0;
  for (const w of rawWords) {
    syllables += countSyllables(w.replace(/[^a-zA-Z]/g, ''));
  }

  // Flesch Reading Ease Formula: 206.835 - 1.015 * (total words / total sentences) - 84.6 * (total syllables / total words)
  const readingEase = Math.round(
    Math.max(0, Math.min(100, 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words)))
  );

  // Flesch-Kincaid Grade Level: 0.39 * (words / sentences) + 11.8 * (syllables / words) - 15.59
  const gradeLevel = Math.max(1, Math.round((0.39 * (words / sentences) + 11.8 * (syllables / words) - 15.59) * 10) / 10);

  // Average reading speed ~ 200 words per minute
  const estimatedMinutes = Math.max(0.5, Math.round((words / 200) * 10) / 10);

  return {
    words,
    sentences,
    syllables,
    readingEase,
    gradeLevel,
    estimatedMinutes,
  };
}

// Bionic Reading conversion: bold the first half of each word to create fixation anchors
export function formatBionicHtml(text: string): string {
  if (!text) return '';
  return text.split(/(\s+)/).map((segment) => {
    // If it's whitespace or punctuation, return as-is
    if (/^\s+$/.test(segment)) return segment;
    const cleanWord = segment.replace(/^[^\w]+|[^\w]+$/g, '');
    if (!cleanWord || cleanWord.length < 2) return segment;

    const leadLen = Math.ceil(cleanWord.length * 0.45);
    const prefix = cleanWord.slice(0, leadLen);
    const suffix = cleanWord.slice(leadLen);

    // Reconstruct with any leading/trailing punctuation intact
    const leadingPunct = segment.match(/^[^\w]+/)?.[0] || '';
    const trailingPunct = segment.match(/[^\w]+$/)?.[0] || '';

    return `${leadingPunct}<strong>${prefix}</strong>${suffix}${trailingPunct}`;
  }).join('');
}
