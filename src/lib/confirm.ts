import { Alert, Platform } from 'react-native';

export function confirmAction(
  title: string,
  confirmLabel: string,
  cancelLabel: string,
  onConfirm: () => void,
) {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && window.confirm(title)) onConfirm();
    return;
  }
  Alert.alert(title, undefined, [
    { text: cancelLabel, style: 'cancel' },
    { text: confirmLabel, style: 'destructive', onPress: onConfirm },
  ]);
}
