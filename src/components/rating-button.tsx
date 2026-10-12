import { Pressable, StyleSheet, View } from 'react-native';

import { Colors, Radius } from '@/constants/tokens';
import type { RatingName } from '@/services/srs';

import { AppText } from './app-text';

const DOT: Record<RatingName, string> = {
  again: Colors.again,
  hard: Colors.gold,
  good: Colors.green2,
  easy: Colors.easy,
};

type Props = {
  rating: RatingName;
  label: string;
  interval: string;
  onPress: () => void;
  disabled?: boolean;
};

export function RatingButton({ rating, label, interval, onPress, disabled }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label} ${interval}`}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.button, { opacity: disabled ? 0.5 : pressed ? 0.75 : 1 }]}>
      <View style={[styles.dot, { backgroundColor: DOT[rating] }]} />
      <AppText weight="semi" size={13}>
        {label}
      </AppText>
      <AppText family="mono" size={11} color="ink2">
        {interval}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.rating,
    borderWidth: 1,
    borderColor: Colors.line,
    paddingVertical: 12,
    alignItems: 'center',
    gap: 3,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
});
