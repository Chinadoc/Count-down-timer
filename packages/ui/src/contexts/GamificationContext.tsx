import React, { createContext, ReactNode } from 'react';
import { 
  AchievementService, 
  UserStatsService, 
  IStorageService,
  CollectionService
} from '@countdown-timer-app/core/src/gamification';

interface GamificationContextType {
  achievementService: AchievementService | null;
  userStatsService: UserStatsService | null;
  collectionService: CollectionService | null;
}

/**
 * Context for providing gamification services throughout the app
 */
export const GamificationContext = createContext<GamificationContextType>({
  achievementService: null,
  userStatsService: null,
  collectionService: null
});

interface GamificationProviderProps {
  children: ReactNode;
  storageService: IStorageService;
}

/**
 * Provider component that makes gamification services available to any
 * child component that calls useGamification().
 */
export const GamificationProvider: React.FC<GamificationProviderProps> = ({ 
  children,
  storageService
}) => {
  // Create service instances
  const userStatsService = new UserStatsService(storageService);
  const achievementService = new AchievementService(storageService, userStatsService);
  const collectionService = new CollectionService(storageService);

  const value = {
    achievementService,
    userStatsService,
    collectionService
  };

  return (
    <GamificationContext.Provider value={value}>
      {children}
    </GamificationContext.Provider>
  );
};

/**
 * Custom hook to access the gamification context
 */
export const useGamification = () => {
  const context = React.useContext(GamificationContext);
  if (context === undefined) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
};
