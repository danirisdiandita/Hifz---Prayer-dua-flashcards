export type Language = 'en' | 'id' | 'ar';

export const LANGUAGES: Language[] = ['id', 'en', 'ar'];

export type Localized = Record<Language, string>;

export type Word = {
  arabic: string;
  transliteration: string;
  meaning: Localized;
};

export type Phrase = {
  arabic: string;
  transliteration: string;
  meaning: Localized;
  words: Word[];
};

export type Segment = {
  id: string;
  title: Localized;
  subtitle: Localized;
  icon: string;
  phrases: Phrase[];
};

export type DeckSeed = {
  id: string;
  title: Localized;
  description: Localized;
  icon: string;
  segments: Segment[];
};
