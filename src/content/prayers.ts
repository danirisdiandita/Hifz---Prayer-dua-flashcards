import type { DeckSeed, Localized, Phrase, Segment, Word } from './types';

type W = [arabic: string, transliteration: string, en: string, id: string, ar: string];

const loc = (en: string, id: string, ar: string): Localized => ({ en, id, ar });

const word = ([arabic, transliteration, en, id, ar]: W): Word => ({
  arabic,
  transliteration,
  meaning: loc(en, id, ar),
});

const phrase = (words: W[], en: string, id: string, ar: string): Phrase => ({
  arabic: words.map((w) => w[0]).join(' '),
  transliteration: words.map((w) => w[1]).join(' '),
  meaning: loc(en, id, ar),
  words: words.map(word),
});

const segment = (
  id: string,
  title: Localized,
  subtitle: Localized,
  icon: string,
  phrases: Phrase[],
): Segment => ({ id, title, subtitle, icon, phrases });

const ALLAH: W = ['اللّٰهُ', 'Allāhu', 'Allah', 'Allah', 'الإله الواحد المعبود'];
const ALLAH_GEN: W = ['اللّٰهِ', 'Allāhi', 'Allah', 'Allah', 'الإله الواحد المعبود'];

const basmalah = (): Phrase =>
  phrase(
    [
      ['بِسْمِ', 'bismi', 'In the name of', 'Dengan nama', 'باسم'],
      ALLAH_GEN,
      ['الرَّحْمٰنِ', 'ar-raḥmāni', 'the Most Gracious', 'Yang Maha Pengasih', 'واسع الرحمة'],
      ['الرَّحِيمِ', 'ar-raḥīmi', 'the Most Merciful', 'Yang Maha Penyayang', 'كثير الرحمة بالمؤمنين'],
    ],
    'In the name of Allah, the Most Gracious, the Most Merciful',
    'Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang',
    'أبدأ باسم الله واسع الرحمة، كثير الرحمة بعباده',
  );

const NIAT_COMMON: W[] = [
  ['مُسْتَقْبِلَ', 'mustaqbila', 'facing', 'menghadap', 'متوجهًا إلى'],
  ['الْقِبْلَةِ', 'al-qiblati', 'the qiblah', 'kiblat', 'الكعبة المشرفة'],
  ['أَدَاءً', 'adā’an', 'on time', 'tepat pada waktunya', 'في وقتها'],
  ['لِلّٰهِ', 'lillāhi', 'for Allah', 'karena Allah', 'خالصًا لله'],
  ['تَعَالَىٰ', 'ta‘ālā', 'the Most High', 'Yang Maha Tinggi', 'المتعالي سبحانه'],
];

const niat = (
  key: string,
  titleEn: string,
  titleId: string,
  titleAr: string,
  prayerWord: W,
  units: W[],
  unitsEn: string,
  unitsId: string,
  unitsAr: string,
  prayerEn: string,
  prayerId: string,
  prayerAr: string,
): Segment =>
  segment(
    `niat-${key}`,
    loc(`Intention: ${titleEn}`, `Niat Shalat ${titleId}`, `نية صلاة ${titleAr}`),
    loc(
      'Intention, said in the heart',
      'Diucapkan dalam hati',
      'تُقال في القلب',
    ),
    'heart',
    [
      phrase(
        [
          ['أُصَلِّي', 'uṣallī', 'I pray', 'aku shalat', 'أؤدي الصلاة'],
          ['فَرْضَ', 'farḍa', 'the obligatory', 'fardhu', 'الفريضة'],
          prayerWord,
          ...units,
        ],
        `I intend to pray the obligatory ${prayerEn} prayer, ${unitsEn}`,
        `Aku berniat shalat fardhu ${prayerId}, ${unitsId}`,
        `أنوي أداء فريضة ${prayerAr}، ${unitsAr}`,
      ),
      phrase(
        NIAT_COMMON,
        'facing the qiblah, on time, for Allah the Most High',
        'menghadap kiblat, tepat pada waktunya, karena Allah Ta’ala',
        'متوجهًا إلى القبلة، في وقتها، خالصًا لله تعالى',
      ),
    ],
  );

const niatSegments: Segment[] = [
  niat(
    'subuh',
    'Fajr',
    'Subuh',
    'الفجر',
    ['الصُّبْحِ', 'aṣ-ṣubḥi', 'Fajr (dawn)', 'Subuh', 'صلاة الفجر'],
    [['رَكْعَتَيْنِ', 'rak‘atayni', 'two units', 'dua rakaat', 'ركعتان']],
    'two units',
    'dua rakaat',
    'ركعتين',
    'Fajr',
    'Subuh',
    'الفجر',
  ),
  niat(
    'dzuhur',
    'Dhuhr',
    'Dzuhur',
    'الظهر',
    ['الظُّهْرِ', 'aẓ-ẓuhri', 'Dhuhr (noon)', 'Dzuhur', 'صلاة الظهر'],
    [['أَرْبَعَ', 'arba‘a', 'four', 'empat', 'أربع'], ['رَكَعَاتٍ', 'raka‘ātin', 'units', 'rakaat', 'ركعات']],
    'four units',
    'empat rakaat',
    'أربع ركعات',
    'Dhuhr',
    'Dzuhur',
    'الظهر',
  ),
  niat(
    'ashar',
    'Asr',
    'Ashar',
    'العصر',
    ['الْعَصْرِ', 'al-‘aṣri', 'Asr (afternoon)', 'Ashar', 'صلاة العصر'],
    [['أَرْبَعَ', 'arba‘a', 'four', 'empat', 'أربع'], ['رَكَعَاتٍ', 'raka‘ātin', 'units', 'rakaat', 'ركعات']],
    'four units',
    'empat rakaat',
    'أربع ركعات',
    'Asr',
    'Ashar',
    'العصر',
  ),
  niat(
    'maghrib',
    'Maghrib',
    'Maghrib',
    'المغرب',
    ['الْمَغْرِبِ', 'al-maghribi', 'Maghrib (sunset)', 'Maghrib', 'صلاة المغرب'],
    [['ثَلَاثَ', 'thalātha', 'three', 'tiga', 'ثلاث'], ['رَكَعَاتٍ', 'raka‘ātin', 'units', 'rakaat', 'ركعات']],
    'three units',
    'tiga rakaat',
    'ثلاث ركعات',
    'Maghrib',
    'Maghrib',
    'المغرب',
  ),
  niat(
    'isya',
    'Isha',
    'Isya',
    'العشاء',
    ['الْعِشَاءِ', 'al-‘ishā’i', 'Isha (night)', 'Isya', 'صلاة العشاء'],
    [['أَرْبَعَ', 'arba‘a', 'four', 'empat', 'أربع'], ['رَكَعَاتٍ', 'raka‘ātin', 'units', 'rakaat', 'ركعات']],
    'four units',
    'empat rakaat',
    'أربع ركعات',
    'Isha',
    'Isya',
    'العشاء',
  ),
];

