import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Colors, Radius } from '@/constants/tokens';

import { AppText } from './app-text';
import { Icon } from './icon';

type ListRowProps = {
  title: string;
  subtitle?: string;
  icon: string;
  onPress?: () => void;
  trailing?: ReactNode;
  showChevron?: boolean;
  disabled?: boolean;
  last?: boolean;
  tile?: ReactNode;
};

export function ListRow({
  title,
  subtitle,
  icon,
  onPress,
  trailing,
  showChevron = true,
  disabled,
  last,
  tile,
}: ListRowProps) {
  const content = (
    <>
      {tile ?? (
        <View style={styles.tile}>
          <Icon name={icon} size={20} color="green" />
        </View>
      )}
      <View style={styles.copy}>
        <AppText weight="semi" size={15} numberOfLines={2}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText size={12} color="ink2" numberOfLines={2}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {trailing}
      {showChevron && onPress ? <Icon name="chevron-right" size={18} color="ink3" /> : null}
    </>
  );

  if (!onPress) {
    return <View style={[styles.row, !last && styles.divider, { opacity: disabled ? 0.55 : 1 }]}>{content}</View>;
  }

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        !last && styles.divider,
        { opacity: disabled ? 0.55 : pressed ? 0.75 : 1 },
      ]}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14 },
  divider: { borderBottomWidth: 1, borderBottomColor: Colors.line },
  tile: {
    width: 44,
    height: 44,
    borderRadius: Radius.tile,
    backgroundColor: Colors.greenSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { flex: 1, gap: 3 },
});
