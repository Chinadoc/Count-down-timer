import React, { useEffect, useRef, useState } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  Easing,
  Platform,
  Image
} from 'react-native';
import { Illustration } from '@countdown-timer-app/core/src/gamification';

interface NewIllustrationModalProps {
  illustration: Illustration;
  onClose: () => void;
}

export const NewIllustrationModal: React.FC<NewIllustrationModalProps> = ({ 
  illustration, 
  onClose 
}) => {
  const [visible, setVisible] = useState(true);
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  // Map rarity to color for visual indication
  const rarityColor = {
    Common: '#9E9E9E', // Grey
    Uncommon: '#4CAF50', // Green
    Rare: '#2196F3', // Blue
    Epic: '#9C27B0', // Purple
    Legendary: '#FF9800', // Orange
  };

  // For confetti effect
  const confettiAmount = illustration.rarity === 'Legendary' ? 50 :
                         illustration.rarity === 'Epic' ? 30 :
                         illustration.rarity === 'Rare' ? 20 : 0;

  useEffect(() => {
    // Sequence of animations for reveal effect
    Animated.sequence([
      // First scale up with a bounce effect
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
      // Then start rotating and pulsating for dramatic effect
      Animated.parallel([
        Animated.loop(
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 4000,
            easing: Easing.linear,
            useNativeDriver: true,
          })
        ),
        Animated.loop(
          Animated.sequence([
            Animated.timing(glowAnim, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: false, // glow changes color which can't use native driver
            }),
            Animated.timing(glowAnim, {
              toValue: 0,
              duration: 1000,
              useNativeDriver: false,
            })
          ])
        )
      ])
    ]).start();
  }, []);

  const handleClose = () => {
    setVisible(false);
    onClose();
  };

  // Rotate interpolation
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Helper to resolve image paths based on platform
  const getImageSource = (imagePath: string) => {
    if (Platform.OS === 'web') {
      return { uri: `/illustrations/${imagePath}` }; // For web assets in public folder
    } else {
      // For demo purposes - in a real app, you'd use a more robust approach
      return { uri: `file:///assets/illustrations/${imagePath}` };
    }
  };

  // Glow color based on rarity
  const glowStyle = {
    shadowColor: rarityColor[illustration.rarity] || '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: glowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.5, 0.9],
    }),
    shadowRadius: glowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [5, 15],
    }),
    elevation: glowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [5, 15],
    }),
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>New Illustration Unlocked!</Text>
          
          <Text style={[styles.rarityLabel, { color: rarityColor[illustration.rarity] }]}>
            {illustration.rarity.toUpperCase()}
          </Text>
          
          {/* Animated illustration container */}
          <Animated.View 
            style={[
              styles.illustrationContainer,
              glowStyle,
              {
                transform: [
                  { scale: scaleAnim },
                  { rotate: spin }
                ],
                borderColor: rarityColor[illustration.rarity]
              }
            ]}
          >
            <Image
              source={getImageSource(illustration.imagePath)}
              style={styles.image}
              resizeMode="contain"
            />
          </Animated.View>
          
          <Text style={styles.name}>{illustration.name}</Text>
          
          {illustration.description && (
            <Text style={styles.description}>{illustration.description}</Text>
          )}
          
          <TouchableOpacity style={styles.button} onPress={handleClose}>
            <Text style={styles.buttonText}>Awesome!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  rarityLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 24,
  },
  illustrationContainer: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    marginBottom: 24,
    overflow: 'hidden',
  },
  image: {
    width: '85%',
    height: '85%',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
    color: '#555',
    paddingHorizontal: 8,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
