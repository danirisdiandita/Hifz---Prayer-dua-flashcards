import { StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/tokens';

import { AppText } from './app-text';
import { Icon } from './icon';

type HeroCardProps = {
  arabic: string;
  icon: string;
  title: string;
  body: string;
};

export function HeroCard({ arabic, icon, title, body }: HeroCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.glow} />
      <View style={styles.header}>
        <AppText family="arabic" size={52} color="gold" lineHeight={84}>
          {arabic}
        </AppText>
        <View style={styles.badge}>
          <Icon name={icon} size={16} color="cream" />
        </View>
      </View>
      <AppText family="display" size={22} color="cream" lineHeight={28}>
        {title}
      </AppText>
      <AppText size={13} color="cream" lineHeight={20} style={styles.body}>
        {body}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.green,
    borderRadius: 28,
    padding: 24,
    gap: 10,
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    right: -50,
    bottom: -60,
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: Colors.green2,
    opacity: 0.55,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  badge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(244,239,228,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { opacity: 0.8 },
});
