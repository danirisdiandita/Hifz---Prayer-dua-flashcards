import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { AppText, Eyebrow } from '@/components/app-text';
import { IconButton, PrimaryButton } from '@/components/buttons';
import { Flashcard } from '@/components/flashcard';
import { Icon } from '@/components/icon';
import { Segments } from '@/components/progress-bits';
import { RatingButton } from '@/components/rating-button';
import { Screen } from '@/components/screen';
import { Colors } from '@/constants/tokens';
import { useIntervalPreview } from '@/hooks/use-interval-preview';
import { LEARN_AHEAD_MS, useReviewCard, useStudyQueue } from '@/hooks/use-study';
import { useT } from '@/hooks/use-t';
import type { StringKey } from '@/i18n/strings';
import { RATING_ORDER, type RatingName } from '@/services/srs';
import type { StudyCard, StudyMode } from '@/services/types';

const RATING_LABEL: Record<RatingName, StringKey> = {
  again: 'again',
  hard: 'hard',
  good: 'good',
  easy: 'easy',
};

const MODE_LABEL: Record<StudyMode, StringKey> = {
  word: 'modeWord',
  phrase: 'modePhrase',
  overall: 'modeOverall',
};

function arabicSizeFor(card: StudyCard): number {
  const length = card.arabic?.length ?? 0;
  if (card.mode === 'word') return 64;
  if (length > 160) return 24;
  if (length > 90) return 28;
  if (length > 55) return 34;
  if (length > 30) return 42;
  return 54;
}

function leave() {
  if (router.canGoBack()) router.back();
  else router.replace('/');
}

