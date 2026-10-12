import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Eyebrow } from '@/components/app-text';
import { Icon } from '@/components/icon';
import { ListRow } from '@/components/list-row';
import { ProgressRing } from '@/components/progress-bits';
import { Screen } from '@/components/screen';
import { Colors, Radius } from '@/constants/tokens';
import { useDecks, useTouchDeck } from '@/hooks/use-decks';
import { useLessons } from '@/hooks/use-lessons';
import { useT } from '@/hooks/use-t';
import { nextStep } from '@/lib/next-step';
import type { DeckSummary } from '@/services/types';

function FeaturedDeck({ deck }: { deck: DeckSummary }) {
  const { t, text } = useT();
  const { data: lessons } = useLessons(deck.id);
  const touch = useTouchDeck();

  const onContinue = () => {
    touch.mutate(deck.id);
    const step = nextStep(deck, lessons);
    if (step.type === 'study') router.push({ pathname: '/study', params: { deckId: step.deckId } });
    else if (step.type === 'lesson') router.push({ pathname: '/lesson/[id]', params: { id: step.lessonId } });
    else router.push({ pathname: '/deck/[id]', params: { id: step.deckId } });
  };

  return (
    <View style={styles.featured}>
      <View style={styles.featuredGlow} />
      <Pressable
        accessibilityRole="button"
        onPress={() => router.push({ pathname: '/deck/[id]', params: { id: deck.id } })}
        style={styles.featuredTop}>
        <ProgressRing percent={deck.percentMastered} />
        <View style={styles.featuredCopy}>
          <AppText family="body" weight="bold" size={10} color="gold" letterSpacing={1.4} style={styles.upper}>
            {t('lastAccessed')}
          </AppText>
          <AppText family="display" size={22} color="cream" lineHeight={28}>
            {text(deck.title)}
          </AppText>
          <AppText size={12} color="greenSoft">
            {t('cardsMastered', { cards: deck.lessonCount, mastered: deck.masteredLessons })}
          </AppText>
        </View>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        onPress={onContinue}
        style={({ pressed }) => [styles.featuredButton, { opacity: pressed ? 0.85 : 1 }]}>
        <AppText weight="semi" size={14} color="green">
          {t('continueStudying')}
        </AppText>
        <Icon name="arrow-right" size={16} color="green" />
      </Pressable>
    </View>
  );
}

export default function HomeScreen() {
  const { t, text } = useT();
  const { data: decks } = useDecks();

  const featured =
    decks
      ?.filter((d) => d.lastAccessedAt != null)
      .sort((a, b) => (b.lastAccessedAt ?? 0) - (a.lastAccessedAt ?? 0))[0] ?? decks?.[0];

  return (
    <Screen>
      <View style={styles.header}>
        <Eyebrow color="ink2">{t('homeEyebrow')}</Eyebrow>
        <AppText family="display" size={30} lineHeight={36}>
          {t('homeTitle')}
        </AppText>
      </View>

      {featured ? <FeaturedDeck deck={featured} /> : null}

      <Eyebrow color="ink2" style={styles.sectionLabel}>
        {t('yourDecks')}
      </Eyebrow>
      <View>
        {decks?.map((deck) => (
          <ListRow
            key={deck.id}
            icon={deck.icon}
            title={text(deck.title)}
            subtitle={
              deck.dueCount > 0
                ? `${t('percentMastered', { n: deck.percentMastered })}  ·  ${t('dueNow', { n: deck.dueCount })}`
                : t('percentMastered', { n: deck.percentMastered })
            }
            onPress={() => router.push({ pathname: '/deck/[id]', params: { id: deck.id } })}
            last={deck.id === decks[decks.length - 1].id}
          />
        ))}
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={() => router.push('/deck/new')}
        style={({ pressed }) => [styles.create, { opacity: pressed ? 0.85 : 1 }]}>
        <View style={styles.createPlus}>
          <Icon name="plus" size={18} color="green" strokeWidth={2.5} />
        </View>
        <View style={styles.createCopy}>
          <AppText weight="semi" size={14}>
            {t('createDeckTitle')}
          </AppText>
          <AppText size={12} color="ink2">
            {t('createDeckBody')}
          </AppText>
        </View>
        <Icon name="arrow-up-right" size={18} color="green" />
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { gap: 8, paddingTop: 8 },
  featured: {
    backgroundColor: Colors.green,
    borderRadius: Radius.card,
    padding: 20,
    gap: 18,
    overflow: 'hidden',
  },
  featuredGlow: {
    position: 'absolute',
    right: -50,
    top: -40,
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: Colors.green2,
    opacity: 0.55,
  },
  featuredTop: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  featuredCopy: { flex: 1, gap: 3 },
  upper: { textTransform: 'uppercase' },
  featuredButton: {
    height: 48,
    borderRadius: Radius.pill,
    backgroundColor: Colors.gold,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  sectionLabel: { paddingTop: 10 },
  create: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: 22,
    backgroundColor: Colors.goldSoft,
  },
  createPlus: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createCopy: { flex: 1, gap: 2 },
});
