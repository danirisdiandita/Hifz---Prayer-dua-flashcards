import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, Layout } from '@/constants/tokens';

type ScreenProps = {
  children: ReactNode;
  scroll?: boolean;
  footer?: ReactNode;
  bottomInset?: number;
  contentStyle?: StyleProp<ViewStyle>;
};

export function Screen({ children, scroll = true, footer, bottomInset = 0, contentStyle }: ScreenProps) {
  const insets = useSafeAreaInsets();
  const body = scroll ? (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 12, paddingBottom: bottomInset + 24 },
        contentStyle,
      ]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  ) : (
    <View
      style={[styles.flex, styles.content, { paddingTop: insets.top + 12 }, contentStyle]}>
      {children}
    </View>
  );

  return (
    <View style={styles.root}>
      <View style={styles.column}>
        {body}
        {footer ? (
          <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) + 8 }]}>
            {footer}
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg, alignItems: 'center' },
  column: { flex: 1, width: '100%', maxWidth: Layout.maxContentWidth },
  flex: { flex: 1 },
  content: { paddingHorizontal: Layout.screenPadding, gap: 14 },
  footer: { paddingHorizontal: Layout.screenPadding, paddingTop: 8, gap: 12 },
});