function Session({ initial, onRestart }: { initial: StudyCard[]; onRestart: () => void }) {
  const { t, text, language } = useT();
  const review = useReviewCard();
  const [queue, setQueue] = useState(initial);
  const [revealed, setRevealed] = useState(false);
  const [reviewed, setReviewed] = useState<string[]>([]);
  const shownAt = useRef(0);

  useEffect(() => {
    shownAt.current = Date.now();
  }, []);

  const current: StudyCard | undefined = queue[0];
  const intervals = useIntervalPreview(current?.id ?? 'none', current?.row ?? initial[0]?.row ?? EMPTY_ROW);

  const rate = useCallback(
    async (rating: RatingName) => {
      if (!current || review.isPending) return;
      const durationMs = Math.min(Date.now() - shownAt.current, 120_000);
      const row = await review.mutateAsync({ cardId: current.id, rating, durationMs });
      setReviewed((ids) => (ids.includes(current.id) ? ids : [...ids, current.id]));
      setQueue((q) => {
        const rest = q.slice(1);
        return row.due <= Date.now() + LEARN_AHEAD_MS ? [...rest, { ...current, row }] : rest;
      });
      setRevealed(false);
      shownAt.current = Date.now();
    },
    [current, review],
  );

  const skip = useCallback(() => {
    setQueue((q) => (q.length > 1 ? [...q.slice(1), q[0]] : q));
    setRevealed(false);
    shownAt.current = Date.now();
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const onKey = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
      if (!revealed && (event.code === 'Space' || event.code === 'Enter')) {
        event.preventDefault();
        setRevealed(true);
      } else if (revealed && ['1', '2', '3', '4'].includes(event.key)) {
        void rate(RATING_ORDER[Number(event.key) - 1]);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [revealed, rate]);

  if (initial.length === 0) {
    return (
      <Screen
        scroll={false}
        footer={<PrimaryButton label={t('backToDeck')} icon="arrow-left" onPress={leave} />}>
        <View style={styles.doneWrap}>
          <View style={styles.doneBadge}>
            <Icon name="check" size={28} color="green" strokeWidth={3} />
          </View>
          <AppText family="display" size={30} align="center">
            {t('sessionEmpty')}
          </AppText>
          <AppText color="ink2" align="center">
            {t('sessionEmptyBody')}
          </AppText>
        </View>
      </Screen>
    );
  }

  if (!current) {
    return (
      <Screen
        scroll={false}
        footer={
          <>
            <PrimaryButton label={t('studyMore')} onPress={onRestart} />
            <PrimaryButton tone="outline" label={t('backToDeck')} icon="arrow-left" onPress={leave} />
          </>
        }>
        <View style={styles.doneWrap}>
          <View style={styles.doneBadge}>
            <Icon name="check" size={28} color="green" strokeWidth={3} />
          </View>
          <AppText family="display" size={30} align="center">
            {t('sessionComplete')}
          </AppText>
          <AppText color="ink2" align="center">
            {t('sessionCompleteBody', { n: reviewed.length })}
          </AppText>
        </View>
      </Screen>
    );
  }

  const done = reviewed.length;
  const total = done + queue.length;
  const segmentCount = Math.min(total, 20);
  const activeSegments = Math.min(segmentCount, Math.round((done / Math.max(total, 1)) * segmentCount) + 1);

  const modeNumber =
    current.mode === 'word'
      ? t('modeWordUpper', { n: current.position + 1 })
      : current.mode === 'phrase'
        ? t('modePhraseUpper', { n: current.position + 1 })
        : t('modeOverallUpper');
  const isCustom = current.arabic == null;
  const cardEyebrow = isCustom ? text(current.deckTitle) : `${text(current.lessonTitle)}  ·  ${modeNumber}`;
  const meaning = isCustom ? current.back : (current.meaning?.[language] ?? current.back);

  return (
    <Screen
      scroll={false}
      contentStyle={styles.sessionContent}
      footer={
        <View style={styles.footer}>
          <AppText size={12} color="ink2" align="center">
            {t('howWell')}
          </AppText>
          <View style={styles.ratings}>
            {RATING_ORDER.map((rating) => (
              <RatingButton
                key={rating}
                rating={rating}
                label={t(RATING_LABEL[rating])}
                interval={intervals.data?.[rating] ?? '…'}
                disabled={!revealed || review.isPending}
                onPress={() => void rate(rating)}
              />
            ))}
          </View>
          <View style={styles.shortcutRow}>
            <AppText family="mono" size={11} color="ink3">
              {Platform.OS === 'web' ? t(revealed ? 'spaceRate' : 'spaceShowAnswer') : ' '}
            </AppText>
            <Pressable accessibilityRole="button" accessibilityLabel={t('skipCard')} hitSlop={10} onPress={skip}>
              <Icon name="flag" size={16} color="ink3" />
            </Pressable>
          </View>
        </View>
      }>
      <View style={styles.topBar}>
        <IconButton icon="arrow-left" label={t('back')} onPress={leave} />
        <View style={styles.deckInfo}>
          <Eyebrow color="ink2" numberOfLines={1} align="center">
            {isCustom
              ? text(current.deckTitle)
              : `${text(current.deckTitle)}  ·  ${t(MODE_LABEL[current.mode])}`}
          </Eyebrow>
          <AppText family="mono" size={14} color="ink">
            {`${Math.min(done + 1, total)} / ${total}`}
          </AppText>
        </View>
        <IconButton icon="x" label={t('close')} onPress={leave} />
      </View>
      <View style={styles.segmentsRow}>
        <Segments total={segmentCount} active={activeSegments} tone="light" />
      </View>
      <View style={styles.cardWrap}>
        <Flashcard
          key={`${current.id}-${done}`}
          eyebrow={cardEyebrow}
          front={current.front}
          frontIsArabic={!isCustom}
          arabicSize={arabicSizeFor(current)}
          transliteration={current.transliteration}
          meaning={meaning}
          revealed={revealed}
          revealHint={t('tapToReveal')}
          onReveal={() => setRevealed(true)}
        />
      </View>
    </Screen>
  );
}

const EMPTY_ROW = {
  due: 0,
  stability: 0,
  difficulty: 0,
  elapsed_days: 0,
  scheduled_days: 0,
  learning_steps: 0,
  reps: 0,
  lapses: 0,
  state: 0,
  last_review: null,
};

export default function StudyScreen() {
  const params = useLocalSearchParams<{ lessonId?: string; deckId?: string }>();
  const scope = params.lessonId
    ? { lessonId: params.lessonId }
    : { deckId: params.deckId as string };
  const { data, refetch, isLoading } = useStudyQueue(scope);
  const [sessionKey, setSessionKey] = useState(0);
  const { t } = useT();

  if (isLoading || !data) {
    return (
      <Screen scroll={false}>
        <View style={styles.doneWrap}>
          <AppText color="ink2">{t('loading')}</AppText>
        </View>
      </Screen>
    );
  }

  return (
    <Session
      key={sessionKey}
      initial={data}
      onRestart={async () => {
        await refetch();
        setSessionKey((k) => k + 1);
      }}
    />
  );
}

const styles = StyleSheet.create({
  sessionContent: { gap: 14 },
  segmentsRow: { flexDirection: 'row' },
  topBar: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  deckInfo: { flex: 1, alignItems: 'center', gap: 2 },
  cardWrap: { flex: 1, paddingTop: 8 },
  footer: { gap: 12 },
  ratings: { flexDirection: 'row', gap: 10 },
  shortcutRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  doneWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14, paddingHorizontal: 12 },
  doneBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.greenSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
