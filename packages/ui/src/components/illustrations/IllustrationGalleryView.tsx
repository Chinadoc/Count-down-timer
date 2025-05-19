import React from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { IllustrationWithCollectionStatus } from '@countdown-timer-app/core/src/gamification';
import { IllustrationCard } from './IllustrationCard';

interface IllustrationGalleryViewProps {
  illustrations: IllustrationWithCollectionStatus[];
  loading?: boolean;
  error?: string | null;
  showUncollected?: boolean;
  onPressIllustration?: (illustration: IllustrationWithCollectionStatus) => void;
}

export const IllustrationGalleryView: React.FC<IllustrationGalleryViewProps> = ({
  illustrations,
  loading = false,
  error = null,
  showUncollected = true,
  onPressIllustration,
}) => {
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading illustrations...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!illustrations || illustrations.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>
          No illustrations found. Complete timers for a chance to unlock new illustrations!
        </Text>
      </View>
    );
  }

  const handlePressIllustration = (item: IllustrationWithCollectionStatus) => {
    if (onPressIllustration && (item.collectedAt || showUncollected)) {
      onPressIllustration(item);
    }
  };

  const renderItem = ({ item }: { item: IllustrationWithCollectionStatus }) => (
    <IllustrationCard
      illustration={item.illustration}
      isNew={item.isNew}
      collected={!!item.collectedAt}
      onPress={() => handlePressIllustration(item)}
    />
  );

  return (
    <FlatList
      data={illustrations}
      renderItem={renderItem}
      keyExtractor={(item) => item.illustration.id}
      numColumns={Platform.OS === 'web' ? 4 : 2}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  listContainer: {
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