const takbir = segment(
  'takbiratul-ihram',
  loc('Takbiratul Ihram', 'Takbiratul Ihram', 'تكبيرة الإحرام'),
  loc('Opening takbir', 'Takbir pembuka', 'تكبيرة الافتتاح'),
  'hand',
  [
    phrase(
      [ALLAH, ['أَكْبَرُ', 'akbaru', 'the Greatest', 'Maha Besar', 'أعظم من كل شيء']],
      'Allah is the Greatest',
      'Allah Maha Besar',
      'الله أعظم من كل شيء',
    ),
  ],
);

const iftitah = segment(
  'doa-iftitah',
  loc('Doa Iftitah', 'Doa Iftitah', 'دعاء الاستفتاح'),
  loc('Opening supplication', 'Doa pembuka shalat', 'دعاء افتتاح الصلاة'),
  'sunrise',
  [
    phrase(
      [
        ALLAH,
        ['أَكْبَرُ', 'akbaru', 'is the Greatest', 'Maha Besar', 'أعظم'],
        ['كَبِيرًا', 'kabīran', 'greatly', 'sebesar-besarnya', 'عظمة كبيرة'],
      ],
      'Allah is the Greatest, truly great',
      'Allah Maha Besar dengan sebesar-besarnya',
      'الله أعظم عظمةً كبيرةً',
    ),
    phrase(
      [
        ['وَالْحَمْدُ', 'wal-ḥamdu', 'and all praise', 'dan segala puji', 'والثناء الجميل'],
        ['لِلّٰهِ', 'lillāhi', 'is for Allah', 'bagi Allah', 'خالص لله'],
        ['كَثِيرًا', 'kathīran', 'abundantly', 'sebanyak-banyaknya', 'حمدًا وافرًا'],
      ],
      'And all praise is for Allah, abundantly',
      'Segala puji bagi Allah dengan pujian yang banyak',
      'والثناء الجميل لله حمدًا كثيرًا',
    ),
    phrase(
      [
        ['وَسُبْحَانَ', 'wa subḥāna', 'and glory be to', 'dan Maha Suci', 'وتنزيه'],
        ALLAH,
        ['بُكْرَةً', 'bukratan', 'in the morning', 'di waktu pagi', 'صباحًا'],
        ['وَأَصِيلًا', 'wa aṣīlan', 'and in the evening', 'dan petang', 'ومساءً'],
      ],
      'And glory be to Allah, morning and evening',
      'Maha Suci Allah di waktu pagi dan petang',
      'وتنزيهًا لله صباحًا ومساءً',
    ),
    phrase(
      [
        ['إِنِّي', 'innī', 'indeed I', 'sesungguhnya aku', 'إنني'],
        ['وَجَّهْتُ', 'wajjahtu', 'have turned', 'menghadapkan', 'أقبلت'],
        ['وَجْهِيَ', 'wajhiya', 'my face', 'wajahku', 'ذاتي كلها'],
        ['لِلَّذِي', 'lilladhī', 'to the One who', 'kepada Zat yang', 'إلى الذي'],
        ['فَطَرَ', 'faṭara', 'created', 'menciptakan', 'خلق'],
        ['السَّمَاوَاتِ', 'as-samāwāti', 'the heavens', 'langit', 'العوالم العلوية'],
        ['وَالْأَرْضَ', 'wal-arḍa', 'and the earth', 'dan bumi', 'والأرض'],
      ],
      'Indeed, I have turned my face to the One who created the heavens and the earth',
      'Sesungguhnya aku menghadapkan wajahku kepada Zat yang menciptakan langit dan bumi',
      'إني أقبلت بذاتي كلها إلى الذي خلق السماوات والأرض',
    ),
    phrase(
      [
        ['حَنِيفًا', 'ḥanīfan', 'upright', 'dengan lurus', 'مائلًا عن الباطل'],
        ['مُسْلِمًا', 'musliman', 'in submission', 'berserah diri', 'منقادًا لله'],
        ['وَمَا', 'wa mā', 'and I am not', 'dan bukanlah', 'ولست'],
        ['أَنَا', 'anā', 'I', 'aku', 'أنا'],
        ['مِنَ', 'mina', 'among', 'termasuk', 'من'],
        ['الْمُشْرِكِينَ', 'al-mushrikīna', 'the polytheists', 'orang-orang musyrik', 'الذين يشركون بالله'],
      ],
      'Upright and submitting, and I am not among the polytheists',
      'Dengan lurus dan berserah diri, dan aku bukan termasuk orang-orang musyrik',
      'مستقيمًا منقادًا لله، ولست من المشركين',
    ),
    phrase(
      [
        ['إِنَّ', 'inna', 'indeed', 'sesungguhnya', 'إن'],
        ['صَلَاتِي', 'ṣalātī', 'my prayer', 'shalatku', 'عبادتي'],
        ['وَنُسُكِي', 'wa nusukī', 'and my worship', 'ibadahku', 'وقرباني وطاعتي'],
        ['وَمَحْيَايَ', 'wa maḥyāya', 'and my life', 'hidupku', 'وحياتي'],
        ['وَمَمَاتِي', 'wa mamātī', 'and my death', 'dan matiku', 'ووفاتي'],
        ['لِلّٰهِ', 'lillāhi', 'are for Allah', 'adalah untuk Allah', 'لله وحده'],
        ['رَبِّ', 'rabbi', 'Lord', 'Tuhan', 'مالك ومدبر'],
        ['الْعَالَمِينَ', 'al-‘ālamīna', 'of the worlds', 'semesta alam', 'جميع المخلوقات'],
      ],
      'Indeed my prayer, my worship, my life and my death are for Allah, Lord of the worlds',
      'Sesungguhnya shalatku, ibadahku, hidupku dan matiku hanyalah untuk Allah, Tuhan semesta alam',
      'إن صلاتي وعبادتي وحياتي ووفاتي لله وحده رب جميع المخلوقات',
    ),
    phrase(
      [
        ['لَا', 'lā', 'no', 'tidak ada', 'لا'],
        ['شَرِيكَ', 'sharīka', 'partner', 'sekutu', 'مشارك'],
        ['لَهُ', 'lahu', 'for Him', 'bagi-Nya', 'له'],
        ['وَبِذٰلِكَ', 'wa bidhālika', 'and with that', 'dan dengan itu', 'وبهذا'],
        ['أُمِرْتُ', 'umirtu', 'I was commanded', 'aku diperintahkan', 'كُلِّفت'],
        ['وَأَنَا', 'wa anā', 'and I am', 'dan aku', 'وأنا'],
        ['مِنَ', 'mina', 'among', 'termasuk', 'من'],
        ['الْمُسْلِمِينَ', 'al-muslimīna', 'the Muslims', 'orang-orang muslim', 'المنقادين لله'],
      ],
      'He has no partner. This I was commanded, and I am among the Muslims',
      'Tiada sekutu bagi-Nya. Demikian aku diperintahkan, dan aku termasuk orang-orang muslim',
      'لا شريك له، وبهذا أُمرت، وأنا من المسلمين',
    ),
  ],
);

