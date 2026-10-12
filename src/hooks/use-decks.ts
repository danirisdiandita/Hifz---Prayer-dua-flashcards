import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  addCardToDeck,
  createDeck,
  deleteDeck,
  deleteLesson,
  getDeck,
  listDecks,
  touchDeck,
  type CreateDeckInput,
  type NewCardInput,
} from '@/services/decks';

import { queryKeys } from './query-keys';

export function useDecks() {
  return useQuery({ queryKey: queryKeys.decks, queryFn: listDecks });
}

export function useDeck(id: string) {
  return useQuery({ queryKey: queryKeys.deck(id), queryFn: () => getDeck(id) });
}

function useInvalidateContent() {
  const client = useQueryClient();
  return () =>
    Promise.all([
      client.invalidateQueries({ queryKey: queryKeys.decks }),
      client.invalidateQueries({ queryKey: ['lessons'] }),
      client.invalidateQueries({ queryKey: queryKeys.progress }),
    ]);
}

export function useCreateDeck() {
  const invalidate = useInvalidateContent();
  return useMutation({
    mutationFn: (input: CreateDeckInput) => createDeck(input),
    onSuccess: invalidate,
  });
}

export function useAddCard(deckId: string) {
  const invalidate = useInvalidateContent();
  return useMutation({
    mutationFn: (input: NewCardInput) => addCardToDeck(deckId, input),
    onSuccess: invalidate,
  });
}

export function useDeleteDeck() {
  const invalidate = useInvalidateContent();
  return useMutation({ mutationFn: (id: string) => deleteDeck(id), onSuccess: invalidate });
}

export function useDeleteLesson() {
  const invalidate = useInvalidateContent();
  return useMutation({ mutationFn: (id: string) => deleteLesson(id), onSuccess: invalidate });
}

export function useTouchDeck() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => touchDeck(id),
    onSuccess: () => client.invalidateQueries({ queryKey: queryKeys.decks }),
  });
}
