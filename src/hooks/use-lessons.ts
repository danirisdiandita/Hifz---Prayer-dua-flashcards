import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  getLesson,
  getLessonPreview,
  listLessons,
  resetLesson,
  setLessonMode,
} from '@/services/lessons';
import type { StudyMode } from '@/services/types';

import { queryKeys } from './query-keys';

export function useLessons(deckId: string) {
  return useQuery({ queryKey: queryKeys.lessons(deckId), queryFn: () => listLessons(deckId) });
}

export function useLesson(id: string) {
  return useQuery({ queryKey: queryKeys.lesson(id), queryFn: () => getLesson(id) });
}

export function useLessonPreview(id: string) {
  return useQuery({ queryKey: queryKeys.lessonPreview(id), queryFn: () => getLessonPreview(id) });
}

function useInvalidateLessons() {
  const client = useQueryClient();
  return () =>
    Promise.all([
      client.invalidateQueries({ queryKey: ['lessons'] }),
      client.invalidateQueries({ queryKey: queryKeys.decks }),
      client.invalidateQueries({ queryKey: queryKeys.progress }),
    ]);
}

export function useSetLessonMode() {
  const invalidate = useInvalidateLessons();
  return useMutation({
    mutationFn: (v: { id: string; mode: StudyMode }) => setLessonMode(v.id, v.mode),
    onSuccess: invalidate,
  });
}

export function useResetLesson() {
  const invalidate = useInvalidateLessons();
  return useMutation({ mutationFn: (id: string) => resetLesson(id), onSuccess: invalidate });
}
