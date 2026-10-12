import { useQuery } from '@tanstack/react-query';

import { getProgress } from '@/services/progress';

import { queryKeys } from './query-keys';

export function useProgress() {
  return useQuery({ queryKey: queryKeys.progress, queryFn: getProgress });
}
