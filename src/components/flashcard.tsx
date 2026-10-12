import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Colors, Radius } from '@/constants/tokens';

import { AppText, Eyebrow } from './app-text';
import { Icon } from './icon';

type FlashcardProps = {
  eyebrow: string;
  front: string;
  frontIsArabic: boolean;
  arabicSize: number;
  transliteration?: string | null;
  meaning?: string | null;
  revealed: boolean;
  revealHint: string;
  onReveal: () => void;
};

export function Flashcard({
  eyebrow,
  front,
  frontIsArabic,
  arabicSize,
  transliteration,
  meaning,
  revealed,
  revealHint,
  onReveal,
}: FlashcardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={revealHint}
      onPress={revealed ? undefined : onReveal}
      style={styles.card}>
      <Eyebrow align="center">{eyebrow}</Eyebrow>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.center}
        showsVerticalScrollIndicator={false}>
        {frontIsArabic ? (
          <AppText family="arabic" size={arabicSize} align="center" color="green" lineHeight={Math.round(arabicSize * 1.6)}>
            {front}
          </AppText>
        ) : (
          <AppText family="display" size={30} align="center" color="green" lineHeight={38}>
            {front}
          </AppText>
        )}
        {frontIsArabic && transliteration ? (
          <AppText family="display" size={22} align="center" color="ink" style={styles.italic}>
            {transliteration}
          </AppText>
        ) : null}
        {revealed ? (
          <>
            <View style={styles.rule} />
            {meaning ? (
              <AppText size={meaning.length > 80 ? 15 : 18} align="center" color="ink" weight="medium" lineHeight={meaning.length > 80 ? 22 : 26}>
                {meaning}
              </AppText>
            ) : null}
          </>
        ) : null}
      </ScrollView>
      {!revealed ? (
        <View style={styles.hint}>
          <Icon name="eye" size={14} color="ink2" />
          <AppText size={12} color="ink2">
            {revealHint}
          </AppText>
        </View>
      ) : (
        <View style={styles.hintSpacer} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    borderWidth: 1,
    borderColor: Colors.line,
    paddingVertical: 28,
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 12,
  },
  scroll: { flex: 1, width: '100%' },
  center: { flexGrow: 1, width: '100%', alignItems: 'center', justifyContent: 'center', gap: 12, paddingVertical: 8 },
  italic: { fontStyle: 'italic' },
  rule: { width: 48, height: 1, backgroundColor: Colors.line, marginVertical: 4 },
  hint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.bg,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.pill,
  },
  hintSpacer: { height: 32 },
});
