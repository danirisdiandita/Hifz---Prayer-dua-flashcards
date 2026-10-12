import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getStudyQueue, LEARN_AHEAD_MS, reviewCard, type ReviewInput, type StudyScope } from '@/services/study';

import { queryKeys } from './query-keys';

export { LEARN_AHEAD_MS };

export function useStudyQueue(scope: StudyScope) {
  const key = 'lessonId' in scope ? `lesson:${scope.lessonId}` : `deck:${scope.deckId}`;
  return useQuery({
    queryKey: queryKeys.study(key),
    queryFn: () => getStudyQueue(scope),
    staleTime: Infinity,
    gcTime: 0,
    refetchOnMount: 'always',
  });
}

export function useReviewCard() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: ReviewInput) => reviewCard(input),
    onSuccess: () =>
      Promise.all([
        client.invalidateQueries({ queryKey: queryKeys.decks }),
        client.invalidateQueries({ queryKey: ['lessons'] }),
        client.invalidateQueries({ queryKey: queryKeys.progress }),
      ]),
  });
}
