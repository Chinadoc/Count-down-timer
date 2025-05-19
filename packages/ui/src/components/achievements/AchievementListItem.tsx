import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Achievement } from '@countdown-timer-app/core/src/gamification';
import { AchievementIcon } from './AchievementIcon';

interface AchievementListItemProps {
  achievement: Achievement;
  unlocked: boolean;
  unlockedAt?: Date;
}

export const AchievementListItem: React.FC<AchievementListItemProps> = ({
  achievement,
  unlocked,
  unlockedAt,
}) => {
  const { id, name, description, icon, isSecret } = achievement;
  
  // If it's a secret achievement and not unlocked yet, display a secret message
  const displayName = (!unlocked && isSecret) ? 'Secret Achievement' : name;
  const displayDescription = (!unlocked && isSecret)
    ? 'Keep playing to unlock this secret achievement!'
    : description;

  return (
    <View style={styles.container}>
      <AchievementIcon name={icon} size={40} locked={!unlocked} />
      
      <View style={styles.textContainer}>
        <Text style={[styles.title, !unlocked && styles.lockedText]}>
          {displayName}
        </Text>
        <Text style={[styles.description, !unlocked && styles.lockedText]}>
          {displayDescription}
        </Text>
        {unlocked && unlockedAt && (
          <Text style={styles.date}>
            Unlocked: {unlockedAt.toLocaleDateString()}
          </Text>
        )}
      </View>
      
      {unlocked && (
        <View style={styles.unlockedBadge}>
          <Text style={styles.unlockedText}>✓</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  lockedText: {
    color: '#AAAAAA',
  },
  unlockedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  unlockedText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
