import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
} from 'react-native-reanimated';

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

const SPRING = { damping: 16, stiffness: 120, mass: 0.9 };

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
  const [override, setOverride] = useState<boolean | null>(null);
  const showBack = override ?? revealed;
  const progress = useDerivedValue(() => withSpring(showBack ? 1 : 0, SPRING), [showBack]);

  const toggle = () => {
    setOverride(!showBack);
    if (!showBack && !revealed) onReveal();
  };

  const frontStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 1200 }, { rotateY: `${interpolate(progress.value, [0, 1], [0, 180])}deg` }],
    opacity: progress.value < 0.5 ? 1 : 0,
  }));
  const backStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 1200 }, { rotateY: `${interpolate(progress.value, [0, 1], [180, 360])}deg` }],
    opacity: progress.value >= 0.5 ? 1 : 0,
  }));

  const long = (meaning?.length ?? 0) > 80;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={revealHint}
      onPress={toggle}
      style={styles.wrap}>
      <Animated.View style={[styles.face, frontStyle]} pointerEvents="none">
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
        </ScrollView>
        <View style={styles.hint}>
          <Icon name="eye" size={14} color="ink2" />
          <AppText size={12} color="ink2">
            {revealHint}
          </AppText>
        </View>
      </Animated.View>

      <Animated.View style={[styles.face, styles.back, backStyle]} pointerEvents="none">
        <Eyebrow align="center" color="gold">
          {eyebrow}
        </Eyebrow>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.center}
          showsVerticalScrollIndicator={false}>
          {frontIsArabic ? (
            <AppText family="arabic" size={Math.min(arabicSize, 34)} align="center" color="gold" lineHeight={Math.round(Math.min(arabicSize, 34) * 1.6)}>
              {front}
            </AppText>
          ) : null}
          <View style={styles.rule} />
          {meaning ? (
            <AppText
              size={long ? 15 : 19}
              align="center"
              color="cream"
              weight="medium"
              lineHeight={long ? 23 : 28}>
              {meaning}
            </AppText>
          ) : null}
        </ScrollView>
        <View style={styles.hintSpacer} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  face: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    borderWidth: 1,
    borderColor: Colors.line,
    paddingVertical: 28,
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 12,
    backfaceVisibility: 'hidden',
  },
  back: { backgroundColor: Colors.green, borderColor: Colors.green },
  scroll: { flex: 1, width: '100%' },
  center: {
    flexGrow: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  italic: { fontStyle: 'italic' },
  rule: { width: 48, height: 1, backgroundColor: Colors.gold, marginVertical: 4, opacity: 0.7 },
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