const fatihah = segment(
  'al-fatihah',
  loc('Al-Fatihah', 'Al-Fatihah', 'سورة الفاتحة'),
  loc('The opening chapter', 'Surat pembuka', 'فاتحة الكتاب'),
  'book-open',
  [
    basmalah(),
    phrase(
      [
        ['الْحَمْدُ', 'al-ḥamdu', 'all praise', 'segala puji', 'الثناء الكامل'],
        ['لِلّٰهِ', 'lillāhi', 'is for Allah', 'bagi Allah', 'خالص لله'],
        ['رَبِّ', 'rabbi', 'Lord', 'Tuhan', 'مالك ومربي'],
        ['الْعَالَمِينَ', 'al-‘ālamīna', 'of the worlds', 'semesta alam', 'جميع المخلوقات'],
      ],
      'All praise is for Allah, Lord of the worlds',
      'Segala puji bagi Allah, Tuhan semesta alam',
      'الثناء الكامل لله مالك جميع المخلوقات ومربيهم',
    ),
    phrase(
      [
        ['الرَّحْمٰنِ', 'ar-raḥmāni', 'the Most Gracious', 'Yang Maha Pengasih', 'واسع الرحمة'],
        ['الرَّحِيمِ', 'ar-raḥīmi', 'the Most Merciful', 'Yang Maha Penyayang', 'كثير الرحمة بالمؤمنين'],
      ],
      'The Most Gracious, the Most Merciful',
      'Yang Maha Pengasih lagi Maha Penyayang',
      'واسع الرحمة، كثير الرحمة بالمؤمنين',
    ),
    phrase(
      [
        ['مَالِكِ', 'māliki', 'Master', 'Pemilik', 'صاحب التصرف'],
        ['يَوْمِ', 'yawmi', 'of the Day', 'hari', 'يوم'],
        ['الدِّينِ', 'ad-dīni', 'of Judgment', 'pembalasan', 'الجزاء والحساب'],
      ],
      'Master of the Day of Judgment',
      'Pemilik hari pembalasan',
      'صاحب التصرف المطلق يوم الجزاء والحساب',
    ),
    phrase(
      [
        ['إِيَّاكَ', 'iyyāka', 'You alone', 'hanya kepada-Mu', 'لك وحدك'],
        ['نَعْبُدُ', 'na‘budu', 'we worship', 'kami menyembah', 'نخضع ونطيع'],
        ['وَإِيَّاكَ', 'wa iyyāka', 'and You alone', 'dan hanya kepada-Mu', 'ولك وحدك'],
        ['نَسْتَعِينُ', 'nasta‘īnu', 'we ask for help', 'kami memohon pertolongan', 'نطلب العون'],
      ],
      'You alone we worship, and You alone we ask for help',
      'Hanya kepada-Mu kami menyembah dan hanya kepada-Mu kami memohon pertolongan',
      'لك وحدك نخضع ونعبد، ولك وحدك نطلب العون',
    ),
    phrase(
      [
        ['اهْدِنَا', 'ihdinā', 'guide us', 'tunjukilah kami', 'دلنا ووفقنا'],
        ['الصِّرَاطَ', 'aṣ-ṣirāṭa', 'to the path', 'jalan', 'الطريق'],
        ['الْمُسْتَقِيمَ', 'al-mustaqīma', 'the straight', 'yang lurus', 'الذي لا اعوجاج فيه'],
      ],
      'Guide us to the straight path',
      'Tunjukilah kami jalan yang lurus',
      'دلنا ووفقنا إلى الطريق الذي لا اعوجاج فيه',
    ),
    phrase(
      [
        ['صِرَاطَ', 'ṣirāṭa', 'the path of', 'jalan', 'طريق'],
        ['الَّذِينَ', 'alladhīna', 'those', 'orang-orang yang', 'الذين'],
        ['أَنْعَمْتَ', 'an‘amta', 'You have favored', 'Engkau beri nikmat', 'تفضلت عليهم'],
        ['عَلَيْهِمْ', '‘alayhim', 'upon them', 'kepada mereka', 'عليهم'],
        ['غَيْرِ', 'ghayri', 'not', 'bukan', 'لا'],
        ['الْمَغْضُوبِ', 'al-maghḍūbi', 'those who earned anger', 'mereka yang dimurkai', 'الذين غضب الله عليهم'],
        ['عَلَيْهِمْ', '‘alayhim', 'upon them', 'atas mereka', 'عليهم'],
        ['وَلَا', 'wa lā', 'and not', 'dan bukan', 'ولا'],
        ['الضَّالِّينَ', 'aḍ-ḍāllīna', 'those who went astray', 'mereka yang sesat', 'التائهين عن الحق'],
      ],
      'The path of those You have favored, not of those who earned anger, nor of those who went astray',
      'Yaitu jalan orang-orang yang telah Engkau beri nikmat, bukan jalan mereka yang dimurkai dan bukan pula mereka yang sesat',
      'طريق الذين أنعمت عليهم، لا الذين غضبت عليهم ولا التائهين عن الحق',
    ),
  ],
);

const ikhlas = segment(
  'surah-al-ikhlas',
  loc('Surah Al-Ikhlas', 'Surat Al-Ikhlas', 'سورة الإخلاص'),
  loc('Short surah (112)', 'Surat pendek (112)', 'سورة قصيرة (١١٢)'),
  'sparkles',
  [
    basmalah(),
    phrase(
      [
        ['قُلْ', 'qul', 'say', 'katakanlah', 'أخبر'],
        ['هُوَ', 'huwa', 'He is', 'Dialah', 'هو'],
        ALLAH,
        ['أَحَدٌ', 'aḥadun', 'One', 'Maha Esa', 'واحد لا شريك له'],
      ],
      'Say: He is Allah, the One',
      'Katakanlah: Dialah Allah, Yang Maha Esa',
      'قل: هو الله الواحد الذي لا شريك له',
    ),
    phrase(
      [ALLAH, ['الصَّمَدُ', 'aṣ-ṣamadu', 'the Eternal Refuge', 'tempat bergantung', 'المقصود في الحاجات']],
      'Allah, the Eternal Refuge',
      'Allah tempat bergantung segala sesuatu',
      'الله المقصود في كل الحاجات',
    ),
    phrase(
      [
        ['لَمْ', 'lam', 'not', 'tidak', 'لم'],
        ['يَلِدْ', 'yalid', 'He begets', 'beranak', 'له ولد'],
        ['وَلَمْ', 'wa lam', 'and not', 'dan tidak', 'ولم'],
        ['يُولَدْ', 'yūlad', 'is He born', 'diperanakkan', 'وُلد من أحد'],
      ],
      'He neither begets nor is born',
      'Dia tidak beranak dan tidak pula diperanakkan',
      'لم يلد ولم يولد',
    ),
    phrase(
      [
        ['وَلَمْ', 'wa lam', 'and not', 'dan tidak', 'ولم'],
        ['يَكُنْ', 'yakun', 'is there', 'ada', 'يوجد'],
        ['لَهُ', 'lahu', 'for Him', 'bagi-Nya', 'له'],
        ['كُفُوًا', 'kufuwan', 'equal', 'yang setara', 'مثيلًا'],
        ['أَحَدٌ', 'aḥadun', 'anyone', 'seorang pun', 'أحد'],
      ],
      'And there is none equal to Him',
      'Dan tidak ada seorang pun yang setara dengan-Nya',
      'ولا يوجد له مثيل ولا نظير',
    ),
  ],
);

