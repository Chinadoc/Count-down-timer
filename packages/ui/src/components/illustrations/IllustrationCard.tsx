import React from 'react';
import { View, Text, Image, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { Illustration } from '@countdown-timer-app/core/src/gamification';

interface IllustrationCardProps {
  illustration: Illustration;
  isNew?: boolean;
  collected?: boolean;
  onPress?: () => void;
}

// Helper to resolve image paths based on platform
const getImageSource = (imagePath: string, platform: string) => {
  if (platform === 'web') {
    return { uri: `/illustrations/${imagePath}` }; // For web assets in public folder
  } else {
    // For demo purposes - in a real app, you'd use a more robust approach
    // such as having the app-level component resolve these paths
    return { uri: `file:///assets/illustrations/${imagePath}` };
  }
};

export const IllustrationCard: React.FC<IllustrationCardProps> = ({ 
  illustration, 
  isNew = false, 
  collected = false,
  onPress
}) => {
  // Map rarity to color for visual indication
  const rarityColor = {
    Common: '#9E9E9E', // Grey
    Uncommon: '#4CAF50', // Green
    Rare: '#2196F3', // Blue
    Epic: '#9C27B0', // Purple
    Legendary: '#FF9800', // Orange
  };

  const handlePress = () => {
    if (onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.card, !collected && styles.notCollectedCard]} 
      onPress={handlePress}
      disabled={!onPress}
    >
      {isNew && collected && (
        <View style={styles.newBadge}>
          <Text style={styles.newText}>NEW!</Text>
        </View>
      )}
      
      <View 
        style={[
          styles.imageContainer, 
          { borderColor: rarityColor[illustration.rarity] || '#ddd' }
        ]}
      >
        {collected ? (
          <Image
            source={getImageSource(illustration.imagePath, Platform.OS)}
            style={styles.image}
            resizeMode="contain"
          />
        ) : (
          <Text style={styles.lockedText}>?</Text>
        )}
      </View>
      
      <Text style={styles.name}>{collected ? illustration.name : '?????'}</Text>
      
      <Text 
        style={[styles.rarity, { color: rarityColor[illustration.rarity] || '#ddd' }]}
      >
        {illustration.rarity.toUpperCase()}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 150,
    height: 220,
    margin: 8,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  notCollectedCard: {
    backgroundColor: '#e0e0e0'
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 8,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: '#f8f8f8'
  },
  image: {
    width: '90%',
    height: '90%'
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 5,
    color: '#333'
  },
  rarity: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 3
  },
  newBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'red',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    zIndex: 1
  },
  newText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold'
  },
  lockedText: {
    fontSize: 50,
    color: '#aaa'
  }
});
