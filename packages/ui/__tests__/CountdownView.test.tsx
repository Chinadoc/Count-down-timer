import React from 'react';
import { render } from '@testing-library/react-native';
import { CountdownView } from '../src/components/CountdownView';

// Mock the CountdownTimerController from core package
jest.mock('@countdown-timer-app/core', () => ({
  CountdownTimerController: class {
    constructor(initialSeconds, onTick, onComplete) {
      this.initialSeconds = initialSeconds;
      this.onTick = onTick;
      this.onComplete = onComplete;
    }
    start() {
      // Mock implementation
      this.onTick({ 
        remainingTime: this.initialSeconds, 
        isRunning: true,
        isFinished: false 
      });
      return this;
    }
    stop() { /* Mock implementation */ }
    reset() { /* Mock implementation */ }
    setTime() { /* Mock implementation */ }
  }
}));

describe('CountdownView', () => {
  it('renders initial time correctly', () => {
    const { getByText } = render(<CountdownView initialSeconds={120} />);
    // Should display 02:00 for 120 seconds
    expect(getByText('02:00')).toBeTruthy();
  });

  // Additional tests could be added here for:
  // - Testing button interactions
  // - Testing timer state changes
  // - Testing input validation
});