const kautsar = segment(
  'surah-al-kautsar',
  loc('Surah Al-Kawthar', 'Surat Al-Kautsar', 'سورة الكوثر'),
  loc('Short surah (108)', 'Surat pendek (108)', 'سورة قصيرة (١٠٨)'),
  'sparkles',
  [
    basmalah(),
    phrase(
      [
        ['إِنَّا', 'innā', 'indeed We', 'sesungguhnya Kami', 'إنا'],
        ['أَعْطَيْنَاكَ', 'a‘ṭaynāka', 'have given you', 'telah memberimu', 'منحناك'],
        ['الْكَوْثَرَ', 'al-kawthara', 'abundant good', 'nikmat yang banyak', 'الخير الكثير'],
      ],
      'Indeed, We have given you abundant good',
      'Sungguh, Kami telah memberimu nikmat yang banyak',
      'إنا منحناك الخير الكثير',
    ),
    phrase(
      [
        ['فَصَلِّ', 'faṣalli', 'so pray', 'maka shalatlah', 'فأدِّ الصلاة'],
        ['لِرَبِّكَ', 'li-rabbika', 'to your Lord', 'karena Tuhanmu', 'لربك'],
        ['وَانْحَرْ', 'wanḥar', 'and sacrifice', 'dan berkurbanlah', 'وانحر الأضحية'],
      ],
      'So pray to your Lord and sacrifice',
      'Maka shalatlah karena Tuhanmu dan berkurbanlah',
      'فصل لربك وانحر الأضحية له',
    ),
    phrase(
      [
        ['إِنَّ', 'inna', 'indeed', 'sesungguhnya', 'إن'],
        ['شَانِئَكَ', 'shāni’aka', 'the one who hates you', 'orang yang membencimu', 'مبغضك'],
        ['هُوَ', 'huwa', 'he', 'dialah', 'هو'],
        ['الْأَبْتَرُ', 'al-abtaru', 'the one cut off', 'yang terputus', 'المنقطع الذكر'],
      ],
      'Indeed, the one who hates you is the one cut off',
      'Sungguh, orang yang membencimu dialah yang terputus',
      'إن مبغضك هو المنقطع الذكر',
    ),
  ],
);

const ashr = segment(
  'surah-al-ashr',
  loc('Surah Al-Asr', 'Surat Al-Ashr', 'سورة العصر'),
  loc('Short surah (103)', 'Surat pendek (103)', 'سورة قصيرة (١٠٣)'),
  'sparkles',
  [
    basmalah(),
    phrase(
      [['وَالْعَصْرِ', 'wal-‘aṣri', 'By time', 'Demi masa', 'أقسم بالزمان']],
      'By time',
      'Demi masa',
      'أقسم بالزمان',
    ),
    phrase(
      [
        ['إِنَّ', 'inna', 'indeed', 'sesungguhnya', 'إن'],
        ['الْإِنْسَانَ', 'al-insāna', 'mankind', 'manusia', 'بني آدم'],
        ['لَفِي', 'lafī', 'is surely in', 'benar-benar berada dalam', 'لفي'],
        ['خُسْرٍ', 'khusrin', 'loss', 'kerugian', 'خسارة'],
      ],
      'Indeed, mankind is in loss',
      'Sungguh, manusia benar-benar berada dalam kerugian',
      'إن الإنسان لفي خسارة',
    ),
    phrase(
      [
        ['إِلَّا', 'illā', 'except', 'kecuali', 'إلا'],
        ['الَّذِينَ', 'alladhīna', 'those who', 'orang-orang yang', 'الذين'],
        ['آمَنُوا', 'āmanū', 'believe', 'beriman', 'صدقوا'],
        ['وَعَمِلُوا', 'wa ‘amilū', 'and do', 'dan mengerjakan', 'وفعلوا'],
        ['الصَّالِحَاتِ', 'aṣ-ṣāliḥāti', 'righteous deeds', 'kebajikan', 'الأعمال الطيبة'],
      ],
      'Except those who believe and do righteous deeds',
      'Kecuali orang-orang yang beriman dan mengerjakan kebajikan',
      'إلا الذين صدقوا وفعلوا الأعمال الطيبة',
    ),
    phrase(
      [
        ['وَتَوَاصَوْا', 'wa tawāṣaw', 'and advise each other', 'dan saling menasihati', 'وأوصى بعضهم بعضًا'],
        ['بِالْحَقِّ', 'bil-ḥaqqi', 'to truth', 'untuk kebenaran', 'بالصدق'],
        ['وَتَوَاصَوْا', 'wa tawāṣaw', 'and advise each other', 'dan saling menasihati', 'وأوصى بعضهم بعضًا'],
        ['بِالصَّبْرِ', 'biṣ-ṣabri', 'to patience', 'untuk kesabaran', 'بالثبات'],
      ],
      'And advise each other to truth, and advise each other to patience',
      'Serta saling menasihati untuk kebenaran dan saling menasihati untuk kesabaran',
      'وأوصى بعضهم بعضًا بالحق وأوصى بعضهم بعضًا بالصبر',
    ),
  ],
);

const SUBHANA: W = ['سُبْحَانَ', 'subḥāna', 'Glory be to', 'Maha Suci', 'تنزيه وتعظيم'];
const RABBI_Y: W = ['رَبِّيَ', 'rabbiya', 'my Lord', 'Tuhanku', 'مالكي ومربيّ'];
const BIHAMDIH: W = ['وَبِحَمْدِهِ', 'wa biḥamdihi', 'and with His praise', 'dan dengan memuji-Nya', 'وأحمده'];

const rukuk = segment(
  'rukuk',
  loc('Ruku’', 'Rukuk', 'الركوع'),
  loc('Bowing prayer', 'Bacaan rukuk', 'ذكر الركوع'),
  'chevrons-down',
  [
    phrase(
      [SUBHANA, RABBI_Y, ['الْعَظِيمِ', 'al-‘aẓīmi', 'the Most Great', 'Yang Maha Agung', 'ذي العظمة'], BIHAMDIH],
      'Glory be to my Lord, the Most Great, and with His praise',
      'Maha Suci Tuhanku Yang Maha Agung dan dengan memuji-Nya',
      'أنزّه ربي العظيم وأحمده',
    ),
  ],
);

