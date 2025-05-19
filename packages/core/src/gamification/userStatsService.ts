import { UserStats } from './types';
import { IStorageService } from './storageInterface';

const STATS_STORAGE_KEY = 'userTimerStats';

/**
 * Service for managing user statistics for the countdown timer.
 * Handles loading, updating, and saving stats across sessions.
 */
export class UserStatsService {
  constructor(private storageService: IStorageService) {}

  /**
   * Retrieve user stats from storage.
   * @returns The current user stats or default stats if none exist.
   */
  async getStats(): Promise<UserStats> {
    const storedStats = await this.storageService.getItem<UserStats>(STATS_STORAGE_KEY);
    return storedStats || this.getDefaultStats();
  }

  /**
   * Update user stats using a transform function.
   * @param updateFn Function that takes the current stats and returns updated stats.
   * @returns The updated stats after saving.
   */
  async updateStats(updateFn: (currentStats: UserStats) => UserStats): Promise<UserStats> {
    const currentStats = await this.getStats();
    const newStats = updateFn(currentStats);
    await this.storageService.setItem(STATS_STORAGE_KEY, newStats);
    return newStats;
  }

  /**
   * Get the default stats for a new user.
   * @returns Default user stats.
   */
  getDefaultStats(): UserStats {
    return {
      totalTimersCompleted: 0,
      totalTimeTrackedSeconds: 0,
      currentDailyStreak: 0,
      longestTimerCompletedSeconds: 0,
      shortestTimerCompletedSeconds: Number.MAX_SAFE_INTEGER,
      customTimeSetCount: 0,
      resetCount: 0,
      morningCompletions: 0,
      afternoonCompletions: 0,
      eveningCompletions: 0,
      specialNumberCompletions: {},
    };
  }
}
