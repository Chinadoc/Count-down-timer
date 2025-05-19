import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Achievement } from '@countdown-timer-app/core/src/gamification';
import { AchievementListItem } from './AchievementListItem';

interface AchievementsListProps {
  achievements: {
    achievement: Achievement;
    unlocked: boolean;
    unlockedAt?: Date;
  }[];
  loading?: boolean;
  error?: string;
}

export const AchievementsList: React.FC<AchievementsListProps> = ({
  achievements,
  loading = false,
  error,
}) => {
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3A78FF" />
        <Text style={styles.loadingText}>Loading achievements...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (!achievements || achievements.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No achievements found.</Text>
      </View>
    );
  }

  // Sort achievements: unlocked first, then by name
  const sortedAchievements = [...achievements].sort((a, b) => {
    // First priority: unlocked status (unlocked first)
    if (a.unlocked && !b.unlocked) return -1;
    if (!a.unlocked && b.unlocked) return 1;
    
    // Second priority: for unlocked achievements, sort by unlock date (most recent first)
    if (a.unlocked && b.unlocked && a.unlockedAt && b.unlockedAt) {
      return b.unlockedAt.getTime() - a.unlockedAt.getTime();
    }
    
    // Third priority: sort by name alphabetically
    return a.achievement.name.localeCompare(b.achievement.name);
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          Unlocked: {achievements.filter(a => a.unlocked).length} / {achievements.length}
        </Text>
      </View>
      
      {sortedAchievements.map((item) => (
        <AchievementListItem
          key={item.achievement.id}
          achievement={item.achievement}
          unlocked={item.unlocked}
          unlockedAt={item.unlockedAt}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  contentContainer: {
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#E53935',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  statsContainer: {
    marginBottom: 16,
    padding: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    alignItems: 'center',
  },
  statsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});
