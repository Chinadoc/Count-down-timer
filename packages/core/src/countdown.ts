export type CountdownState = {
  remainingTime: number; // in seconds
  isRunning: boolean;
  isFinished: boolean;
};

export type TickCallback = (state: CountdownState) => void;
export type CompleteCallback = () => void;

export class CountdownTimerController {
  private initialTime: number;
  private state: CountdownState;
  // Use ReturnType<typeof setInterval> for better portability across environments
  private timerId: ReturnType<typeof setInterval> | null = null;
  private onTick: TickCallback;
  private onComplete: CompleteCallback;

  constructor(
    initialTimeInSeconds: number,
    onTick: TickCallback,
    onComplete: CompleteCallback
  ) {
    // Ensure initialTime is not negative
    this.initialTime = initialTimeInSeconds > 0 ? initialTimeInSeconds : 0;
    this.onTick = onTick;
    this.onComplete = onComplete;
    this.state = {
      remainingTime: this.initialTime,
      isRunning: false,
      isFinished: this.initialTime === 0, // If initial time is 0, it's already finished
    };
  }

  public start(): void {
    // If it's already running, or if it's finished and remaining time is zero, do nothing
    if (this.state.isRunning || (this.state.isFinished && this.state.remainingTime <= 0)) return;

    this.state.isRunning = true;
    this.state.isFinished = false; // Reset finished state if restarting
    // Pass a copy of the state to prevent direct external mutation
    this.onTick({ ...this.state });

    this.timerId = setInterval(() => {
      this.state.remainingTime -= 1;
      if (this.state.remainingTime <= 0) {
        this.stop();
        this.state.isFinished = true;
        this.onComplete();
      }
      // Pass a copy of the state
      this.onTick({ ...this.state });
    }, 1000);
  }

  public stop(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    if (this.state.isRunning) { // Only update and tick if it was running
      this.state.isRunning = false;
      // Pass a copy of the state
      this.onTick({ ...this.state });
    }
  }

  public reset(newInitialTimeInSeconds?: number): void {
    this.stop(); // Ensures timer is stopped and calls onTick if it was running
    const newTime = newInitialTimeInSeconds !== undefined && newInitialTimeInSeconds > 0 
      ? newInitialTimeInSeconds 
      : (this.initialTime > 0 ? this.initialTime : 0);

    this.initialTime = newTime;
    this.state = {
      remainingTime: this.initialTime,
      isRunning: false,
      isFinished: this.initialTime === 0,
    };
    // Pass a copy of the state
    this.onTick({ ...this.state });
  }

  public setTime(newTimeInSeconds: number): void {
    const newValidTime = newTimeInSeconds > 0 ? newTimeInSeconds : 0;
    const wasRunning = this.state.isRunning;

    if (wasRunning) {
      this.stop(); // Calls onTick if it was running
    }

    this.initialTime = newValidTime;
    this.state = {
      remainingTime: this.initialTime,
      isRunning: false, // setTime implies a stop, then potential restart
      isFinished: this.initialTime === 0,
    };
    // Pass a copy of the state
    this.onTick({ ...this.state });

    if (wasRunning) {
      this.start();
    }
  }

  public getFormattedTime(): string {
    const minutes = Math.floor(this.state.remainingTime / 60);
    const seconds = this.state.remainingTime % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  public getCurrentState(): CountdownState {
    // Return a copy of the state
    return { ...this.state };
  }
}
