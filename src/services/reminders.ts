import { Platform } from 'react-native';

export type ReminderResult = 'ok' | 'denied' | 'unsupported';

export type ReminderCopy = { title: string; body: string };

const CHANNEL_ID = 'reminders';

export async function applyReminder(
  enabled: boolean,
  hour: number,
  minute: number,
  copy: ReminderCopy,
): Promise<ReminderResult> {
  if (Platform.OS === 'web') return enabled ? 'unsupported' : 'ok';

  const Notifications = await import('expo-notifications');
  await Notifications.cancelAllScheduledNotificationsAsync();
  if (!enabled) return 'ok';

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'Reminders',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  const current = await Notifications.getPermissionsAsync();
  let granted = current.granted;
  if (!granted) {
    const requested = await Notifications.requestPermissionsAsync({
      ios: { allowAlert: true, allowBadge: false, allowSound: true },
    });
    granted = requested.granted;
  }
  if (!granted) return 'denied';

  await Notifications.scheduleNotificationAsync({
    content: { title: copy.title, body: copy.body },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
      channelId: CHANNEL_ID,
    },
  });
  return 'ok';
}

export async function configureNotificationHandler(): Promise<void> {
  if (Platform.OS === 'web') return;
  const Notifications = await import('expo-notifications');
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}
