import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Platform } from 'react-native';
import { CountdownTimerController, CountdownState } from '@countdown-timer-app/core';

interface CountdownViewProps {
  initialSeconds?: number;
}

export const CountdownView: React.FC<CountdownViewProps> = ({ initialSeconds = 60 }) => {
  const [timerState, setTimerState] = useState<CountdownState>({
    remainingTime: initialSeconds,
    isRunning: false,
    isFinished: false,
  });
  const [displayTime, setDisplayTime] = useState<string>(formatTime(initialSeconds));
  const [inputSeconds, setInputSeconds] = useState<string>(initialSeconds.toString());

  const timerControllerRef = useRef<CountdownTimerController | null>(null);

  const handleTick = useCallback((newState: CountdownState) => {
    setTimerState(newState);
    setDisplayTime(formatTime(newState.remainingTime));
  }, []);

  const handleComplete = useCallback(() => {
    // Optionally: Alert.alert('Timer Finished!'); for native, console.log for web
    if (Platform.OS !== 'web') {
      // Alert.alert('Timer Finished!'); // Requires Alert import from react-native
    }
    console.log('Timer Finished!');
  }, []);

  useEffect(() => {
    const controller = new CountdownTimerController(initialSeconds, handleTick, handleComplete);
    timerControllerRef.current = controller;
    // Set initial display
    const initialState = controller.getCurrentState();
    setTimerState(initialState);
    setDisplayTime(formatTime(initialState.remainingTime));

    return () => {
      controller.stop(); // Cleanup on unmount
    };
  }, [initialSeconds, handleTick, handleComplete]);

  const handleStart = () => timerControllerRef.current?.start();
  const handleStop = () => timerControllerRef.current?.stop();
  const handleReset = () => {
    timerControllerRef.current?.reset(Number(inputSeconds) || initialSeconds);
  };
  const handleSetTime = () => {
    const newTime = Number(inputSeconds);
    if (!isNaN(newTime) && newTime > 0) {
      timerControllerRef.current?.setTime(newTime);
    } else {
      // Reset input to current timer's initial or remaining time if invalid
      setInputSeconds(timerControllerRef.current?.getCurrentState().remainingTime.toString() || initialSeconds.toString());
    }
  };

  function formatTime(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Countdown Timer</Text>
      <Text style={styles.timeDisplay}>{displayTime}</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputSeconds}
          onChangeText={setInputSeconds}
          keyboardType="numeric"
          placeholder="Set seconds"
        />
        <Pressable onPress={handleSetTime} style={[styles.button, styles.setButton]}>
          <Text style={styles.buttonText}>Set Time</Text>
        </Pressable>
      </View>

      <View style={styles.buttonRow}>
        {!timerState.isRunning ? (
          <Pressable onPress={handleStart} style={[styles.button, styles.startButton]} disabled={timerState.isFinished && timerState.remainingTime === 0}>
            <Text style={styles.buttonText}>Start</Text>
          </Pressable>
        ) : (
          <Pressable onPress={handleStop} style={[styles.button, styles.stopButton]}>
            <Text style={styles.buttonText}>Stop</Text>
          </Pressable>
        )}
        <Pressable onPress={handleReset} style={[styles.button, styles.resetButton]}>
          <Text style={styles.buttonText}>Reset</Text>
        </Pressable>
      </View>
      {timerState.isFinished && timerState.remainingTime === 0 && (
        <Text style={styles.finishedText}>Time's up!</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    width: Platform.OS === 'web' ? 350 : '90%', // Adjust width for web
    maxWidth: 400,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  timeDisplay: {
    fontSize: Platform.OS === 'web' ? 60 : 48, // Slightly larger on web
    fontWeight: 'bold',
    marginBottom: 20,
    fontVariant: ['tabular-nums'], // Ensures numbers don't shift width
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    width: '100%',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
    fontSize: 16,
    backgroundColor: 'white',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    minWidth: 100,
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  setButton: { backgroundColor: '#607D8B' /* Blue Grey */ },
  startButton: { backgroundColor: '#4CAF50' /* Green */ },
  stopButton: { backgroundColor: '#f44336' /* Red */ },
  resetButton: { backgroundColor: '#2196F3' /* Blue */ },
  finishedText: {
    marginTop: 15,
    fontSize: 18,
    color: '#d32f2f', // Or your theme's accent color for completion
    fontWeight: 'bold',
  },
});
