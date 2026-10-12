import type { DeckSeed, Localized, Phrase, Segment } from './types';

type W = [arabic: string, transliteration: string, en: string, id: string, ar: string];

const loc = (en: string, id: string, ar: string): Localized => ({ en, id, ar });

const phrase = (words: W[], en: string, id: string, ar: string): Phrase => ({
  arabic: words.map((w) => w[0]).join(' '),
  transliteration: words.map((w) => w[1]).join(' '),
  meaning: loc(en, id, ar),
  words: words.map(([arabic, transliteration, wen, wid, war]) => ({
    arabic,
    transliteration,
    meaning: loc(wen, wid, war),
  })),
});

const doa = (
  id: string,
  title: Localized,
  subtitle: Localized,
  icon: string,
  phrases: Phrase[],
): Segment => ({ id, title, subtitle, icon, phrases });

const ALLAH_GEN: W = ['اللّٰهِ', 'Allāhi', 'Allah', 'Allah', 'الله'];
const ALHAMDU: W[] = [
  ['الْحَمْدُ', 'al-ḥamdu', 'all praise', 'segala puji', 'الثناء الكامل'],
  ['لِلّٰهِ', 'lillāhi', 'is for Allah', 'bagi Allah', 'لله'],
];

export const supplicationsDeck: DeckSeed = {
  id: 'deck-daily-supplications',
  title: loc('Daily Supplications', 'Doa Sehari-hari', 'الأدعية اليومية'),
  description: loc(
    'Short supplications for everyday life',
    'Doa-doa pendek untuk keseharian',
    'أدعية قصيرة للحياة اليومية',
  ),
  icon: 'sparkles',
  segments: [
    doa(
      'doa-waking',
      loc('Upon Waking Up', 'Doa Bangun Tidur', 'دعاء الاستيقاظ'),
      loc('When you wake up', 'Ketika bangun tidur', 'عند الاستيقاظ'),
      'sunrise',
      [
        phrase(
          [
            ...ALHAMDU,
            ['الَّذِي', 'alladhī', 'who', 'yang', 'الذي'],
            ['أَحْيَانَا', 'aḥyānā', 'gave us life', 'menghidupkan kami', 'أعادنا إلى الحياة'],
            ['بَعْدَ', 'ba‘da', 'after', 'setelah', 'بعد'],
            ['مَا', 'mā', 'what', 'apa yang', 'ما'],
            ['أَمَاتَنَا', 'amātanā', 'He made us die', 'mematikan kami', 'أنامنا'],
          ],
          'All praise is for Allah who gave us life after having caused us to die',
          'Segala puji bagi Allah yang telah menghidupkan kami setelah mematikan kami',
          'الثناء لله الذي أعادنا إلى الحياة بعد أن أنامنا',
        ),
        phrase(
          [
            ['وَإِلَيْهِ', 'wa ilayhi', 'and to Him', 'dan kepada-Nya', 'وإليه'],
            ['النُّشُورُ', 'an-nushūru', 'is the resurrection', 'kami dibangkitkan', 'البعث بعد الموت'],
          ],
          'And to Him is the resurrection',
          'Dan kepada-Nya kami akan dibangkitkan',
          'وإليه البعث بعد الموت',
        ),
      ],
    ),
    doa(
      'doa-sleeping',
      loc('Before Sleeping', 'Doa Sebelum Tidur', 'دعاء النوم'),
      loc('Before going to bed', 'Sebelum tidur', 'قبل النوم'),
      'moon',
      [
        phrase(
          [
            ['بِاسْمِكَ', 'bismika', 'in Your name', 'dengan nama-Mu', 'باسمك'],
            ['اللّٰهُمَّ', 'allāhumma', 'O Allah', 'Ya Allah', 'يا الله'],
            ['أَحْيَا', 'aḥyā', 'I live', 'aku hidup', 'أعيش'],
            ['وَبِاسْمِكَ', 'wa bismika', 'and in Your name', 'dan dengan nama-Mu', 'وباسمك'],
            ['أَمُوتُ', 'amūtu', 'I die', 'aku mati', 'أنام'],
          ],
          'In Your name, O Allah, I live and I die',
          'Dengan nama-Mu ya Allah aku hidup dan aku mati',
          'باسمك يا الله أعيش وأنام',
        ),
      ],
    ),
    doa(
      'doa-before-eating',
      loc('Before Eating', 'Doa Sebelum Makan', 'دعاء قبل الطعام'),
      loc('Before a meal', 'Sebelum makan', 'قبل الأكل'),
      'utensils',
      [
        phrase(
          [
            ['اللّٰهُمَّ', 'allāhumma', 'O Allah', 'Ya Allah', 'يا الله'],
            ['بَارِكْ', 'bārik', 'bless', 'berkahilah', 'أنزل البركة'],
            ['لَنَا', 'lanā', 'for us', 'untuk kami', 'لنا'],
            ['فِيمَا', 'fīmā', 'in what', 'pada apa yang', 'فيما'],
            ['رَزَقْتَنَا', 'razaqtanā', 'You have provided us', 'Engkau rezekikan kepada kami', 'أعطيتنا'],
          ],
          'O Allah, bless for us what You have provided us',
          'Ya Allah, berkahilah rezeki yang Engkau berikan kepada kami',
          'اللهم أنزل البركة فيما أعطيتنا',
        ),
        phrase(
          [
            ['وَقِنَا', 'wa qinā', 'and protect us', 'dan lindungilah kami', 'واحفظنا'],
            ['عَذَابَ', '‘adhāba', 'from the punishment of', 'dari azab', 'من عقوبة'],
            ['النَّارِ', 'an-nāri', 'the Fire', 'neraka', 'النار'],
          ],
          'And protect us from the punishment of the Fire',
          'Dan lindungilah kami dari azab neraka',
          'واحفظنا من عقوبة النار',
        ),
        phrase(
          [['بِسْمِ', 'bismi', 'in the name of', 'dengan nama', 'باسم'], ALLAH_GEN],
          'In the name of Allah',
          'Dengan nama Allah',
          'باسم الله',
        ),
      ],
    ),
    doa(
      'doa-after-eating',
      loc('After Eating', 'Doa Sesudah Makan', 'دعاء بعد الطعام'),
      loc('After a meal', 'Sesudah makan', 'بعد الأكل'),
      'utensils-crossed',
      [
        phrase(
          [
            ...ALHAMDU,
            ['الَّذِي', 'alladhī', 'who', 'yang', 'الذي'],
            ['أَطْعَمَنَا', 'aṭ‘amanā', 'fed us', 'memberi kami makan', 'رزقنا الطعام'],
            ['وَسَقَانَا', 'wa saqānā', 'and gave us drink', 'dan memberi kami minum', 'ورزقنا الشراب'],
          ],
          'All praise is for Allah who fed us and gave us drink',
          'Segala puji bagi Allah yang telah memberi kami makan dan minum',
          'الثناء لله الذي رزقنا الطعام والشراب',
        ),
        phrase(
          [
            ['وَجَعَلَنَا', 'wa ja‘alanā', 'and made us', 'dan menjadikan kami', 'وجعلنا'],
            ['مُسْلِمِينَ', 'muslimīna', 'Muslims', 'orang-orang muslim', 'منقادين لله'],
          ],
          'And made us Muslims',
          'Dan menjadikan kami orang-orang muslim',
          'وجعلنا منقادين لله',
        ),
      ],
    ),
    doa(
      'doa-leaving-home',
      loc('Leaving Home', 'Doa Keluar Rumah', 'دعاء الخروج من المنزل'),
      loc('When you step outside', 'Ketika keluar rumah', 'عند الخروج'),
      'door-open',
      [
        phrase(
          [
            ['بِسْمِ', 'bismi', 'in the name of', 'dengan nama', 'باسم'],
            ALLAH_GEN,
            ['تَوَكَّلْتُ', 'tawakkaltu', 'I put my trust', 'aku bertawakal', 'اعتمدت'],
            ['عَلَى', '‘alā', 'in', 'kepada', 'على'],
            ALLAH_GEN,
          ],
          'In the name of Allah, I put my trust in Allah',
          'Dengan nama Allah, aku bertawakal kepada Allah',
          'باسم الله، اعتمدت على الله',
        ),
        phrase(
          [
            ['وَلَا', 'wa lā', 'and there is no', 'dan tidak ada', 'ولا'],
            ['حَوْلَ', 'ḥawla', 'power', 'daya', 'تحوُّل'],
            ['وَلَا', 'wa lā', 'and no', 'dan tidak ada', 'ولا'],
            ['قُوَّةَ', 'quwwata', 'strength', 'kekuatan', 'قدرة'],
            ['إِلَّا', 'illā', 'except', 'kecuali', 'إلا'],
            ['بِاللّٰهِ', 'billāhi', 'with Allah', 'dengan pertolongan Allah', 'بالله'],
          ],
          'There is no power and no strength except with Allah',
          'Tiada daya dan tiada kekuatan kecuali dengan pertolongan Allah',
          'لا تحوُّل من حال إلى حال ولا قدرة إلا بالله',
        ),
      ],
    ),
    doa(
      'doa-parents',
      loc('For Parents', 'Doa untuk Orang Tua', 'دعاء للوالدين'),
      loc('Supplication for your parents', 'Mendoakan kedua orang tua', 'الدعاء للوالدين'),
      'heart',
      [
        phrase(
          [
            ['رَبِّ', 'rabbi', 'my Lord', 'Tuhanku', 'يا ربي'],
            ['اغْفِرْ', 'ighfir', 'forgive', 'ampunilah', 'استر الذنب'],
            ['لِي', 'lī', 'me', 'aku', 'لي'],
            ['وَلِوَالِدَيَّ', 'wa liwālidayya', 'and my parents', 'dan kedua orang tuaku', 'ولأبوي'],
          ],
          'My Lord, forgive me and my parents',
          'Ya Tuhanku, ampunilah aku dan kedua orang tuaku',
          'يا رب اغفر لي ولأبوي',
        ),
        phrase(
          [
            ['وَارْحَمْهُمَا', 'warḥamhumā', 'and have mercy on them', 'dan sayangilah mereka berdua', 'وارحمهما'],
            ['كَمَا', 'kamā', 'as', 'sebagaimana', 'مثلما'],
            ['رَبَّيَانِي', 'rabbayānī', 'they raised me', 'mereka mendidikku', 'اعتنيا بي'],
            ['صَغِيرًا', 'ṣaghīran', 'when I was small', 'waktu kecil', 'وأنا طفل'],
          ],
          'And have mercy on them as they raised me when I was small',
          'Dan sayangilah mereka berdua sebagaimana mereka mendidikku waktu kecil',
          'وارحمهما مثلما اعتنيا بي وأنا طفل',
        ),
      ],
    ),
  ],
};
