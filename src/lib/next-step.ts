import type { DeckSummary, LessonSummary } from '@/services/types';

export type NextStep =
  | { type: 'study'; deckId: string }
  | { type: 'lesson'; lessonId: string }
  | { type: 'deck'; deckId: string };

export function nextStep(deck: DeckSummary, lessons: LessonSummary[] | undefined): NextStep {
  if (deck.dueCount > 0) return { type: 'study', deckId: deck.id };
  const fresh = lessons?.find((lesson) => lesson.status !== 'mastered' && lesson.startedCards === 0);
  if (fresh) return { type: 'lesson', lessonId: fresh.id };
  return { type: 'deck', deckId: deck.id };
}
