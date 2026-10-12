import { Text, type TextProps, type TextStyle } from 'react-native';

import { Colors, FontFamily, type ColorName } from '@/constants/tokens';

type Family = 'display' | 'body' | 'mono' | 'arabic';
type Weight = 'regular' | 'medium' | 'semi' | 'bold';

const FAMILY_MAP: Record<Family, Record<Weight, string>> = {
  display: {
    regular: FontFamily.display,
    medium: FontFamily.display,
    semi: FontFamily.displayBold,
    bold: FontFamily.displayBold,
  },
  body: {
    regular: FontFamily.body,
    medium: FontFamily.bodyMedium,
    semi: FontFamily.bodySemi,
    bold: FontFamily.bodyBold,
  },
  mono: {
    regular: FontFamily.mono,
    medium: FontFamily.monoMedium,
    semi: FontFamily.monoMedium,
    bold: FontFamily.monoMedium,
  },
  arabic: {
    regular: FontFamily.arabic,
    medium: FontFamily.arabic,
    semi: FontFamily.arabicBold,
    bold: FontFamily.arabicBold,
  },
};

export type AppTextProps = TextProps & {
  family?: Family;
  weight?: Weight;
  size?: number;
  color?: ColorName;
  lineHeight?: number;
  letterSpacing?: number;
  align?: TextStyle['textAlign'];
};

export function AppText({
  family = 'body',
  weight = 'regular',
  size = 15,
  color = 'ink',
  lineHeight,
  letterSpacing,
  align,
  style,
  ...rest
}: AppTextProps) {
  const isArabic = family === 'arabic';
  return (
    <Text
      {...rest}
      style={[
        {
          fontFamily: FAMILY_MAP[family][weight],
          fontSize: size,
          color: Colors[color],
          lineHeight: lineHeight ?? (isArabic ? Math.round(size * 1.7) : Math.round(size * 1.35)),
          letterSpacing,
          textAlign: align,
        },
        isArabic && { writingDirection: 'rtl' },
        style,
      ]}
    />
  );
}

export function Eyebrow({
  children,
  color = 'gold',
  style,
  ...rest
}: Omit<AppTextProps, 'size' | 'weight' | 'family'>) {
  return (
    <AppText
      family="body"
      weight="bold"
      size={11}
      color={color}
      letterSpacing={1.6}
      style={[{ textTransform: 'uppercase' }, style]}
      {...rest}>
      {children}
    </AppText>
  );
}
