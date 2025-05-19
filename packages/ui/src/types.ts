export interface TimerProps {
  initialSeconds?: number;
}

export interface TimerDisplayProps {
  secondsLeft: number;
}

export interface TimerInputProps {
  inputSeconds: string;
  onChangeText: (text: string) => void;
  disabled: boolean;
}

export interface TimerControlsProps {
  isRunning: boolean;
  onStartStop: () => void;
  onReset: () => void;
}