const itidal = segment(
  'itidal',
  loc('I’tidal', 'I’tidal', 'الاعتدال'),
  loc('Rising from ruku’', 'Bangun dari rukuk', 'الرفع من الركوع'),
  'move-up',
  [
    phrase(
      [
        ['سَمِعَ', 'sami‘a', 'hears', 'mendengar', 'استجاب'],
        ALLAH,
        ['لِمَنْ', 'liman', 'the one who', 'orang yang', 'لمن'],
        ['حَمِدَهُ', 'ḥamidahu', 'praises Him', 'memuji-Nya', 'أثنى عليه'],
      ],
      'Allah hears the one who praises Him',
      'Allah mendengar orang yang memuji-Nya',
      'استجاب الله لمن أثنى عليه',
    ),
    phrase(
      [
        ['رَبَّنَا', 'rabbanā', 'our Lord', 'wahai Tuhan kami', 'يا ربنا'],
        ['لَكَ', 'laka', 'to You', 'bagi-Mu', 'لك'],
        ['الْحَمْدُ', 'al-ḥamdu', 'is all praise', 'segala puji', 'الثناء الكامل'],
      ],
      'Our Lord, to You is all praise',
      'Wahai Tuhan kami, bagi-Mu segala puji',
      'يا ربنا، لك الثناء الكامل',
    ),
    phrase(
      [
        ['مِلْءُ', 'mil’u', 'the fill of', 'sepenuh', 'ما يملأ'],
        ['السَّمَاوَاتِ', 'as-samāwāti', 'the heavens', 'langit', 'السماوات'],
        ['وَمِلْءُ', 'wa mil’u', 'and the fill of', 'dan sepenuh', 'وما يملأ'],
        ['الْأَرْضِ', 'al-arḍi', 'the earth', 'bumi', 'الأرض'],
      ],
      'Filling the heavens and filling the earth',
      'Sepenuh langit dan sepenuh bumi',
      'ما يملأ السماوات وما يملأ الأرض',
    ),
    phrase(
      [
        ['وَمِلْءُ', 'wa mil’u', 'and the fill of', 'dan sepenuh', 'وما يملأ'],
        ['مَا', 'mā', 'whatever', 'apa pun', 'ما'],
        ['شِئْتَ', 'shi’ta', 'You will', 'yang Engkau kehendaki', 'أردت'],
        ['مِنْ', 'min', 'of', 'dari', 'من'],
        ['شَيْءٍ', 'shay’in', 'anything', 'sesuatu', 'شيء'],
        ['بَعْدُ', 'ba‘du', 'afterwards', 'setelah itu', 'بعد ذلك'],
      ],
      'And filling whatever You will beyond that',
      'Dan sepenuh apa pun yang Engkau kehendaki setelah itu',
      'وما يملأ ما شئت من شيء بعد ذلك',
    ),
  ],
);

const sujud = segment(
  'sujud',
  loc('Sujud', 'Sujud', 'السجود'),
  loc('Prostration prayer', 'Bacaan sujud', 'ذكر السجود'),
  'chevrons-down-up',
  [
    phrase(
      [SUBHANA, RABBI_Y, ['الْأَعْلَىٰ', 'al-a‘lā', 'the Most High', 'Yang Maha Tinggi', 'العلي الأعلى'], BIHAMDIH],
      'Glory be to my Lord, the Most High, and with His praise',
      'Maha Suci Tuhanku Yang Maha Tinggi dan dengan memuji-Nya',
      'أنزّه ربي الأعلى وأحمده',
    ),
  ],
);

const duduk = segment(
  'duduk-antara-dua-sujud',
  loc('Sitting Between Sujud', 'Duduk di Antara Dua Sujud', 'الجلوس بين السجدتين'),
  loc('Supplication between prostrations', 'Doa di antara dua sujud', 'الدعاء بين السجدتين'),
  'armchair',
  [
    phrase(
      [
        ['رَبِّ', 'rabbi', 'my Lord', 'Tuhanku', 'يا ربي'],
        ['اغْفِرْ', 'ighfir', 'forgive', 'ampunilah', 'استر الذنب'],
        ['لِي', 'lī', 'me', 'aku', 'لي'],
        ['وَارْحَمْنِي', 'warḥamnī', 'and have mercy on me', 'dan rahmatilah aku', 'وتفضل عليّ برحمتك'],
        ['وَاجْبُرْنِي', 'wajburnī', 'and mend my shortcomings', 'dan cukupkanlah kekuranganku', 'وأصلح نقصي'],
      ],
      'My Lord, forgive me, have mercy on me, and mend my shortcomings',
      'Ya Tuhanku, ampunilah aku, rahmatilah aku dan cukupkanlah kekuranganku',
      'يا رب اغفر لي وارحمني وأصلح نقصي',
    ),
    phrase(
      [
        ['وَارْفَعْنِي', 'warfa‘nī', 'raise my rank', 'angkatlah derajatku', 'وارفع منزلتي'],
        ['وَارْزُقْنِي', 'warzuqnī', 'and provide for me', 'berilah aku rezeki', 'وأعطني رزقًا'],
        ['وَاهْدِنِي', 'wahdinī', 'and guide me', 'berilah aku petunjuk', 'ودلني على الخير'],
      ],
      'Raise my rank, provide for me, and guide me',
      'Angkatlah derajatku, berilah aku rezeki dan petunjuk',
      'وارفع منزلتي وارزقني ودلني على الخير',
    ),
    phrase(
      [
        ['وَعَافِنِي', 'wa ‘āfinī', 'and grant me well-being', 'berilah aku kesehatan', 'وأعطني العافية'],
        ['وَاعْفُ', 'wa‘fu', 'and pardon', 'dan maafkanlah', 'وتجاوز'],
        ['عَنِّي', '‘annī', 'me', 'aku', 'عني'],
      ],
      'Grant me well-being and pardon me',
      'Berilah aku kesehatan dan maafkanlah aku',
      'وأعطني العافية وتجاوز عني',
    ),
  ],
);

const TAHIYYAT: Phrase[] = [
  phrase(
    [
      ['التَّحِيَّاتُ', 'at-taḥiyyātu', 'all greetings', 'segala penghormatan', 'التعظيم والتبجيل'],
      ['الْمُبَارَكَاتُ', 'al-mubārakātu', 'blessings', 'keberkahan', 'الخيرات النامية'],
      ['الصَّلَوَاتُ', 'aṣ-ṣalawātu', 'prayers', 'shalawat', 'الصلوات'],
      ['الطَّيِّبَاتُ', 'aṭ-ṭayyibātu', 'good words', 'kebaikan', 'الكلمات الطيبة'],
      ['لِلّٰهِ', 'lillāhi', 'are for Allah', 'adalah milik Allah', 'كلها لله'],
    ],
    'All greetings, blessings, prayers and good words are for Allah',
    'Segala penghormatan, keberkahan, shalawat dan kebaikan adalah milik Allah',
    'التعظيم والخيرات والصلوات والكلمات الطيبة كلها لله',
  ),
  phrase(
    [
      ['السَّلَامُ', 'as-salāmu', 'peace', 'keselamatan', 'السلامة'],
      ['عَلَيْكَ', '‘alayka', 'be upon you', 'atasmu', 'عليك'],
      ['أَيُّهَا', 'ayyuhā', 'O', 'wahai', 'يا'],
      ['النَّبِيُّ', 'an-nabiyyu', 'Prophet', 'Nabi', 'رسول الله'],
      ['وَرَحْمَةُ', 'wa raḥmatu', 'and the mercy of', 'dan rahmat', 'ورحمة'],
      ALLAH_GEN,
      ['وَبَرَكَاتُهُ', 'wa barakātuhu', 'and His blessings', 'dan berkah-Nya', 'وخيراته'],
    ],
    'Peace be upon you, O Prophet, and the mercy of Allah and His blessings',
    'Semoga keselamatan tercurah atasmu wahai Nabi, juga rahmat Allah dan berkah-Nya',
    'السلامة عليك يا رسول الله، ورحمة الله وخيراته',
  ),
  phrase(
    [
      ['السَّلَامُ', 'as-salāmu', 'peace', 'keselamatan', 'السلامة'],
      ['عَلَيْنَا', '‘alaynā', 'be upon us', 'atas kami', 'علينا'],
      ['وَعَلَىٰ', 'wa ‘alā', 'and upon', 'dan atas', 'وعلى'],
      ['عِبَادِ', '‘ibādi', 'the servants of', 'hamba-hamba', 'خلق'],
      ALLAH_GEN,
      ['الصَّالِحِينَ', 'aṣ-ṣāliḥīna', 'the righteous', 'yang saleh', 'الأتقياء'],
    ],
    'Peace be upon us and upon the righteous servants of Allah',
    'Semoga keselamatan tercurah atas kami dan atas hamba-hamba Allah yang saleh',
    'السلامة علينا وعلى عباد الله الأتقياء',
  ),
  phrase(
    [
      ['أَشْهَدُ', 'ashhadu', 'I bear witness', 'aku bersaksi', 'أقرّ وأعلن'],
      ['أَنْ', 'an', 'that', 'bahwa', 'أن'],
      ['لَا', 'lā', 'there is no', 'tidak ada', 'لا'],
      ['إِلٰهَ', 'ilāha', 'god', 'tuhan', 'معبود بحق'],
      ['إِلَّا', 'illā', 'except', 'selain', 'إلا'],
      ALLAH,
    ],
    'I bear witness that there is no god but Allah',
    'Aku bersaksi bahwa tiada tuhan selain Allah',
    'أقر وأعلن أنه لا معبود بحق إلا الله',
  ),
  phrase(
    [
      ['وَأَشْهَدُ', 'wa ashhadu', 'and I bear witness', 'dan aku bersaksi', 'وأقر وأعلن'],
      ['أَنَّ', 'anna', 'that', 'bahwa', 'أن'],
      ['مُحَمَّدًا', 'muḥammadan', 'Muhammad', 'Muhammad', 'نبينا محمد'],
      ['رَسُولُ', 'rasūlu', 'is the Messenger of', 'adalah utusan', 'مرسل من'],
      ALLAH_GEN,
    ],
    'And I bear witness that Muhammad is the Messenger of Allah',
    'Dan aku bersaksi bahwa Muhammad adalah utusan Allah',
    'وأقر وأعلن أن محمدًا مرسل من الله',
  ),
];

