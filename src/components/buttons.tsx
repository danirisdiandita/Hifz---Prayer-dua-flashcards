import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Colors, Radius, type ColorName } from '@/constants/tokens';

import { AppText } from './app-text';
import { Icon } from './icon';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  icon?: string | null;
  disabled?: boolean;
  tone?: 'green' | 'gold' | 'outline';
  style?: StyleProp<ViewStyle>;
};

export function PrimaryButton({
  label,
  onPress,
  icon = 'arrow-right',
  disabled,
  tone = 'green',
  style,
}: PrimaryButtonProps) {
  const bg = tone === 'green' ? Colors.green : tone === 'gold' ? Colors.gold : 'transparent';
  const labelColor: ColorName = tone === 'green' ? 'cream' : tone === 'gold' ? 'green' : 'green';
  const iconColor: ColorName = tone === 'green' ? 'gold' : 'green';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.primary,
        { backgroundColor: bg, opacity: disabled ? 0.45 : pressed ? 0.85 : 1 },
        tone === 'outline' && { borderWidth: 1.5, borderColor: Colors.green },
        style,
      ]}>
      <AppText weight="semi" size={15} color={labelColor}>
        {label}
      </AppText>
      {icon ? <Icon name={icon} size={18} color={iconColor} /> : null}
    </Pressable>
  );
}

type IconButtonProps = {
  icon: string;
  onPress: () => void;
  label: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
};

export function IconButton({ icon, onPress, label, size = 40, style }: IconButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [
        styles.iconButton,
        { width: size, height: size, borderRadius: size / 2, opacity: pressed ? 0.7 : 1 },
        style,
      ]}>
      <Icon name={icon} size={18} />
    </Pressable>
  );
}

export function Chip({ label, tone = 'gold' }: { label: string; tone?: 'gold' | 'soft' }) {
  return (
    <View style={[styles.chip, tone === 'gold' ? styles.chipGold : styles.chipSoft]}>
      <AppText weight="bold" size={10} color={tone === 'gold' ? 'green' : 'ink2'} letterSpacing={0.4}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  primary: {
    height: 56,
    borderRadius: Radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  iconButton: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chip: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.pill },
  chipGold: { backgroundColor: Colors.gold },
  chipSoft: { backgroundColor: Colors.goldSoft },
});
