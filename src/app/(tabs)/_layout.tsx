import { Tabs } from 'expo-router/js-tabs';

import { TabBar } from '@/components/tab-bar';
import { Colors } from '@/constants/tokens';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: Colors.bg } }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="progress" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}
