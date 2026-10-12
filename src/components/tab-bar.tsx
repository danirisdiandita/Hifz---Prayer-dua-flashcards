import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, Layout } from '@/constants/tokens';
import { useT } from '@/hooks/use-t';
import type { StringKey } from '@/i18n/strings';

import { AppText } from './app-text';
import { Icon } from './icon';

const TABS: Record<string, { icon: string; label: StringKey }> = {
  index: { icon: 'house', label: 'tabHome' },
  progress: { icon: 'chart-no-axes-combined', label: 'tabProgress' },
  settings: { icon: 'settings-2', label: 'tabSettings' },
};

export function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { t } = useT();

  return (
    <View style={styles.wrap}>
      <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 12) + 10 }]}>
        {state.routes.map((route, index) => {
          const tab = TABS[route.name];
          if (!tab) return null;
          const focused = state.index === index;
          const color = focused ? 'green' : 'ink3';
          return (
            <Pressable
              key={route.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={t(tab.label)}
              onPress={() => {
                const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
                if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
              }}
              style={styles.tab}>
              <View style={[styles.indicator, focused && styles.indicatorOn]} />
              <Icon name={tab.icon} size={22} color={color} />
              <AppText weight="semi" size={11} color={color}>
                {t(tab.label)}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export const TAB_BAR_HEIGHT = 91;

const styles = StyleSheet.create({
  wrap: { backgroundColor: Colors.surface, alignItems: 'center' },
  bar: {
    width: '100%',
    maxWidth: Layout.maxContentWidth,
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.line,
    paddingTop: 0,
    paddingHorizontal: 20,
  },
  tab: { flex: 1, alignItems: 'center', gap: 5, paddingTop: 0 },
  indicator: { width: 28, height: 3, borderRadius: 2, backgroundColor: 'transparent' },
  indicatorOn: { backgroundColor: Colors.gold },
});
