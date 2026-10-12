import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Eyebrow } from '@/components/app-text';
import { IconButton, PrimaryButton } from '@/components/buttons';
import { FormField } from '@/components/form-field';
import { Icon } from '@/components/icon';
import { Screen } from '@/components/screen';
import { Colors } from '@/constants/tokens';
import { useCreateDeck } from '@/hooks/use-decks';
import { useT } from '@/hooks/use-t';

type DraftCard = { key: number; front: string; back: string };

export default function NewDeckScreen() {
  const { t } = useT();
  const create = useCreateDeck();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cards, setCards] = useState<DraftCard[]>([{ key: 0, front: '', back: '' }]);
  const [nextKey, setNextKey] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const update = (key: number, patch: Partial<DraftCard>) =>
    setCards((list) => list.map((card) => (card.key === key ? { ...card, ...patch } : card)));

  const submit = () => {
    const valid = cards
      .map((card) => ({ front: card.front.trim(), back: card.back.trim() }))
      .filter((card) => card.front && card.back);
    if (!title.trim()) return setError(t('needTitle'));
    if (valid.length === 0) return setError(t('needCard'));
    setError(null);
    create.mutate(
      { title, description, cards: valid },
      {
        onSuccess: (id) => router.replace({ pathname: '/deck/[id]', params: { id } }),
      },
    );
  };

  return (
    <Screen
      footer={
        <>
          {error ? (
            <AppText size={13} color="again" align="center">
              {error}
            </AppText>
          ) : null}
          <PrimaryButton label={t('createDeck')} icon="check" onPress={submit} disabled={create.isPending} />
        </>
      }>
      <View style={styles.titleRow}>
        <IconButton icon="x" label={t('close')} onPress={() => router.back()} />
        <AppText family="display" size={28} style={styles.title}>
          {t('newDeckTitle')}
        </AppText>
      </View>

      <FormField
        label={t('deckName')}
        value={title}
        onChangeText={setTitle}
        placeholder={t('deckNamePlaceholder')}
        maxLength={60}
      />
      <FormField
        label={t('deckDescription')}
        value={description}
        onChangeText={setDescription}
        maxLength={120}
      />

      <Eyebrow color="ink2" style={styles.sectionLabel}>
        {t('cardsSection')}
      </Eyebrow>
      {cards.map((card, index) => (
        <View key={card.key} style={styles.cardBox}>
          <View style={styles.cardHead}>
            <AppText family="mono" size={12} color="ink2">
              {index + 1}
            </AppText>
            {cards.length > 1 ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t('removeCard')}
                hitSlop={10}
                onPress={() => setCards((list) => list.filter((c) => c.key !== card.key))}>
                <Icon name="trash" size={16} color="ink3" />
              </Pressable>
            ) : null}
          </View>
          <FormField
            label={t('cardFront')}
            value={card.front}
            onChangeText={(front) => update(card.key, { front })}
            placeholder={t('frontPlaceholder')}
          />
          <FormField
            label={t('cardBack')}
            value={card.back}
            onChangeText={(back) => update(card.key, { back })}
            placeholder={t('backPlaceholder')}
            multiline
          />
        </View>
      ))}
      <PrimaryButton
        tone="outline"
        icon="plus"
        label={t('addAnotherCard')}
        onPress={() => {
          setCards((list) => [...list, { key: nextKey, front: '', back: '' }]);
          setNextKey((k) => k + 1);
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  title: { flex: 1 },
  sectionLabel: { paddingTop: 8 },
  cardBox: {
    gap: 12,
    padding: 16,
    borderRadius: 22,
    backgroundColor: Colors.bg,
    borderWidth: 1,
    borderColor: Colors.line,
  },
  cardHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
