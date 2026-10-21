import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { TimerDisplayProps } from '../types';

export const TimerDisplay: React.FC<TimerDisplayProps> = ({ secondsLeft, accessibilityLabel }) => {
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return <Text style={styles.time} accessibilityLabel={accessibilityLabel}>{formattedTime}</Text>;
};

const styles = StyleSheet.create({
  time: {
    fontSize: 64,
    fontVariant: ['tabular-nums'],
    fontWeight: 'bold',
    color: '#333',
    letterSpacing: 2,
  },
});
