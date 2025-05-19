import { Achievement, UnlockedAchievement, UserStats } from './types';
import { ACHIEVEMENTS } from './achievementDefinitions';
import { IStorageService } from './storageInterface';
import { UserStatsService } from './userStatsService';

const UNLOCKED_ACHIEVEMENTS_KEY = 'unlockedTimerAchievements';

export type TimerEventType =
  | 'TIMER_COMPLETED'
  | 'TIMER_STARTED' 
  | 'CUSTOM_TIME_SET'
  | 'TIMER_RESET';

export interface TimerEventData {
  durationSeconds?: number; // Duration for timer completed or started
  currentTime?: Date; // Current time for time-of-day achievements
}

/**
 * Service for managing achievements and checking unlock conditions.
 */
export class AchievementService {
  private newlyUnlocked: Achievement[] = [];

  constructor(
    private storageService: IStorageService,
    private userStatsService: UserStatsService
  ) {}

  /**
   * Get all achievements that have been unlocked.
   */
  async getUnlockedAchievements(): Promise<UnlockedAchievement[]> {
    return (await this.storageService.getItem<UnlockedAchievement[]>(UNLOCKED_ACHIEVEMENTS_KEY)) || [];
  }

  /**
   * Save unlocked achievements to storage.
   */
  private async saveUnlockedAchievements(unlocked: UnlockedAchievement[]): Promise<void> {
    await this.storageService.setItem(UNLOCKED_ACHIEVEMENTS_KEY, unlocked);
  }

  /**
   * Process a timer event and check for newly unlocked achievements.
   * @param eventType The type of event that occurred
   * @param data Additional data about the event
   * @returns Array of newly unlocked achievements
   */
  async processEvent(eventType: TimerEventType, data?: TimerEventData): Promise<Achievement[]> {
    this.newlyUnlocked = []; // Reset for this event cycle

    const updatedStats = await this.userStatsService.updateStats(stats =>
      this.updateStatsForEvent(stats, eventType, data)
    );

    const currentlyUnlocked = await this.getUnlockedAchievements();
    const unlockedIds = new Set(currentlyUnlocked.map(a => a.achievementId));

    for (const achievement of ACHIEVEMENTS) {
      if (!unlockedIds.has(achievement.id) && achievement.criteria(updatedStats)) {
        currentlyUnlocked.push({ achievementId: achievement.id, unlockedAt: new Date() });
        unlockedIds.add(achievement.id); // ensure we don't add it twice in this loop
        this.newlyUnlocked.push(achievement);
      }
    }

    if (this.newlyUnlocked.length > 0) {
      await this.saveUnlockedAchievements(currentlyUnlocked);
    }
    return this.newlyUnlocked; // Return achievements unlocked in this specific event
  }

  /**
   * Update user stats based on the event type
   */
  private updateStatsForEvent(stats: UserStats, eventType: TimerEventType, data?: TimerEventData): UserStats {
    const newStats = { ...stats };
    const now = data?.currentTime || new Date();
    const today = now.toISOString().split('T')[0];
    const hour = now.getHours();

    switch (eventType) {
      case 'TIMER_COMPLETED':
        newStats.totalTimersCompleted += 1;
        
        if (data?.durationSeconds) {
          newStats.totalTimeTrackedSeconds += data.durationSeconds;
          
          // Update longest timer
          if (data.durationSeconds > newStats.longestTimerCompletedSeconds) {
            newStats.longestTimerCompletedSeconds = data.durationSeconds;
          }
          
          // Update shortest timer
          if (data.durationSeconds < newStats.shortestTimerCompletedSeconds) {
            newStats.shortestTimerCompletedSeconds = data.durationSeconds;
          }
          
          // Track special numbers
          if (!newStats.specialNumberCompletions) {
            newStats.specialNumberCompletions = {};
          }
          
          // Check specific numbers like 60, 777, etc.
          const seconds = data.durationSeconds;
          newStats.specialNumberCompletions[seconds] = 
            (newStats.specialNumberCompletions[seconds] || 0) + 1;
        }
        
        // Time of day tracking
        if (hour < 12) {
          newStats.morningCompletions = (newStats.morningCompletions || 0) + 1;
        } else if (hour < 18) {
          newStats.afternoonCompletions = (newStats.afternoonCompletions || 0) + 1;
        } else {
          newStats.eveningCompletions = (newStats.eveningCompletions || 0) + 1;
        }
        
        // Streak logic
        if (stats.lastTimerCompletionDate === today) {
          // Already completed one today, no change to streak
        } else {
          const yesterday = new Date(now);
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];
          
          if (stats.lastTimerCompletionDate === yesterdayStr) {
            newStats.currentDailyStreak += 1;
          } else {
            newStats.currentDailyStreak = 1; // Reset streak
          }
        }
        newStats.lastTimerCompletionDate = today;
        break;
        
      case 'CUSTOM_TIME_SET':
        newStats.customTimeSetCount += 1;
        break;
        
      case 'TIMER_RESET':
        newStats.resetCount += 1;
        break;
    }
    
    return newStats;
  }

  /**
   * Get all achievements with their unlock status.
   * @returns Array of achievements with unlock status and date
   */
  async getAllAchievementsWithStatus(): Promise<{ 
    achievement: Achievement; 
    unlocked: boolean; 
    unlockedAt?: Date 
  }[]> {
    const unlocked = await this.getUnlockedAchievements();
    const unlockedMap = new Map(unlocked.map(ua => [ua.achievementId, ua.unlockedAt]));
    
    return ACHIEVEMENTS.map(ach => ({
      achievement: ach,
      unlocked: unlockedMap.has(ach.id),
      unlockedAt: unlockedMap.get(ach.id),
    }));
  }
}
