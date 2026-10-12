export const Colors = {
  bg: '#F4EFE4',
  surface: '#FFFDF8',
  ink: '#141F1B',
  ink2: '#5E6963',
  ink3: '#9AA49E',
  green: '#1E3A32',
  green2: '#2F5447',
  greenSoft: '#DCE6DE',
  gold: '#C8A050',
  goldSoft: '#F3E7C8',
  cream: '#F4EFE4',
  line: '#E2DACB',
  again: '#C0564B',
  easy: '#4F7FA3',
} as const;

export type ColorName = keyof typeof Colors;

export const Radius = {
  pill: 999,
  card: 28,
  rating: 16,
  tile: 14,
  icon: 20,
} as const;

export const Layout = {
  screenPadding: 24,
  maxContentWidth: 520,
} as const;

export const FontFamily = {
  display: 'Fraunces_500Medium',
  displayBold: 'Fraunces_600SemiBold',
  body: 'PlusJakartaSans_400Regular',
  bodyMedium: 'PlusJakartaSans_500Medium',
  bodySemi: 'PlusJakartaSans_600SemiBold',
  bodyBold: 'PlusJakartaSans_700Bold',
  mono: 'DMMono_400Regular',
  monoMedium: 'DMMono_500Medium',
  arabic: 'Amiri_400Regular',
  arabicBold: 'Amiri_700Bold',
} as const;
