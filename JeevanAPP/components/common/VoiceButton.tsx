import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import voiceService from '@/services/voiceService';
import { useLanguage } from '@/contexts/LanguageContext';

interface VoiceButtonProps {
  text?: string;
  onVoiceInput?: (input: string) => void;
  type?: 'speak' | 'listen';
  size?: number;
  color?: string;
}

export function VoiceButton({ 
  text, 
  onVoiceInput, 
  type = 'speak', 
  size = 28, 
  color = '#22C55E' 
}: VoiceButtonProps) {
  const [isListening, setIsListening] = useState(false);
  const { currentLanguage } = useLanguage();

  const handlePress = async () => {
    if (type === 'speak' && text) {
      voiceService.setLanguage(currentLanguage);
      voiceService.speak(text);
    } else if (type === 'listen' && onVoiceInput) {
      setIsListening(true);
      try {
        const input = await voiceService.startListening();
        onVoiceInput(input);
      } catch (error) {
        Alert.alert('Voice Error', 'Could not process voice input');
      } finally {
        setIsListening(false);
      }
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.button, { backgroundColor: color }]} 
      onPress={handlePress}
      disabled={isListening}
    >
      <Ionicons 
        name={type === 'speak' ? 'volume-high' : (isListening ? 'mic' : 'mic-outline')} 
        size={size} 
        color="white" 
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  }
});