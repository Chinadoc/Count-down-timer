import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { View, StyleSheet, Alert, Platform, Text, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { CountdownTimerController, CountdownState } from '@countdown-timer-app/core';
import { TimerDisplay } from './TimerDisplay';
import { TimerInput } from './TimerInput';
import { TimerControls } from './TimerControls';
import { TimerProps } from '../types';
import { GamificationContext } from '../contexts/GamificationContext';
import { AchievementUnlockedToast } from './achievements/AchievementUnlockedToast';
import { Achievement, Illustration } from '@countdown-timer-app/core/src/gamification';
import { NewIllustrationModal } from './illustrations/NewIllustrationModal';

// Conditionally import Audio from expo-av for non-web platforms
let Audio: any = null;
if (Platform.OS !== 'web') {
  import('expo-av')
    .then((module) => {
      Audio = module.Audio;
    })
    .catch((err) => {
      console.error('Failed to load expo-av module:', err);
    });
}

interface SoundState {
  url: string | null;
  loading: boolean;
  error: string | null;
}

// Helper function to format time as MM:SS
const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const CountdownView: React.FC<TimerProps> = ({ initialSeconds = 120 }) => {
  const [timerState, setTimerState] = useState<CountdownState>({
    remainingTime: initialSeconds,
    isRunning: false,
    isFinished: false,
  });
  const [inputSeconds, setInputSeconds] = useState<string>(initialSeconds.toString());
  const [soundState, setSoundState] = useState<SoundState>({
    url: null,
    loading: false,
    error: null
  });
  const [newlyUnlockedAchievement, setNewlyUnlockedAchievement] = useState<Achievement | null>(null);
  const [newlyPulledIllustration, setNewlyPulledIllustration] = useState<Illustration | null>(null);
  
  // Access the gamification services from context
  const { achievementService, collectionService } = useContext(GamificationContext);
  
  const timerControllerRef = useRef<CountdownTimerController | null>(null);
  const soundRef = useRef<any>(null); // Will hold Audio.Sound or HTMLAudioElement

  // Fetch the sound from the backend when component mounts
  useEffect(() => {
    const fetchSound = async () => {
      setSoundState((prev: SoundState) => ({ ...prev, loading: true, error: null }));
      try {
        const response = await axios.get('http://localhost:3001/generate-sound/Time-is-up');
        setSoundState({
          url: response.data.url,
          loading: false,
          error: null
        });
        console.log('Sound URL fetched:', response.data.url);
      } catch (error) {
        console.error('Failed to fetch sound:', error);
        setSoundState({
          url: null,
          loading: false,
          error: 'Failed to load sound. Backend may not be running.'
        });
      }
    };

    fetchSound();

    // Cleanup function for sound resources
    return () => {
      if (soundRef.current) {
        if (Platform.OS === 'web') {
          try {
            const audioEl = soundRef.current as HTMLAudioElement;
            audioEl.pause();
            audioEl.src = '';
          } catch (e) {
            console.error('Error cleaning up web audio:', e);
          }
        } else if (Audio) {
          try {
            soundRef.current.unloadAsync();
          } catch (e) {
            console.error('Error cleaning up Expo audio:', e);
          }
        }
      }
    };
  }, []);

  // Play sound function that works on both web and native
  const playSound = useCallback(async () => {
    if (!soundState.url) {
      console.log('No sound URL available');
      return;
    }

    try {
      if (Platform.OS === 'web') {
        // Web implementation using HTML Audio API
        const audioElement = new Audio(soundState.url);
        audioElement.addEventListener('ended', () => {
          console.log('Web audio playback complete');
        });
        soundRef.current = audioElement;
        audioElement.play().catch((e: Error) => {
          console.error('Web audio playback error:', e);
        });
      } else if (Audio) {
        // React Native implementation using Expo AV
        try {
          const { sound } = await Audio.Sound.createAsync(
            { uri: soundState.url },
            { shouldPlay: true }
          );
          soundRef.current = sound;
          
          // Add an event listener for when playback finishes
          sound.setOnPlaybackStatusUpdate((status: any) => {
            if (status.didJustFinish) {
              console.log('Expo audio playback complete');
            }
          });
        } catch (e) {
          console.error('Expo audio playback error:', e);
        }
      }
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }, [soundState.url]);

  const handleTick = useCallback((newState: CountdownState) => {
    setTimerState(newState);
  }, []);

  const handleComplete = useCallback(async () => {
    // Play sound when timer completes
    playSound();
    
    // Show alert notification
    if (Platform.OS !== 'web') {
      Alert.alert('Timer Finished!', 'Your countdown is complete.');
    } else {
      // For web
      if (typeof window !== 'undefined') {
        window.alert('Timer Finished!');
      }
    }
    
    console.log('Timer Finished!');
    
    // Track achievement for timer completion
    if (achievementService) {
      try {
        const now = new Date();
        const newlyUnlocked = await achievementService.processEvent('TIMER_COMPLETED', {
          durationSeconds: initialSeconds,
          currentTime: now
        });
        
        if (newlyUnlocked.length > 0) {
          // Show the first unlocked achievement (could implement a queue for multiple)
          setNewlyUnlockedAchievement(newlyUnlocked[0]);
        }
      } catch (err) {
        console.error('Error processing achievement:', err);
      }
    }
    
    // Attempt to pull a new illustration
    if (collectionService) {
      try {
        const pulledIllustration = await collectionService.attemptPullAndSave();
        if (pulledIllustration) {
          // Wait a bit before showing the illustration to not interrupt any achievement toast
          setTimeout(() => {
            setNewlyPulledIllustration(pulledIllustration);
          }, newlyUnlockedAchievement ? 2000 : 500); // Delay longer if there was an achievement
        }
      } catch (err) {
        console.error('Error pulling illustration:', err);
      }
    }
  }, [playSound, achievementService, collectionService, initialSeconds, newlyUnlockedAchievement]);

  useEffect(() => {
    const controller = new CountdownTimerController(initialSeconds, handleTick, handleComplete);
    timerControllerRef.current = controller;
    
    return () => {
      controller.stop(); // Cleanup on unmount
    };
  }, [initialSeconds, handleTick, handleComplete]);

  const handleStartStop = () => {
    if (timerState.isRunning) {
      timerControllerRef.current?.stop();
    } else {
      timerControllerRef.current?.start();
    }
  };

  const handleReset = () => {
    const newTimeInSeconds = Number(inputSeconds) || initialSeconds;
    timerControllerRef.current?.reset(newTimeInSeconds);
  };

  const handleSetTime = () => {
    const newTime = Number(inputSeconds);
    if (!isNaN(newTime) && newTime > 0) {
      timerControllerRef.current?.setTime(newTime);
    } else {
      // Reset input to current timer's initial or remaining time if invalid
      setInputSeconds(timerState.remainingTime.toString());
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Countdown Timer</Text>
      
      {soundState.loading ? (
        <ActivityIndicator size="small" color="#999" style={styles.loading} />
      ) : soundState.error ? (
        <Text style={styles.errorText}>{soundState.error}</Text>
      ) : null}
      
      <TimerDisplay 
        secondsLeft={formatTime(timerState.remainingTime)} 
        accessibilityLabel={`Time remaining: ${formatTime(timerState.remainingTime)}`}
      />
      
      <TimerInput
        inputSeconds={inputSeconds}
        onChangeText={setInputSeconds}
        disabled={timerState.isRunning}
        placeholder="Enter seconds"
        min={1}
        accessibilityLabel="Enter timer duration in seconds"
      />
      
      <View style={styles.buttonRow}>
        <TimerControls
          isRunning={timerState.isRunning}
          onStartStop={handleStartStop}
          onReset={handleReset}
          startLabel="Start"
          stopLabel="Stop"
          resetLabel="Reset"
          startAccessibilityLabel="Start timer"
          stopAccessibilityLabel="Stop timer"
          resetAccessibilityLabel="Reset timer"
        />
      </View>
      
      {inputSeconds !== timerState.remainingTime.toString() && !timerState.isRunning && (
        <View style={styles.setTimeContainer}>
          <TimerControls
            isRunning={false}
            onStartStop={handleSetTime}
            onReset={() => setInputSeconds(timerState.remainingTime.toString())}
            startLabel="Set Time"
            resetLabel="Cancel"
            startAccessibilityLabel="Set new timer duration"
            resetAccessibilityLabel="Cancel setting new time"
          />
        </View>
      )}
      
      {/* Achievement toast notification */}
      {newlyUnlockedAchievement && (
        <AchievementUnlockedToast 
          achievement={newlyUnlockedAchievement} 
          onDismiss={() => setNewlyUnlockedAchievement(null)}
        />
      )}
      
      {/* New illustration reveal modal */}
      {newlyPulledIllustration && (
        <NewIllustrationModal
          illustration={newlyPulledIllustration}
          onClose={() => {
            if (collectionService && newlyPulledIllustration) {
              collectionService.markAsSeen(newlyPulledIllustration.id);
            }
            setNewlyPulledIllustration(null);
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: Platform.OS === 'web' ? 350 : '90%',
    maxWidth: 400,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  loading: {
    marginVertical: 10,
  },
  errorText: {
    color: '#e74c3c',
    marginVertical: 10,
    textAlign: 'center',
    fontSize: 14,
    backgroundColor: '#ffe6e6',
    padding: 8,
    borderRadius: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
    gap: 12, // Adds spacing between buttons
  },
  setTimeContainer: {
    marginTop: 12,
  },
});
