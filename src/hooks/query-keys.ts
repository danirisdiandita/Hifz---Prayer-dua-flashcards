export const queryKeys = {
  settings: ['settings'] as const,
  decks: ['decks'] as const,
  deck: (id: string) => ['decks', id] as const,
  lessons: (deckId: string) => ['lessons', 'deck', deckId] as const,
  lesson: (id: string) => ['lessons', id] as const,
  lessonPreview: (id: string) => ['lessons', id, 'preview'] as const,
  study: (scope: string) => ['study', scope] as const,
  progress: ['progress'] as const,
};
