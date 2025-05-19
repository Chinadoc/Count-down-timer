import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { AchievementsList } from '../components/achievements/AchievementsList';
import { GamificationContext } from '../contexts/GamificationContext'; // To be created

export const AchievementsScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [achievementsData, setAchievementsData] = useState<any[]>([]);
  
  // This context will be implemented in each platform
  const { achievementService } = useContext(GamificationContext);

  useEffect(() => {
    if (!achievementService) {
      setError('Achievement service not available');
      setLoading(false);
      return;
    }

    const loadAchievements = async () => {
      try {
        const achievements = await achievementService.getAllAchievementsWithStatus();
        setAchievementsData(achievements);
        setError(null);
      } catch (err) {
        setError('Failed to load achievements');
        console.error('Error loading achievements:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAchievements();
  }, [achievementService]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Achievements</Text>
      </View>
      <AchievementsList 
        achievements={achievementsData} 
        loading={loading}
        error={error || undefined}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#3A3D5D',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
});
