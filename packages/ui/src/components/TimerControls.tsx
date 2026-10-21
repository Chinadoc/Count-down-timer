import React from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import { TimerControlsProps } from '../types';

export const TimerControls: React.FC<TimerControlsProps> = ({
  isRunning,
  onStartStop,
  onReset,
  startLabel = 'Start',
  stopLabel = 'Stop',
  resetLabel = 'Reset',
  startAccessibilityLabel,
  stopAccessibilityLabel,
  resetAccessibilityLabel,
}) => (
  <View style={styles.buttonContainer}>
    <Pressable
      onPress={onStartStop}
      accessibilityLabel={isRunning ? stopAccessibilityLabel : startAccessibilityLabel}
      style={[styles.button, isRunning ? styles.stopButton : styles.startButton]}
    >
      <Text style={styles.buttonText}>{isRunning ? stopLabel : startLabel}</Text>
    </Pressable>
    <Pressable onPress={onReset} accessibilityLabel={resetAccessibilityLabel} style={[styles.button, styles.resetButton]}>
      <Text style={styles.buttonText}>{resetLabel}</Text>
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  stopButton: {
    backgroundColor: '#f44336',
  },
  resetButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