const MUHAMMAD: W = ['مُحَمَّدٍ', 'muḥammadin', 'Muhammad', 'Muhammad', 'نبينا محمد'];
const ALI_MUHAMMAD: W[] = [
  ['وَعَلَىٰ', 'wa ‘alā', 'and upon', 'dan atas', 'وعلى'],
  ['آلِ', 'āli', 'the family of', 'keluarga', 'أهل بيت'],
  MUHAMMAD,
];
const IBRAHIM: W = ['إِبْرَاهِيمَ', 'ibrāhīma', 'Ibrahim', 'Ibrahim', 'نبي الله إبراهيم'];
const ALI_IBRAHIM: W[] = [
  ['وَعَلَىٰ', 'wa ‘alā', 'and upon', 'dan atas', 'وعلى'],
  ['آلِ', 'āli', 'the family of', 'keluarga', 'أهل بيت'],
  IBRAHIM,
];

const SALAWAT: Phrase[] = [
  phrase(
    [
      ['اللّٰهُمَّ', 'allāhumma', 'O Allah', 'Ya Allah', 'يا الله'],
      ['صَلِّ', 'ṣalli', 'send prayers', 'limpahkanlah shalawat', 'أثنِ ثناءً حسنًا'],
      ['عَلَىٰ', '‘alā', 'upon', 'atas', 'على'],
      MUHAMMAD,
      ...ALI_MUHAMMAD,
    ],
    'O Allah, send prayers upon Muhammad and upon the family of Muhammad',
    'Ya Allah, limpahkanlah shalawat atas Muhammad dan atas keluarga Muhammad',
    'اللهم أثنِ على محمد وعلى آل محمد',
  ),
  phrase(
    [
      ['كَمَا', 'kamā', 'as', 'sebagaimana', 'مثلما'],
      ['صَلَّيْتَ', 'ṣallayta', 'You sent prayers', 'Engkau telah melimpahkan shalawat', 'أثنيت'],
      ['عَلَىٰ', '‘alā', 'upon', 'atas', 'على'],
      IBRAHIM,
      ...ALI_IBRAHIM,
    ],
    'As You sent prayers upon Ibrahim and upon the family of Ibrahim',
    'Sebagaimana Engkau telah melimpahkan shalawat atas Ibrahim dan keluarga Ibrahim',
    'مثلما أثنيت على إبراهيم وعلى آل إبراهيم',
  ),
  phrase(
    [
      ['وَبَارِكْ', 'wa bārik', 'and bless', 'dan berkahilah', 'وأنزل البركة'],
      ['عَلَىٰ', '‘alā', 'upon', 'atas', 'على'],
      MUHAMMAD,
      ...ALI_MUHAMMAD,
    ],
    'And bless Muhammad and the family of Muhammad',
    'Dan berkahilah Muhammad dan keluarga Muhammad',
    'وأنزل البركة على محمد وعلى آل محمد',
  ),
  phrase(
    [
      ['كَمَا', 'kamā', 'as', 'sebagaimana', 'مثلما'],
      ['بَارَكْتَ', 'bārakta', 'You blessed', 'Engkau telah memberkahi', 'أنزلت البركة'],
      ['عَلَىٰ', '‘alā', 'upon', 'atas', 'على'],
      IBRAHIM,
      ...ALI_IBRAHIM,
    ],
    'As You blessed Ibrahim and the family of Ibrahim',
    'Sebagaimana Engkau telah memberkahi Ibrahim dan keluarga Ibrahim',
    'مثلما أنزلت البركة على إبراهيم وعلى آل إبراهيم',
  ),
  phrase(
    [
      ['فِي', 'fī', 'in', 'di', 'في'],
      ['الْعَالَمِينَ', 'al-‘ālamīna', 'the worlds', 'seluruh alam', 'جميع الخلق'],
      ['إِنَّكَ', 'innaka', 'indeed You', 'sesungguhnya Engkau', 'إنك'],
      ['حَمِيدٌ', 'ḥamīdun', 'are Praiseworthy', 'Maha Terpuji', 'المستحق للحمد'],
      ['مَجِيدٌ', 'majīdun', 'Glorious', 'Maha Mulia', 'ذو المجد والعظمة'],
    ],
    'Throughout the worlds. Indeed You are Praiseworthy and Glorious',
    'Di seluruh alam. Sesungguhnya Engkau Maha Terpuji lagi Maha Mulia',
    'في جميع الخلق، إنك المستحق للحمد ذو المجد والعظمة',
  ),
];

const tasyahudAwal = segment(
  'tasyahud-awal',
  loc('First Tashahhud', 'Tasyahud Awal', 'التشهد الأول'),
  loc('Sitting after the second unit', 'Duduk setelah rakaat kedua', 'الجلوس بعد الركعة الثانية'),
  'users',
  TAHIYYAT,
);

const tasyahudAkhir = segment(
  'tasyahud-akhir',
  loc('Final Tashahhud', 'Tasyahud Akhir', 'التشهد الأخير'),
  loc('With salawat upon the Prophet', 'Beserta shalawat atas Nabi', 'مع الصلاة على النبي'),
  'users-round',
  [...TAHIYYAT, ...SALAWAT],
);

