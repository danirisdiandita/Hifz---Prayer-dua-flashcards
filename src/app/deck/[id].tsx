import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Eyebrow } from '@/components/app-text';
import { IconButton, PrimaryButton } from '@/components/buttons';
import { Icon } from '@/components/icon';
import { Screen } from '@/components/screen';
import { Colors } from '@/constants/tokens';
import { useDeck, useDeleteDeck, useDeleteLesson, useTouchDeck } from '@/hooks/use-decks';
import { useLessons } from '@/hooks/use-lessons';
import { useT } from '@/hooks/use-t';
import { confirmAction } from '@/lib/confirm';
import { nextStep } from '@/lib/next-step';
import type { LessonStatus, LessonSummary } from '@/services/types';

function StatusNode({ status, first, last }: { status: LessonStatus; first: boolean; last: boolean }) {
  return (
    <View style={styles.nodeColumn}>
      <View style={[styles.line, first && styles.lineHidden]} />
      <View
        style={[
          styles.node,
          status === 'mastered' && styles.nodeDone,
          status === 'learning' && styles.nodeLearning,
        ]}>
        {status === 'mastered' ? <Icon name="check" size={13} color="cream" strokeWidth={3} /> : null}
        {status === 'learning' ? <View style={styles.nodeDot} /> : null}
      </View>
      <View style={[styles.line, last && styles.lineHidden]} />
    </View>
  );
}

function LessonRow({
  lesson,
  first,
  last,
  custom,
}: {
  lesson: LessonSummary;
  first: boolean;
  last: boolean;
  custom: boolean;
}) {
  const { t, text } = useT();
  const remove = useDeleteLesson();
  const faded = lesson.status === 'new';

  return (
    <View style={styles.lessonRow}>
      <StatusNode status={lesson.status} first={first} last={last} />
      <View style={styles.lessonBody}>
        <Pressable
          accessibilityRole="button"
          onPress={() =>
            custom
              ? router.push({ pathname: '/study', params: { lessonId: lesson.id } })
              : router.push({ pathname: '/lesson/[id]', params: { id: lesson.id } })
          }
          style={({ pressed }) => [styles.lessonPress, { opacity: pressed ? 0.7 : 1 }]}>
          <View style={styles.lessonCopy}>
            <AppText weight="semi" size={15} color={faded ? 'ink2' : 'ink'} numberOfLines={2}>
              {text(lesson.title)}
            </AppText>
            <AppText size={12} color={faded ? 'ink3' : 'ink2'} numberOfLines={2}>
              {text(lesson.subtitle)}
            </AppText>
          </View>
          {lesson.dueCards > 0 && lesson.status !== 'new' ? (
            <View style={styles.dueBadge}>
              <AppText family="mono" size={11} color="green">
                {lesson.dueCards}
              </AppText>
            </View>
          ) : null}
          {custom ? null : <Icon name="chevron-right" size={18} color="ink3" />}
        </Pressable>
        {custom ? (
          <IconButton
            icon="trash"
            size={32}
            label={t('delete')}
            onPress={() =>
              confirmAction(t('deleteCardConfirm'), t('delete'), t('cancel'), () =>
                remove.mutate(lesson.id),
              )
            }
          />
        ) : null}
      </View>
    </View>
  );
}

