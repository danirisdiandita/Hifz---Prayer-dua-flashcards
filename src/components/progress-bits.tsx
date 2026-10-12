import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { Colors } from '@/constants/tokens';

import { AppText } from './app-text';

export function Segments({
  total,
  active,
  tone = 'dark',
}: {
  total: number;
  active: number;
  tone?: 'dark' | 'light';
}) {
  return (
    <View style={styles.segments}>
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          style={[
            styles.segment,
            { backgroundColor: i < active ? (tone === 'dark' ? Colors.green : Colors.gold) : Colors.line },
          ]}
        />
      ))}
    </View>
  );
}

export function ProgressRing({ percent, size = 56 }: { percent: number; size?: number }) {
  const stroke = 4;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(244,239,228,0.2)" strokeWidth={stroke} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={Colors.gold}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${(circumference * clamped) / 100} ${circumference}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <AppText family="mono" size={13} color="cream">
        {clamped}%
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  segments: { flexDirection: 'row', gap: 6, flex: 1 },
  segment: { flex: 1, height: 3, borderRadius: 2 },
});
