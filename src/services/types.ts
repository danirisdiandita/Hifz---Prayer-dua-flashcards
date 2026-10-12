import type { Language, Localized } from '@/content/types';

export type StudyMode = 'word' | 'phrase' | 'overall';

export type LocalizedText = { fallback: string; i18n: Localized | null };

export type DeckSummary = {
  id: string;
  kind: 'seed' | 'custom';
  title: LocalizedText;
  description: LocalizedText;
  icon: string;
  lessonCount: number;
  masteredLessons: number;
  dueCount: number;
  lastAccessedAt: number | null;
  percentMastered: number;
};

export type LessonStatus = 'new' | 'learning' | 'mastered';

export type LessonSummary = {
  id: string;
  deckId: string;
  position: number;
  title: LocalizedText;
  subtitle: LocalizedText;
  icon: string;
  activeMode: StudyMode | null;
  totalCards: number;
  masteredCards: number;
  startedCards: number;
  dueCards: number;
  status: LessonStatus;
};

export type StudyCard = {
  id: string;
  lessonId: string;
  deckId: string;
  lessonTitle: LocalizedText;
  deckTitle: LocalizedText;
  mode: StudyMode;
  position: number;
  front: string;
  back: string;
  arabic: string | null;
  transliteration: string | null;
  meaning: Localized | null;
  row: import('./srs').CardRow;
};

export function pick(text: LocalizedText, language: Language): string {
  return text.i18n?.[language] || text.fallback;
}
