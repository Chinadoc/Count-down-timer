import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { GamificationContext } from '../contexts/GamificationContext';
import { IllustrationGalleryView } from '../components/illustrations/IllustrationGalleryView';
import { IllustrationWithCollectionStatus } from '@countdown-timer-app/core/src/gamification';

export const IllustrationGalleryScreen: React.FC = () => {
  const { collectionService } = useContext(GamificationContext);
  const [illustrations, setIllustrations] = useState<IllustrationWithCollectionStatus[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadIllustrations();
  }, []);

  const loadIllustrations = async () => {
    if (!collectionService) {
      setError('Collection service is not available.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const collectionDetails = await collectionService.getFullCollectionDetails();
      setIllustrations(collectionDetails);
      setError(null);
    } catch (err) {
      console.error('Failed to load illustrations:', err);
      setError('Failed to load illustrations. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handlePressIllustration = (item: IllustrationWithCollectionStatus) => {
    // If this illustration is marked as new, update it
    if (item.isNew && collectionService && item.collectedAt) {
      collectionService.markAsSeen(item.illustration.id);
      
      // Update local state to reflect the change
      setIllustrations(current => 
        current.map(i => 
          i.illustration.id === item.illustration.id 
            ? { ...i, isNew: false } 
            : i
        )
      );
    }

    // Additional functionality could be added here
    // e.g., showing a detailed view of the illustration
  };

  const collectedCount = illustrations.filter(i => i.collectedAt).length;
  const totalCount = illustrations.length;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Illustration Collection</Text>
      
      {!loading && !error && (
        <Text style={styles.collectionStats}>
          {collectedCount} of {totalCount} collected ({Math.round((collectedCount / totalCount) * 100)}%)
        </Text>
      )}
      
      <IllustrationGalleryView
        illustrations={illustrations}
        loading={loading}
        error={error}
        showUncollected={true}
        onPressIllustration={handlePressIllustration}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  collectionStats: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
});