const doaSalam = segment(
  'doa-sebelum-salam',
  loc('Supplication Before Salam', 'Doa Sebelum Salam', 'الدعاء قبل السلام'),
  loc('Seeking refuge in Allah', 'Memohon perlindungan kepada Allah', 'الاستعاذة بالله'),
  'shield',
  [
    phrase(
      [
        ['اللّٰهُمَّ', 'allāhumma', 'O Allah', 'Ya Allah', 'يا الله'],
        ['إِنِّي', 'innī', 'indeed I', 'sesungguhnya aku', 'إنني'],
        ['أَعُوذُ', 'a‘ūdhu', 'seek refuge', 'berlindung', 'ألتجئ'],
        ['بِكَ', 'bika', 'in You', 'kepada-Mu', 'بك'],
        ['مِنْ', 'min', 'from', 'dari', 'من'],
        ['عَذَابِ', '‘adhābi', 'the punishment of', 'azab', 'عقوبة'],
        ['جَهَنَّمَ', 'jahannama', 'Hell', 'neraka Jahanam', 'النار'],
      ],
      'O Allah, I seek refuge in You from the punishment of Hell',
      'Ya Allah, aku berlindung kepada-Mu dari azab neraka Jahanam',
      'اللهم إني ألتجئ بك من عقوبة النار',
    ),
    phrase(
      [
        ['وَمِنْ', 'wa min', 'and from', 'dan dari', 'ومن'],
        ['عَذَابِ', '‘adhābi', 'the punishment of', 'azab', 'عقوبة'],
        ['الْقَبْرِ', 'al-qabri', 'the grave', 'kubur', 'القبر'],
      ],
      'And from the punishment of the grave',
      'Dan dari azab kubur',
      'ومن عقوبة القبر',
    ),
    phrase(
      [
        ['وَمِنْ', 'wa min', 'and from', 'dan dari', 'ومن'],
        ['فِتْنَةِ', 'fitnati', 'the trials of', 'fitnah', 'ابتلاءات'],
        ['الْمَحْيَا', 'al-maḥyā', 'life', 'kehidupan', 'الحياة'],
        ['وَالْمَمَاتِ', 'wal-mamāti', 'and death', 'dan kematian', 'والموت'],
      ],
      'And from the trials of life and death',
      'Dan dari fitnah kehidupan dan kematian',
      'ومن ابتلاءات الحياة والموت',
    ),
    phrase(
      [
        ['وَمِنْ', 'wa min', 'and from', 'dan dari', 'ومن'],
        ['شَرِّ', 'sharri', 'the evil of', 'kejahatan', 'أذى'],
        ['فِتْنَةِ', 'fitnati', 'the trial of', 'fitnah', 'ابتلاء'],
        ['الْمَسِيحِ', 'al-masīḥi', 'the Messiah', 'Almasih', 'المسيح'],
        ['الدَّجَّالِ', 'ad-dajjāli', 'the Impostor', 'Dajjal', 'الكذاب'],
      ],
      'And from the evil of the trial of the False Messiah',
      'Dan dari kejahatan fitnah Almasih Dajjal',
      'ومن أذى ابتلاء المسيح الكذاب',
    ),
  ],
);

const salam = segment(
  'salam',
  loc('Salam', 'Salam', 'السلام'),
  loc('Ending the prayer', 'Penutup shalat', 'خاتمة الصلاة'),
  'check',
  [
    phrase(
      [
        ['السَّلَامُ', 'as-salāmu', 'peace', 'keselamatan', 'السلامة'],
        ['عَلَيْكُمْ', '‘alaykum', 'be upon you', 'atas kalian', 'عليكم'],
        ['وَرَحْمَةُ', 'wa raḥmatu', 'and the mercy of', 'dan rahmat', 'ورحمة'],
        ALLAH_GEN,
      ],
      'Peace be upon you and the mercy of Allah',
      'Semoga keselamatan dan rahmat Allah tercurah atas kalian',
      'السلامة عليكم ورحمة الله',
    ),
  ],
);

