export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string; // Path or identifier for an icon
  isSecret?: boolean; // For hidden achievements
  criteria: (stats: UserStats) => boolean; // Function to check if achievement is unlocked
}

export interface UnlockedAchievement {
  achievementId: string;
  unlockedAt: Date;
}

export interface UserStats {
  totalTimersCompleted: number;
  totalTimeTrackedSeconds: number;
  currentDailyStreak: number;
  lastTimerCompletionDate?: string; // YYYY-MM-DD
  longestTimerCompletedSeconds: number;
  shortestTimerCompletedSeconds: number;
  customTimeSetCount: number;
  resetCount: number;
  // Time of day tracking
  morningCompletions: number; // Before noon
  afternoonCompletions: number; // Noon to 6 PM
  eveningCompletions: number; // After 6 PM
  // Tracking specific timer durations
  specialNumberCompletions: { [seconds: number]: number };
}
