import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { IconButton, PrimaryButton } from '@/components/buttons';
import { FormField } from '@/components/form-field';
import { Screen } from '@/components/screen';
import { useAddCard } from '@/hooks/use-decks';
import { useT } from '@/hooks/use-t';

export default function AddCardScreen() {
  const { deckId } = useLocalSearchParams<{ deckId: string }>();
  const { t } = useT();
  const add = useAddCard(deckId);
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    if (!front.trim() || !back.trim()) return setError(t('needCard'));
    setError(null);
    add.mutate({ front: front.trim(), back: back.trim() }, { onSuccess: () => router.back() });
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
          <PrimaryButton label={t('save')} icon="check" onPress={submit} disabled={add.isPending} />
        </>
      }>
      <View style={styles.titleRow}>
        <IconButton icon="x" label={t('close')} onPress={() => router.back()} />
        <AppText family="display" size={28} style={styles.title}>
          {t('newCardTitle')}
        </AppText>
      </View>
      <FormField
        label={t('cardFront')}
        value={front}
        onChangeText={setFront}
        placeholder={t('frontPlaceholder')}
      />
      <FormField
        label={t('cardBack')}
        value={back}
        onChangeText={setBack}
        placeholder={t('backPlaceholder')}
        multiline
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  title: { flex: 1 },
});