const qunut = segment(
  'doa-qunut',
  loc('Qunut (Fajr)', 'Doa Qunut (Subuh)', 'دعاء القنوت (الفجر)'),
  loc(
    'Recited in the second unit of Fajr (Shafi’i practice)',
    'Dibaca pada rakaat kedua Subuh (mazhab Syafi’i)',
    'يُقرأ في الركعة الثانية من الفجر (المذهب الشافعي)',
  ),
  'hand-heart',
  [
    phrase(
      [
        ['اللّٰهُمَّ', 'allāhumma', 'O Allah', 'Ya Allah', 'يا الله'],
        ['اهْدِنِي', 'ihdinī', 'guide me', 'tunjukilah aku', 'دلني'],
        ['فِيمَنْ', 'fīman', 'among those', 'bersama orang-orang', 'مع من'],
        ['هَدَيْتَ', 'hadayta', 'You have guided', 'yang Engkau beri petunjuk', 'وفقتهم'],
      ],
      'O Allah, guide me among those You have guided',
      'Ya Allah, tunjukilah aku bersama orang-orang yang telah Engkau beri petunjuk',
      'اللهم دلني مع من وفقتهم للهداية',
    ),
    phrase(
      [
        ['وَعَافِنِي', 'wa ‘āfinī', 'and grant me well-being', 'dan berilah aku kesehatan', 'وأعطني العافية'],
        ['فِيمَنْ', 'fīman', 'among those', 'bersama orang-orang', 'مع من'],
        ['عَافَيْتَ', '‘āfayta', 'You have granted well-being', 'yang Engkau beri kesehatan', 'عافيتهم'],
      ],
      'And grant me well-being among those You have granted well-being',
      'Dan berilah aku kesehatan bersama orang-orang yang telah Engkau beri kesehatan',
      'وأعطني العافية مع من عافيتهم',
    ),
    phrase(
      [
        ['وَتَوَلَّنِي', 'wa tawallanī', 'and take me into Your care', 'dan pimpinlah aku', 'وتولَّ أمري'],
        ['فِيمَنْ', 'fīman', 'among those', 'bersama orang-orang', 'مع من'],
        ['تَوَلَّيْتَ', 'tawallayta', 'You have taken into Your care', 'yang Engkau pimpin', 'توليتهم'],
      ],
      'And take me into Your care among those You have taken into Your care',
      'Dan pimpinlah aku bersama orang-orang yang telah Engkau pimpin',
      'وتولَّ أمري مع من توليتهم',
    ),
    phrase(
      [
        ['وَبَارِكْ', 'wa bārik', 'and bless', 'dan berkahilah', 'وأنزل البركة'],
        ['لِي', 'lī', 'for me', 'untukku', 'لي'],
        ['فِيمَا', 'fīmā', 'in what', 'pada apa yang', 'فيما'],
        ['أَعْطَيْتَ', 'a‘ṭayta', 'You have given', 'telah Engkau berikan', 'منحتني'],
      ],
      'And bless for me what You have given',
      'Dan berkahilah untukku apa yang telah Engkau berikan',
      'وأنزل البركة فيما منحتني',
    ),
    phrase(
      [
        ['وَقِنِي', 'wa qinī', 'and protect me', 'dan lindungilah aku', 'واحفظني'],
        ['شَرَّ', 'sharra', 'from the evil of', 'dari kejahatan', 'من أذى'],
        ['مَا', 'mā', 'what', 'apa yang', 'ما'],
        ['قَضَيْتَ', 'qaḍayta', 'You have decreed', 'telah Engkau tetapkan', 'قدّرت'],
      ],
      'And protect me from the evil of what You have decreed',
      'Dan lindungilah aku dari kejahatan apa yang telah Engkau tetapkan',
      'واحفظني من أذى ما قدّرت',
    ),
    phrase(
      [
        ['فَإِنَّكَ', 'fa innaka', 'for indeed You', 'maka sesungguhnya Engkau', 'فإنك'],
        ['تَقْضِي', 'taqḍī', 'decree', 'menetapkan', 'تحكم'],
        ['وَلَا', 'wa lā', 'and none', 'dan tidak ada yang', 'ولا'],
        ['يُقْضَىٰ', 'yuqḍā', 'decrees', 'menetapkan', 'يحكم'],
        ['عَلَيْكَ', '‘alayka', 'over You', 'atas-Mu', 'عليك'],
      ],
      'For You decree, and none can decree over You',
      'Sesungguhnya Engkaulah yang menetapkan dan tidak ada yang menetapkan atas-Mu',
      'فإنك تحكم ولا يحكم عليك أحد',
    ),
    phrase(
      [
        ['وَإِنَّهُ', 'wa innahu', 'and indeed', 'dan sesungguhnya', 'وإنه'],
        ['لَا', 'lā', 'not', 'tidak', 'لا'],
        ['يَذِلُّ', 'yadhillu', 'is humbled', 'akan hina', 'يُهان'],
        ['مَنْ', 'man', 'whom', 'orang yang', 'من'],
        ['وَالَيْتَ', 'wālayta', 'You have befriended', 'Engkau bela', 'نصرته'],
        ['وَلَا', 'wa lā', 'and not', 'dan tidak', 'ولا'],
        ['يَعِزُّ', 'ya‘izzu', 'is honored', 'akan mulia', 'يكرم'],
        ['مَنْ', 'man', 'whom', 'orang yang', 'من'],
        ['عَادَيْتَ', '‘ādayta', 'You have opposed', 'Engkau musuhi', 'خاصمته'],
      ],
      'Indeed, he whom You befriend is never humbled, and he whom You oppose is never honored',
      'Sesungguhnya tidak akan hina orang yang Engkau bela dan tidak akan mulia orang yang Engkau musuhi',
      'إنه لا يُهان من نصرته ولا يُكرم من خاصمته',
    ),
    phrase(
      [
        ['تَبَارَكْتَ', 'tabārakta', 'blessed are You', 'Maha Suci Engkau', 'تعاظمت بركتك'],
        ['رَبَّنَا', 'rabbanā', 'our Lord', 'wahai Tuhan kami', 'يا ربنا'],
        ['وَتَعَالَيْتَ', 'wa ta‘ālayta', 'and exalted', 'dan Maha Tinggi', 'وارتفعت'],
      ],
      'Blessed are You, our Lord, and exalted',
      'Maha Suci Engkau wahai Tuhan kami dan Maha Tinggi',
      'تعاظمت بركتك يا ربنا وارتفعت',
    ),
    phrase(
      [
        ['فَلَكَ', 'falaka', 'so to You', 'maka bagi-Mu', 'فلك'],
        ['الْحَمْدُ', 'al-ḥamdu', 'is all praise', 'segala puji', 'الثناء'],
        ['عَلَىٰ', '‘alā', 'for', 'atas', 'على'],
        ['مَا', 'mā', 'what', 'apa yang', 'ما'],
        ['قَضَيْتَ', 'qaḍayta', 'You have decreed', 'telah Engkau tetapkan', 'قدّرت'],
      ],
      'So to You is all praise for what You have decreed',
      'Maka bagi-Mu segala puji atas apa yang telah Engkau tetapkan',
      'فلك الثناء على ما قدّرت',
    ),
    phrase(
      [
        ['أَسْتَغْفِرُكَ', 'astaghfiruka', 'I seek Your forgiveness', 'aku memohon ampun kepada-Mu', 'أطلب مغفرتك'],
        ['وَأَتُوبُ', 'wa atūbu', 'and I repent', 'dan aku bertobat', 'وأرجع'],
        ['إِلَيْكَ', 'ilayka', 'to You', 'kepada-Mu', 'إليك'],
      ],
      'I seek Your forgiveness and repent to You',
      'Aku memohon ampun kepada-Mu dan bertobat kepada-Mu',
      'أطلب مغفرتك وأرجع إليك',
    ),
    phrase(
      [
        ['وَصَلَّى', 'wa ṣallā', 'and may blessings be upon', 'semoga shalawat tercurah', 'وأثنى'],
        ALLAH,
        ['عَلَىٰ', '‘alā', 'upon', 'atas', 'على'],
        ['سَيِّدِنَا', 'sayyidinā', 'our master', 'junjungan kami', 'سيدنا'],
        MUHAMMAD,
        ['النَّبِيِّ', 'an-nabiyyi', 'the Prophet', 'Nabi', 'النبي'],
        ['الْأُمِّيِّ', 'al-ummiyyi', 'the unlettered', 'yang ummi', 'الذي لا يقرأ ولا يكتب'],
        ['وَعَلَىٰ', 'wa ‘alā', 'and upon', 'dan atas', 'وعلى'],
        ['آلِهِ', 'ālihi', 'his family', 'keluarganya', 'أهله'],
        ['وَصَحْبِهِ', 'wa ṣaḥbihi', 'and his companions', 'dan sahabatnya', 'وأصحابه'],
        ['وَسَلَّمَ', 'wa sallama', 'and grant peace', 'dan salam sejahtera', 'وسلّم'],
      ],
      'May Allah send blessings upon our master Muhammad, the unlettered Prophet, and upon his family and companions, and grant them peace',
      'Semoga Allah melimpahkan shalawat atas junjungan kami Nabi Muhammad, Nabi yang ummi, beserta keluarga dan sahabatnya, dan salam sejahtera',
      'وأثنى الله على سيدنا محمد النبي الذي لا يقرأ ولا يكتب، وعلى أهله وأصحابه وسلّم',
    ),
  ],
);

export const prayerSegments: Segment[] = [
  ...niatSegments,
  takbir,
  iftitah,
  fatihah,
  ikhlas,
  kautsar,
  ashr,
  rukuk,
  itidal,
  sujud,
  duduk,
  tasyahudAwal,
  tasyahudAkhir,
  doaSalam,
  salam,
  qunut,
];

export const PRAYER_DECK_ID = 'deck-prayer-recitation';

export const prayerDeck: DeckSeed = {
  id: PRAYER_DECK_ID,
  title: loc('Prayer Recitation', 'Bacaan Shalat', 'أذكار الصلاة'),
  description: loc(
    'Every recitation of the five obligatory prayers',
    'Seluruh bacaan shalat fardhu lima waktu',
    'جميع أذكار الصلوات الخمس المفروضة',
  ),
  icon: 'book-open',
  segments: prayerSegments,
};
