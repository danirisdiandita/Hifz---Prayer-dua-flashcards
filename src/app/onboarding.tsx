import { useEffect, useState } from 'react';
import { BackHandler, Pressable, StyleSheet, View } from 'react-native';

import { AppText, Eyebrow } from '@/components/app-text';
import { IconButton, PrimaryButton } from '@/components/buttons';
import { HeroCard } from '@/components/hero-card';
import { Icon } from '@/components/icon';
import { Segments } from '@/components/progress-bits';
import { Screen } from '@/components/screen';
import { Colors, Radius } from '@/constants/tokens';
import type { Language } from '@/content/types';
import { useCompleteOnboarding, useUpdateLanguage } from '@/hooks/use-settings';
import { useT } from '@/hooks/use-t';
import type { StringKey } from '@/i18n/strings';

const STEPS = 7;

type HeroStep = {
  eyebrow: StringKey;
  title: StringKey;
  body: StringKey;
  arabic: string;
  icon: string;
  cardTitle: StringKey;
  cardBody: StringKey;
  cta: StringKey;
};

const HERO_STEPS: Record<number, HeroStep> = {
  3: {
    eyebrow: 'onboardingMeaningEyebrow',
    title: 'onboardingMeaningTitle',
    body: 'onboardingMeaningBody',
    arabic: 'خُشُوع',
    icon: 'book-open',
    cardTitle: 'meaningCardTitle',
    cardBody: 'meaningCardBody',
    cta: 'iUnderstand',
  },
  4: {
    eyebrow: 'onboardingSmallEyebrow',
    title: 'onboardingSmallTitle',
    body: 'onboardingSmallBody',
    arabic: 'خُطْوَة',
    icon: 'layers',
    cardTitle: 'smallCardTitle',
    cardBody: 'smallCardBody',
    cta: 'continue',
  },
  5: {
    eyebrow: 'onboardingRepeatEyebrow',
    title: 'onboardingRepeatTitle',
    body: 'onboardingRepeatBody',
    arabic: 'تَكْرَار',
    icon: 'repeat',
    cardTitle: 'repeatCardTitle',
    cardBody: 'repeatCardBody',
    cta: 'continue',
  },
  6: {
    eyebrow: 'onboardingBeginEyebrow',
    title: 'onboardingBeginTitle',
    body: 'onboardingBeginBody',
    arabic: 'نِيَّة',
    icon: 'heart',
    cardTitle: 'beginCardTitle',
    cardBody: 'beginCardBody',
    cta: 'startJourney',
  },
};

const LANGUAGE_OPTIONS: { code: Language; badge: string; name: string; subtitle: StringKey }[] = [
  { code: 'id', badge: 'ID', name: 'Bahasa Indonesia', subtitle: 'languageIdSubtitle' },
  { code: 'en', badge: 'EN', name: 'English', subtitle: 'languageEnSubtitle' },
  { code: 'ar', badge: 'AR', name: 'العربية', subtitle: 'languageArSubtitle' },
];

