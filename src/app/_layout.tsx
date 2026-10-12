import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppText } from '@/components/app-text';
import { PrimaryButton } from '@/components/buttons';
import { QueryProvider } from '@/components/query-provider';
import { Colors } from '@/constants/tokens';
import { useOnboardingDone, useSettings } from '@/hooks/use-settings';
import { useT } from '@/hooks/use-t';
import { fontMap } from '@/lib/fonts';
import { configureNotificationHandler } from '@/services/reminders';

SplashScreen.preventAutoHideAsync();
configureNotificationHandler();

function Gate() {
  const { data: settings, isError, refetch } = useSettings();
  const { t, isRTL } = useT();
  const onboardingDone = useOnboardingDone();
  const ready = !!settings;

  useEffect(() => {
    if (ready || isError) SplashScreen.hideAsync();
  }, [ready, isError]);

  if (isError) {
    return (
      <View style={styles.error}>
        <AppText family="display" size={26} align="center">
          {t('errorTitle')}
        </AppText>
        <AppText color="ink2" align="center">
          {t('errorBody')}
        </AppText>
        <PrimaryButton label={t('retry')} icon={null} onPress={() => refetch()} style={styles.retry} />
      </View>
    );
  }
  if (!ready) return null;

  return (
    <View style={[styles.root, { direction: isRTL ? 'rtl' : 'ltr' }]}>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.bg } }}>
        <Stack.Protected guard={!onboardingDone}>
          <Stack.Screen name="onboarding" />
        </Stack.Protected>
        <Stack.Protected guard={onboardingDone}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="deck/[id]" />
          <Stack.Screen name="lesson/[id]" />
          <Stack.Screen name="study" options={{ gestureEnabled: false }} />
          <Stack.Screen name="deck/new" options={{ presentation: 'modal' }} />
          <Stack.Screen name="add-card" options={{ presentation: 'modal' }} />
        </Stack.Protected>
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(fontMap);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <QueryProvider>
        <StatusBar style="dark" />
        <Gate />
      </QueryProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  error: {
    flex: 1,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 12,
  },
  retry: { alignSelf: 'stretch', marginTop: 12 },
});
