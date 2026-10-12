import { useQuery } from '@tanstack/react-query';

import { formatInterval, previewIntervals, RATING_ORDER, type CardRow, type RatingName } from '@/services/srs';

export function useIntervalPreview(cardId: string, row: CardRow) {
  return useQuery({
    queryKey: ['interval-preview', cardId, row.reps, row.due, row.state],
    queryFn: () => {
      const intervals = previewIntervals(row, Date.now());
      const labels = {} as Record<RatingName, string>;
      for (const name of RATING_ORDER) labels[name] = formatInterval(intervals[name]);
      return labels;
    },
    staleTime: 60_000,
    gcTime: 0,
  });
}
