import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { Colors, FontFamily } from '@/constants/tokens';

import { Eyebrow } from './app-text';

type FormFieldProps = TextInputProps & { label: string };

export function FormField({ label, style, multiline, ...rest }: FormFieldProps) {
  return (
    <View style={styles.field}>
      <Eyebrow color="ink2">{label}</Eyebrow>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={Colors.ink3}
        multiline={multiline}
        {...rest}
        style={[styles.input, multiline && styles.multiline, style]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: 8 },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.line,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: FontFamily.body,
    fontSize: 15,
    color: Colors.ink,
  },
  multiline: { minHeight: 84, textAlignVertical: 'top' },
});
