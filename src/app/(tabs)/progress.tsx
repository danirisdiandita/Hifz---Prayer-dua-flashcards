import { StyleSheet, View } from 'react-native';

import { AppText, Eyebrow } from '@/components/app-text';
import { Icon } from '@/components/icon';
import { Screen } from '@/components/screen';
import { Colors, Radius } from '@/constants/tokens';
import { useProgress } from '@/hooks/use-progress';
import { useSettings } from '@/hooks/use-settings';
import { useT } from '@/hooks/use-t';

const BAR_MAX = 110;

function formatDuration(ms: number): string {
  const totalMinutes = Math.round(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return ms > 0 && minutes === 0 ? '<1m' : `${minutes}m`;
  return `${hours}h ${minutes}m`;
}

export default function ProgressScreen() {
  const { t } = useT();
  const { data } = useProgress();
  const { data: settings } = useSettings();

  const weekdays = t('weekdays').split(',');
  const counts = data?.weekCounts ?? [0, 0, 0, 0, 0, 0, 0];
  const maxCount = Math.max(...counts, 1);
  const todayIndex = data?.todayIndex ?? 0;
  const delta = data?.weeklyDelta ?? 0;
  const goal = settings?.dailyGoal ?? 10;
  const todayCount = data?.todayCount ?? 0;
  const streak = data?.streakDays ?? 0;

  return (
    <Screen>
      <View style={styles.header}>
        <Eyebrow color="ink2">{t('progressEyebrow')}</Eyebrow>
        <AppText family="display" size={34} lineHeight={40}>
          {t('progressTitle')}
        </AppText>
      </View>

      <View style={styles.hero}>
        <View style={styles.heroGlow} />
        <View style={styles.heroTop}>
          <View style={styles.heroNumber}>
            <AppText family="display" size={64} color="cream" lineHeight={70}>
              {data?.percentMastered ?? 0}
            </AppText>
            <AppText size={13} color="greenSoft">
              {t('masteredLabel')}
            </AppText>
          </View>
          <View style={styles.deltaChip}>
            <Icon name="trending-up" size={14} color="cream" />
            <AppText size={11} weight="semi" color="cream">
              {t('thisWeek', { sign: delta >= 0 ? '+' : '', n: delta })}
            </AppText>
          </View>
        </View>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${Math.max(2, data?.percentMastered ?? 0)}%` }]} />
        </View>
        <AppText size={12} color="greenSoft">
          {data && data.activeCards > 0
            ? t('steadyProgress', { n: data.masteredCards })
            : t('startProgress')}
        </AppText>
      </View>

      <Eyebrow color="ink2" style={styles.sectionLabel}>
        {t('activityThisWeek')}
      </Eyebrow>
      <View style={styles.chartHeader}>
        <AppText family="display" size={20}>
          {t('cardsReviewed')}
        </AppText>
        <AppText family="mono" size={12} color="ink2">
          {t('totalCount', { n: data?.weekTotal ?? 0 })}
        </AppText>
      </View>
      <View style={styles.chart}>
        {counts.map((count, i) => {
          const isToday = i === todayIndex;
          const future = i > todayIndex;
          const height = Math.max(10, Math.round((count / maxCount) * BAR_MAX));
          return (
            <View key={i} style={styles.barColumn}>
              <View
                style={[
                  styles.bar,
                  { height },
                  isToday ? styles.barToday : future ? styles.barFuture : styles.barPast,
                ]}
              />
              <AppText family="mono" size={11} color={isToday ? 'ink' : 'ink3'}>
                {weekdays[i]}
              </AppText>
            </View>
          );
        })}
      </View>

      <View style={styles.tiles}>
        <View style={styles.tile}>
          <View style={styles.tileIcon}>
            <Icon name="flame" size={16} color="gold" />
          </View>
          <Eyebrow color="ink2" style={styles.tileLabel}>
            {t('studyStreak')}
          </Eyebrow>
          <AppText family="display" size={24}>
            {streak === 1 ? t('oneDay') : t('daysCount', { n: streak })}
          </AppText>
        </View>
        <View style={styles.tile}>
          <View style={styles.tileIcon}>
            <Icon name="clock" size={16} color="gold" />
          </View>
          <Eyebrow color="ink2" style={styles.tileLabel}>
            {t('studyTime')}
          </Eyebrow>
          <AppText family="display" size={24}>
            {formatDuration(data?.totalStudyMs ?? 0)}
          </AppText>
        </View>
      </View>

      <View style={styles.goal}>
        <View style={styles.goalRow}>
          <View style={styles.tileIcon}>
            <Icon name="target" size={16} color="gold" />
          </View>
          <View style={styles.goalCopy}>
            <AppText weight="semi" size={14}>
              {t('dailyGoal')}
            </AppText>
            <AppText family="mono" size={12} color="ink2">
              {t('goalProgress', { done: todayCount, goal })}
            </AppText>
          </View>
        </View>
        <View style={styles.goalTrack}>
          <View
            style={[
              styles.goalFill,
              { width: `${Math.min(100, Math.round((todayCount / Math.max(goal, 1)) * 100))}%` },
            ]}
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { gap: 6, paddingTop: 8 },
  hero: {
    backgroundColor: Colors.green,
    borderRadius: Radius.card,
    padding: 22,
    gap: 14,
    overflow: 'hidden',
  },
  heroGlow: {
    position: 'absolute',
    right: -60,
    bottom: -70,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: Colors.green2,
    opacity: 0.5,
  },
  heroTop: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  heroNumber: { flexDirection: 'row', alignItems: 'flex-end', gap: 6 },
  deltaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(244,239,228,0.14)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.pill,
  },
  track: { height: 6, borderRadius: 3, backgroundColor: 'rgba(244,239,228,0.2)', overflow: 'hidden' },
  fill: { height: 6, borderRadius: 3, backgroundColor: Colors.gold },
  sectionLabel: { paddingTop: 10 },
  chartHeader: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  chart: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, height: BAR_MAX + 28, paddingTop: 6 },
  barColumn: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 8 },
  bar: { width: '100%', borderRadius: 8 },
  barPast: { backgroundColor: Colors.green },
  barToday: { backgroundColor: Colors.gold },
  barFuture: { backgroundColor: Colors.greenSoft },
  tiles: { flexDirection: 'row', gap: 12, paddingTop: 6 },
  tile: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.line,
    padding: 16,
    gap: 6,
  },
  tileIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.goldSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileLabel: { fontSize: 10 },
  goal: {
    backgroundColor: Colors.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.line,
    padding: 16,
    gap: 12,
  },
  goalRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  goalCopy: { gap: 2 },
  goalTrack: { height: 6, borderRadius: 3, backgroundColor: Colors.line, overflow: 'hidden' },
  goalFill: { height: 6, borderRadius: 3, backgroundColor: Colors.green },
});
