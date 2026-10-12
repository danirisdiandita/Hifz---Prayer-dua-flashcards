import Constants from 'expo-constants';
import { useState } from 'react';
import { Pressable, StyleSheet, Switch, View } from 'react-native';

import { AppText, Eyebrow } from '@/components/app-text';
import { Icon } from '@/components/icon';
import { ListRow } from '@/components/list-row';
import { Screen } from '@/components/screen';
import { Colors, Radius } from '@/constants/tokens';
import type { Language } from '@/content/types';
import { useApplyReminder } from '@/hooks/use-reminder';
import { useSettings, useUpdateDailyGoal, useUpdateLanguage } from '@/hooks/use-settings';
import { useT } from '@/hooks/use-t';
import { DAILY_GOAL_OPTIONS } from '@/services/settings';
import { SCHEMA_VERSION } from '@/services/schema';

const LANGUAGE_OPTIONS: { code: Language; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'ar', label: 'العربية' },
  { code: 'id', label: 'Bahasa' },
];

const LOCALES: Record<Language, string> = { en: 'en-US', ar: 'ar', id: 'id-ID' };

function formatTime(hour: number, minute: number, language: Language): string {
  return new Date(2000, 0, 1, hour, minute).toLocaleTimeString(LOCALES[language], {
    hour: 'numeric',
    minute: '2-digit',
  });
}

function Stepper({ label, onMinus, onPlus }: { label: string; onMinus: () => void; onPlus: () => void }) {
  return (
    <View style={styles.stepper}>
      <Pressable accessibilityRole="button" accessibilityLabel="-" onPress={onMinus} hitSlop={8} style={styles.stepButton}>
        <AppText weight="bold" size={18} color="green">
          {'−'}
        </AppText>
      </Pressable>
      <AppText family="mono" size={16} align="center" style={styles.stepValue}>
        {label}
      </AppText>
      <Pressable accessibilityRole="button" accessibilityLabel="+" onPress={onPlus} hitSlop={8} style={styles.stepButton}>
        <AppText weight="bold" size={18} color="green">
          +
        </AppText>
      </Pressable>
    </View>
  );
}

export default function SettingsScreen() {
  const { t, language } = useT();
  const { data: settings } = useSettings();
  const setLanguage = useUpdateLanguage();
  const updateGoal = useUpdateDailyGoal();
  const applyReminder = useApplyReminder();
  const [goalOpen, setGoalOpen] = useState(false);
  const [notice, setNotice] = useState<'denied' | 'unsupported' | null>(null);

  const reminderEnabled = settings?.reminderEnabled ?? false;
  const hour = settings?.reminderHour ?? 19;
  const minute = settings?.reminderMinute ?? 0;

  const setReminder = (enabled: boolean, h: number, m: number) => {
    setNotice(null);
    applyReminder.mutate(
      { enabled, hour: h, minute: m, title: t('reminderTitle'), body: t('reminderBody') },
      {
        onSuccess: (result) => {
          if (result === 'denied' || result === 'unsupported') setNotice(result);
        },
      },
    );
  };

  const version = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <Screen>
      <View style={styles.header}>
        <Eyebrow color="ink2">{t('settingsEyebrow')}</Eyebrow>
        <AppText family="display" size={34} lineHeight={40}>
          {t('settingsTitle')}
        </AppText>
      </View>

      <View style={styles.sectionHead}>
        <Eyebrow color="ink2">{t('appLanguage')}</Eyebrow>
        <Icon name="languages" size={16} color="ink3" />
      </View>
      <View style={styles.segmented}>
        {LANGUAGE_OPTIONS.map((option) => {
          const selected = option.code === language;
          return (
            <Pressable
              key={option.code}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              onPress={() => setLanguage(option.code)}
              style={[styles.segment, selected && styles.segmentSelected]}>
              <AppText
                weight="semi"
                size={13}
                color={selected ? 'cream' : 'ink'}
                family={option.code === 'ar' ? 'arabic' : 'body'}>
                {option.label}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      <Eyebrow color="ink2" style={styles.sectionLabel}>
        {t('study')}
      </Eyebrow>
      <View>
        <ListRow
          icon="target"
          title={t('dailyGoal')}
          subtitle={t('dailyGoalValue', { n: settings?.dailyGoal ?? 10 })}
          onPress={() => setGoalOpen((open) => !open)}
        />
        {goalOpen ? (
          <View style={styles.goalOptions} accessibilityLabel={t('chooseDailyGoal')}>
            {DAILY_GOAL_OPTIONS.map((goal) => {
              const selected = goal === settings?.dailyGoal;
              return (
                <Pressable
                  key={goal}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  onPress={() => updateGoal.mutate(goal)}
                  style={[styles.goalChip, selected && styles.goalChipSelected]}>
                  <AppText family="mono" size={14} color={selected ? 'cream' : 'ink'}>
                    {goal}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
        ) : null}
        <ListRow
          icon="bell"
          title={t('reminder')}
          subtitle={
            reminderEnabled ? t('reminderValue', { time: formatTime(hour, minute, language) }) : t('reminderOff')
          }
          showChevron={false}
          trailing={
            <Switch
              value={reminderEnabled}
              onValueChange={(value) => setReminder(value, hour, minute)}
              trackColor={{ true: Colors.green, false: Colors.line }}
              thumbColor={Colors.surface}
            />
          }
        />
        {reminderEnabled ? (
          <View style={styles.timeRow}>
            <AppText size={12} color="ink2">
              {t('reminderTime')}
            </AppText>
            <View style={styles.timeSteppers}>
              <Stepper
                label={String(hour).padStart(2, '0')}
                onMinus={() => setReminder(true, (hour + 23) % 24, minute)}
                onPlus={() => setReminder(true, (hour + 1) % 24, minute)}
              />
              <AppText family="mono" size={16}>
                :
              </AppText>
              <Stepper
                label={String(minute).padStart(2, '0')}
                onMinus={() => setReminder(true, hour, (minute + 45) % 60)}
                onPlus={() => setReminder(true, hour, (minute + 15) % 60)}
              />
            </View>
          </View>
        ) : null}
        {notice ? (
          <AppText size={12} color="again" style={styles.notice}>
            {notice === 'denied' ? t('reminderDenied') : t('reminderUnsupported')}
          </AppText>
        ) : null}
      </View>

      <View style={styles.privacy}>
        <Icon name="lock" size={13} color="ink3" />
        <AppText size={11} color="ink3">
          {t('privateByDefault')}
        </AppText>
      </View>
      <View style={styles.privacy}>
        <AppText family="mono" size={11} color="ink3">
          {t('versionLine', { version, schema: SCHEMA_VERSION })}
        </AppText>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { gap: 6, paddingTop: 8 },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10 },
  sectionLabel: { paddingTop: 10 },
  segmented: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Colors.line,
    padding: 4,
  },
  segment: { flex: 1, height: 40, borderRadius: Radius.pill, alignItems: 'center', justifyContent: 'center' },
  segmentSelected: { backgroundColor: Colors.green },
  goalOptions: { flexDirection: 'row', gap: 10, paddingBottom: 14, flexWrap: 'wrap' },
  goalChip: {
    minWidth: 52,
    height: 40,
    paddingHorizontal: 14,
    borderRadius: Radius.pill,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalChipSelected: { backgroundColor: Colors.green, borderColor: Colors.green },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.line,
  },
  timeSteppers: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Colors.line,
  },
  stepButton: { width: 34, height: 36, alignItems: 'center', justifyContent: 'center' },
  stepValue: { minWidth: 28 },
  notice: { paddingBottom: 10 },
  privacy: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingTop: 18 },
});
