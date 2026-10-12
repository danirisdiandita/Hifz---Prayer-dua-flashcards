import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAppStore } from '@/stores/app-store';
import {
  getSettings,
  setDailyGoal,
  setReminder,
  type Settings,
} from '@/services/settings';

import { queryKeys } from './query-keys';

export function useSettings() {
  return useQuery({ queryKey: queryKeys.settings, queryFn: getSettings });
}

function useSettingsMutation<TVars>(fn: (vars: TVars) => Promise<unknown>) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => client.invalidateQueries({ queryKey: queryKeys.settings }),
  });
}

export function useUpdateLanguage() {
  return useAppStore((state) => state.setLanguage);
}

export function useCompleteOnboarding() {
  return useAppStore((state) => state.completeOnboarding);
}

export function useOnboardingDone() {
  return useAppStore((state) => state.onboardingDone);
}

export const useUpdateDailyGoal = () => useSettingsMutation((goal: number) => setDailyGoal(goal));

export const useUpdateReminder = () =>
  useSettingsMutation((v: { enabled: boolean; hour: number; minute: number }) =>
    setReminder(v.enabled, v.hour, v.minute),
  );

export type { Settings };
