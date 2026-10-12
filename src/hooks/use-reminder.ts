import { useMutation } from '@tanstack/react-query';

import { applyReminder, type ReminderResult } from '@/services/reminders';

import { useUpdateReminder } from './use-settings';

export type ReminderInput = {
  enabled: boolean;
  hour: number;
  minute: number;
  title: string;
  body: string;
};

export function useApplyReminder() {
  const persist = useUpdateReminder();
  return useMutation<ReminderResult, Error, ReminderInput>({
    mutationFn: async ({ enabled, hour, minute, title, body }) => {
      const result = await applyReminder(enabled, hour, minute, { title, body });
      if (result === 'ok') {
        await persist.mutateAsync({ enabled, hour, minute });
      }
      return result;
    },
  });
}
