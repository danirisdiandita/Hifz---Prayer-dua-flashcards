import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Eyebrow } from '@/components/app-text';
import { Chip, IconButton } from '@/components/buttons';
import { Icon } from '@/components/icon';
import { Screen } from '@/components/screen';
import { Colors, Radius } from '@/constants/tokens';
import { useTouchDeck } from '@/hooks/use-decks';
import { useLesson, useLessonPreview, useResetLesson, useSetLessonMode } from '@/hooks/use-lessons';
import { useT } from '@/hooks/use-t';
import type { StringKey } from '@/i18n/strings';
import { confirmAction } from '@/lib/confirm';
import type { StudyMode } from '@/services/types';

const OPTIONS: { mode: StudyMode; icon: string; title: StringKey; body: StringKey }[] = [
  { mode: 'word', icon: 'sparkles', title: 'perWord', body: 'perWordBody' },
  { mode: 'phrase', icon: 'layers', title: 'perPhrase', body: 'perPhraseBody' },
  { mode: 'overall', icon: 'book-open', title: 'overall', body: 'overallBody' },
];

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t, text, language } = useT();
  const { data: lesson } = useLesson(id);
  const { data: preview } = useLessonPreview(id);
  const setMode = useSetLessonMode();
  const reset = useResetLesson();
  const touch = useTouchDeck();

  const choose = (mode: StudyMode) => {
    setMode.mutate(
      { id, mode },
      {
        onSuccess: () => {
          if (lesson) touch.mutate(lesson.deckId);
          router.replace({ pathname: '/study', params: { lessonId: id } });
        },
      },
    );
  };

  const meaning = preview?.meaning[language] ?? '';

  return (
    <Screen>
      <View style={styles.titleRow}>
        <IconButton icon="arrow-left" label={t('back')} onPress={() => router.back()} />
        <View style={styles.titleCopy}>
          <Eyebrow color="ink2" numberOfLines={1}>
            {lesson ? text(lesson.title) : ''}
          </Eyebrow>
          <AppText family="display" size={30} lineHeight={36}>
            {t('paceTitle')}
          </AppText>
        </View>
      </View>
      <AppText color="ink2">{t('paceBody')}</AppText>

      <View style={styles.options}>
        {OPTIONS.map((option, index) => {
          const selected = index === 0;
          const active = lesson?.activeMode === option.mode;
          const count = preview?.counts[option.mode] ?? 0;
          return (
            <Pressable
              key={option.mode}
              accessibilityRole="button"
              disabled={setMode.isPending}
              onPress={() => choose(option.mode)}
              style={({ pressed }) => [
                styles.option,
                selected ? styles.optionPrimary : styles.optionPlain,
                { opacity: pressed ? 0.85 : 1 },
              ]}>
              <View style={[styles.iconTile, selected && styles.iconTilePrimary]}>
                <Icon name={option.icon} size={20} color={selected ? 'gold' : 'green'} />
              </View>
              <View style={styles.optionCopy}>
                <View style={styles.optionTitleRow}>
                  <AppText family="display" size={19} color={selected ? 'cream' : 'ink'}>
                    {t(option.title)}
                  </AppText>
                  {selected ? <Chip label={t('recommended')} /> : null}
                  {active ? <Chip label={t('currentPace')} tone="soft" /> : null}
                </View>
                <AppText size={12} color={selected ? 'greenSoft' : 'ink2'}>
                  {t(option.body)}
                  {count ? `  ·  ${t('cardCount', { n: count })}` : ''}
                </AppText>
              </View>
              <Icon name="chevron-right" size={18} color={selected ? 'gold' : 'ink3'} />
            </Pressable>
          );
        })}
      </View>

      {preview ? (
        <View style={styles.preview}>
          <AppText family="arabic" size={preview.arabic.length > 40 ? 24 : 44} align="center" color="green" numberOfLines={4} lineHeight={preview.arabic.length > 40 ? 42 : 72}>
            {preview.arabic}
          </AppText>
          <AppText size={13} color="ink2" align="center" numberOfLines={4}>
            {preview.transliteration.length < 60 ? `${preview.transliteration}  ·  ` : ''}
            {meaning}
          </AppText>
        </View>
      ) : null}

      {lesson && lesson.startedCards > 0 ? (
        <Pressable
          accessibilityRole="button"
          onPress={() =>
            confirmAction(t('resetProgressConfirm'), t('resetProgress'), t('cancel'), () => reset.mutate(id))
          }
          style={styles.reset}>
          <Icon name="rotate-ccw" size={15} color="ink2" />
          <AppText size={13} weight="semi" color="ink2">
            {t('resetProgress')}
          </AppText>
        </Pressable>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingTop: 4 },
  titleCopy: { flex: 1, gap: 2 },
  options: { gap: 10, paddingTop: 6 },
  option: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: 22 },
  optionPrimary: { backgroundColor: Colors.green },
  optionPlain: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.line },
  iconTile: {
    width: 44,
    height: 44,
    borderRadius: Radius.tile,
    backgroundColor: Colors.greenSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconTilePrimary: { backgroundColor: Colors.green2 },
  optionCopy: { flex: 1, gap: 4 },
  optionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  preview: { alignItems: 'center', gap: 10, paddingTop: 24, paddingBottom: 8 },
  reset: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14 },
});