export default function DeckScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t, text } = useT();
  const { data: deck, isLoading } = useDeck(id);
  const { data: lessons } = useLessons(id);
  const touch = useTouchDeck();
  const deleteDeck = useDeleteDeck();

  if (!deck) {
    return (
      <Screen>
        <IconButton icon="arrow-left" label={t('back')} onPress={() => router.back()} />
        {!isLoading ? <AppText color="ink2">{t('deckNotFound')}</AppText> : null}
      </Screen>
    );
  }

  const custom = deck.kind === 'custom';
  const done = deck.masteredLessons;
  const stats: { value: string; label: string; accent?: boolean }[] = [
    { value: `${deck.percentMastered}%`, label: t('statMastered'), accent: true },
    { value: String(deck.lessonCount), label: t('statCards') },
    { value: String(done), label: t('statDone') },
    { value: String(deck.lessonCount - done), label: t('statLeft') },
  ];

  const onContinue = () => {
    touch.mutate(deck.id);
    const step = nextStep(deck, lessons);
    if (step.type === 'study') router.push({ pathname: '/study', params: { deckId: step.deckId } });
    else if (step.type === 'lesson') router.push({ pathname: '/lesson/[id]', params: { id: step.lessonId } });
  };

  const canContinue = deck.dueCount > 0 || !!lessons?.some((l) => l.status !== 'mastered' && l.startedCards === 0);

  return (
    <Screen
      footer={
        <>
          {canContinue ? (
            <PrimaryButton
              label={lessons?.some((l) => l.startedCards > 0) ? t('continueStudying') : t('startStudying')}
              onPress={onContinue}
            />
          ) : null}
          {custom ? (
            <PrimaryButton
              tone="outline"
              icon="plus"
              label={t('addCard')}
              onPress={() => router.push({ pathname: '/add-card', params: { deckId: deck.id } })}
            />
          ) : null}
        </>
      }>
      <View style={styles.titleRow}>
        <IconButton icon="arrow-left" label={t('back')} onPress={() => router.back()} />
        <View style={styles.titleCopy}>
          <Eyebrow color="ink2" numberOfLines={1}>
            {t('deckEyebrow')}
          </Eyebrow>
          <AppText family="display" size={30} lineHeight={36}>
            {text(deck.title)}
          </AppText>
        </View>
      </View>

      {text(deck.description) ? (
        <AppText size={13} color="ink2">
          {text(deck.description)}
        </AppText>
      ) : null}

      <View style={styles.stats}>
        {stats.map((stat, i) => (
          <View key={stat.label} style={[styles.stat, i > 0 && styles.statDivider]}>
            <AppText family="display" size={24} color={stat.accent ? 'gold' : 'ink'}>
              {stat.value}
            </AppText>
            <AppText size={11} color="ink2">
              {stat.label}
            </AppText>
          </View>
        ))}
      </View>

      <Eyebrow color="ink2" style={styles.sectionLabel}>
        {custom ? t('yourCards') : t('recitationFlow')}
      </Eyebrow>

      {lessons && lessons.length === 0 ? (
        <AppText color="ink2">{t('emptyDeck')}</AppText>
      ) : (
        <View>
          {lessons?.map((lesson, i) => (
            <LessonRow
              key={lesson.id}
              lesson={lesson}
              first={i === 0}
              last={i === lessons.length - 1}
              custom={custom}
            />
          ))}
        </View>
      )}

      {custom ? (
        <Pressable
          accessibilityRole="button"
          onPress={() =>
            confirmAction(t('deleteDeckConfirm'), t('delete'), t('cancel'), () =>
              deleteDeck.mutate(deck.id, { onSuccess: () => router.back() }),
            )
          }
          style={styles.deleteDeck}>
          <Icon name="trash" size={16} color="again" />
          <AppText weight="semi" size={13} color="again">
            {t('deleteDeck')}
          </AppText>
        </Pressable>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingTop: 4 },
  titleCopy: { flex: 1, gap: 2 },
  stats: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.line,
    paddingVertical: 14,
    marginTop: 6,
  },
  stat: { flex: 1, alignItems: 'center', gap: 2 },
  statDivider: { borderLeftWidth: 1, borderLeftColor: Colors.line },
  sectionLabel: { paddingTop: 8 },
  lessonRow: { flexDirection: 'row', alignItems: 'stretch', gap: 14 },
  nodeColumn: { width: 24, alignItems: 'center' },
  line: { flex: 1, width: 2, backgroundColor: Colors.line },
  lineHidden: { backgroundColor: 'transparent' },
  node: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.line,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeDone: { backgroundColor: Colors.green, borderColor: Colors.green },
  nodeLearning: { borderColor: Colors.gold },
  nodeDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.gold },
  lessonBody: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 14 },
  lessonPress: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  lessonCopy: { flex: 1, gap: 3 },
  dueBadge: {
    minWidth: 26,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: Colors.goldSoft,
    alignItems: 'center',
  },
  deleteDeck: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    marginTop: 8,
  },
});
