import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import VoiceService from '@/services/voiceService';

interface VoiceButtonProps {
  text?: string;
  type?: 'speak' | 'listen';
  onVoiceInput?: (input: string) => void;
  size?: number;
  style?: any;
}

export function VoiceButton({ 
  text, 
  type = 'speak', 
  onVoiceInput, 
  size = 24,
  style 
}: VoiceButtonProps) {
  const [isActive, setIsActive] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(1));

  const handlePress = async () => {
    setIsActive(true);
    
    // Animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    if (type === 'speak' && text) {
      VoiceService.speak(text);
    } else if (type === 'listen' && onVoiceInput) {
      try {
        const input = await VoiceService.startListening();
        onVoiceInput(input);
      } catch (error) {
        console.error('Voice input error:', error);
      }
    }

    setTimeout(() => setIsActive(false), 2000);
  };

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <TouchableOpacity
        style={[
          styles.button,
          isActive && styles.activeButton,
          style
        ]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <Ionicons 
          name={type === 'speak' ? 'volume-medium' : 'mic'} 
          size={size} 
          color={isActive ? '#FFFFFF' : '#1976D2'} 
        />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BBDEFB',
  },
  activeButton: {
    backgroundColor: '#1976D2',
    borderColor: '#1976D2',
  }
});