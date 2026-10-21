export interface TimerProps {
  initialSeconds?: number;
}

export interface TimerDisplayProps {
  secondsLeft: number;
  accessibilityLabel?: string;
}

export interface TimerInputProps {
  inputSeconds: string;
  onChangeText: (text: string) => void;
  disabled: boolean;
  placeholder?: string;
  accessibilityLabel?: string;
}

export interface TimerControlsProps {
  isRunning: boolean;
  onStartStop: () => void;
  onReset: () => void;
  startLabel?: string;
  stopLabel?: string;
  resetLabel?: string;
  startAccessibilityLabel?: string;
  stopAccessibilityLabel?: string;
  resetAccessibilityLabel?: string;
}
