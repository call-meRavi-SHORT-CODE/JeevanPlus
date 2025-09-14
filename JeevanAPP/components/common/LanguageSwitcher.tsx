import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { LANGUAGES } from '@/constants/languages';

export function LanguageSwitcher() {
  const { currentLanguage, setLanguage, t } = useLanguage();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t('languageSwitch')}</Text>
      <View style={styles.buttonContainer}>
        {LANGUAGES.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            style={[
              styles.languageButton,
              currentLanguage === lang.code && styles.activeButton
            ]}
            onPress={() => setLanguage(lang.code)}
          >
            <Text style={[
              styles.buttonText,
              currentLanguage === lang.code && styles.activeText
            ]}>
              {lang.nativeName}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#374151',
  },
  buttonContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
  },
  languageButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 2,
  },
  activeButton: {
    backgroundColor: '#22C55E',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeText: {
    color: 'white',
  }
});