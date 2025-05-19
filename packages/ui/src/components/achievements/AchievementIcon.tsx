import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

interface AchievementIconProps {
  name: string;
  size?: number;
  color?: string;
  locked?: boolean;
}

/**
 * A component to render achievement icons
 * For a production app, you'd use actual icon assets or an icon library
 */
export const AchievementIcon: React.FC<AchievementIconProps> = ({
  name,
  size = 24,
  color = '#F8B500',
  locked = false,
}) => {
  // This is a simple placeholder implementation
  // In a real app, you'd use a proper icon library like @expo/vector-icons
  
  // Using first letter of icon name as a placeholder
  const firstLetter = name.charAt(0).toUpperCase();
  
  return (
    <View 
      style={[
        styles.iconContainer, 
        { 
          width: size, 
          height: size, 
          borderRadius: size / 2,
          backgroundColor: locked ? '#CCCCCC' : color
        }
      ]}
    >
      <Text 
        style={[
          styles.iconText, 
          { fontSize: size * 0.6, color: locked ? '#888888' : 'white' }
        ]}
      >
        {firstLetter}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  iconText: {
    fontWeight: 'bold',
  },
});
