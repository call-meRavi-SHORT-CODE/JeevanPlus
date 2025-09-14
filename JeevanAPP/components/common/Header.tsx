import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { VoiceButton } from './VoiceButton';
import { useLanguage } from '@/contexts/LanguageContext';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  showHome?: boolean;
  onHome?: () => void;
}

export function Header({ title, showBack, onBack, showHome, onHome }: HeaderProps) {
  const { t } = useLanguage();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.leftSection}>
          {showBack && (
            <TouchableOpacity style={styles.iconButton} onPress={onBack}>
              <Ionicons name="arrow-back" size={24} color="#374151" />
              <Text style={styles.iconText}>{t('back')}</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.centerSection}>
          <Text style={styles.title}>{title}</Text>
        </View>
        
        <View style={styles.rightSection}>
          {showHome && (
            <TouchableOpacity style={styles.iconButton} onPress={onHome}>
              <Ionicons name="home" size={24} color="#374151" />
              <Text style={styles.iconText}>{t('home')}</Text>
            </TouchableOpacity>
          )}
          <VoiceButton text={title} size={20} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: 'white',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 2,
    alignItems: 'center',
  },
  rightSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  iconButton: {
    alignItems: 'center',
  },
  iconText: {
    fontSize: 12,
    color: '#374151',
    marginTop: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  }
});