function LanguageStep() {
  const { t, language } = useT();
  const setLanguage = useUpdateLanguage();
  return (
    <View style={styles.options}>
      {LANGUAGE_OPTIONS.map((option) => {
        const selected = option.code === language;
        return (
          <Pressable
            key={option.code}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            onPress={() => setLanguage(option.code)}
            style={[styles.option, selected && styles.optionSelected]}>
            <View style={[styles.badge, selected && styles.badgeSelected]}>
              <AppText family="mono" size={13} color={selected ? 'cream' : 'green'}>
                {option.badge}
              </AppText>
            </View>
            <View style={styles.optionCopy}>
              <AppText weight="semi" size={15} color={selected ? 'cream' : 'ink'}>
                {option.name}
              </AppText>
              <AppText size={12} color={selected ? 'greenSoft' : 'ink2'}>
                {t(option.subtitle)}
              </AppText>
            </View>
            <View style={[styles.radio, selected && styles.radioSelected]}>
              {selected ? <Icon name="check" size={14} color="gold" strokeWidth={3} /> : null}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

function PathStep() {
  const { t } = useT();
  const items: { n: string; title: StringKey; body: StringKey }[] = [
    { n: '01', title: 'pathFaith', body: 'pathFaithBody' },
    { n: '02', title: 'pathKhushu', body: 'pathKhushuBody' },
    { n: '03', title: 'pathVain', body: 'pathVainBody' },
  ];
  return (
    <View style={styles.pathList}>
      {items.map((item) => (
        <View key={item.n} style={styles.pathRow}>
          <AppText family="display" size={28} color="gold" style={styles.pathNumber}>
            {item.n}
          </AppText>
          <View style={styles.pathCopy}>
            <AppText weight="semi" size={17}>
              {t(item.title)}
            </AppText>
            <AppText size={13} color="ink2">
              {t(item.body)}
            </AppText>
          </View>
        </View>
      ))}
    </View>
  );
}

function PracticeStep() {
  const { t } = useT();
  const items: { icon: string; title: StringKey; body: StringKey }[] = [
    { icon: 'book-open', title: 'practiceRecitation', body: 'practiceRecitationBody' },
    { icon: 'repeat', title: 'practiceFlashcards', body: 'practiceFlashcardsBody' },
    { icon: 'star', title: 'practiceFirdaus', body: 'practiceFirdausBody' },
  ];
  return (
    <View style={styles.options}>
      {items.map((item) => (
        <View key={item.title} style={styles.feature}>
          <View style={styles.featureIcon}>
            <Icon name={item.icon} size={18} color="green" />
          </View>
          <View style={styles.optionCopy}>
            <AppText weight="semi" size={15}>
              {t(item.title)}
            </AppText>
            <AppText size={12} color="ink2">
              {t(item.body)}
            </AppText>
          </View>
        </View>
      ))}
    </View>
  );
}

export default function OnboardingScreen() {
  const [step, setStep] = useState(0);
  const { t, language } = useT();
  const complete = useCompleteOnboarding();

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (step === 0) return false;
      setStep((s) => s - 1);
      return true;
    });
    return () => sub.remove();
  }, [step]);

  const hero = HERO_STEPS[step];
  const last = step === STEPS - 1;

  const next = () => {
    if (last) {
      complete(language);
    } else {
      setStep(step + 1);
    }
  };

  const eyebrow: StringKey =
    hero?.eyebrow ??
    (['onboardingLanguageEyebrow', 'onboardingPathEyebrow', 'onboardingPracticeEyebrow'] as const)[step];
  const title: StringKey =
    hero?.title ??
    (['onboardingLanguageTitle', 'onboardingPathTitle', 'onboardingPracticeTitle'] as const)[step];
  const body: StringKey =
    hero?.body ??
    (['onboardingLanguageBody', 'onboardingPathBody', 'onboardingPracticeBody'] as const)[step];
  const cta: StringKey = hero?.cta ?? (step === 2 ? 'startJourney' : 'continue');

  return (
    <Screen
      footer={<PrimaryButton label={t(cta)} onPress={next} />}>
      <View style={styles.progressRow}>
        {step > 0 ? (
          <IconButton icon="arrow-left" label={t('back')} size={32} onPress={() => setStep(step - 1)} />
        ) : null}
        <Segments total={STEPS} active={step + 1} />
      </View>
      <View style={styles.header}>
        <Eyebrow>{t(eyebrow)}</Eyebrow>
        <AppText family="display" size={34} lineHeight={38}>
          {t(title)}
        </AppText>
        <AppText size={15} color="ink2" lineHeight={22}>
          {t(body)}
        </AppText>
      </View>
      {step === 0 ? <LanguageStep /> : null}
      {step === 1 ? <PathStep /> : null}
      {step === 2 ? <PracticeStep /> : null}
      {hero ? (
        <HeroCard
          arabic={hero.arabic}
          icon={hero.icon}
          title={t(hero.cardTitle)}
          body={t(hero.cardBody)}
        />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 4 },
  header: { gap: 12, paddingTop: 12 },
  options: { gap: 10, paddingTop: 8 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.line,
  },
  optionSelected: { backgroundColor: Colors.green, borderColor: Colors.green },
  badge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeSelected: { backgroundColor: Colors.green2 },
  optionCopy: { flex: 1, gap: 3 },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: { borderColor: Colors.gold },
  pathList: { gap: 22, paddingTop: 12 },
  pathRow: { flexDirection: 'row', gap: 16, alignItems: 'flex-start' },
  pathNumber: { width: 44, fontStyle: 'italic' },
  pathCopy: { flex: 1, gap: 4 },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: Radius.card - 6,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.line,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: Colors.greenSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
