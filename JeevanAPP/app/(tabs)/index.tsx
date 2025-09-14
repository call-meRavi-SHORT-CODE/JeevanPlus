import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { IconButton } from '@/components/common/IconButton';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { VoiceButton } from '@/components/common/VoiceButton';

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const { user } = useAuth();

  const menuItems = [
    {
      icon: '🩺',
      title: t('symptomChecker'),
      color: '#EF4444',
      route: '/symptom-checker'
    },
    {
      icon: '👨‍⚕️',
      title: t('doctorConsultation'),
      color: '#3B82F6',
      route: '/doctor-consultation'
    },
    {
      icon: '💊',
      title: t('pharmacyFinder'),
      color: '#22C55E',
      route: '/pharmacy'
    },
    {
      icon: '📄',
      title: t('healthRecords'),
      color: '#8B5CF6',
      route: '/health-records'
    }
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.welcome}>
          <Text style={styles.appName}>{t('appName')}</Text>
          <Text style={styles.greeting}>
            {t('welcome')}, {user?.name || 'User'}!
          </Text>
        </View>
        <VoiceButton text={`${t('welcome')} to ${t('appName')}`} />
      </View>

      <LanguageSwitcher />

      <View style={styles.menuGrid}>
        {menuItems.map((item, index) => (
          <IconButton
            key={index}
            icon={item.icon}
            title={item.title}
            color={item.color}
            onPress={() => router.push(item.route as any)}
          />
        ))}
      </View>

      <View style={styles.emergencySection}>
        <View style={styles.emergencyHeader}>
          <Text style={styles.emergencyTitle}>🚨 Emergency</Text>
          <VoiceButton text="Emergency help available" size={20} />
        </View>
        <View style={styles.emergencyButtons}>
          <IconButton
            icon="🚑"
            title="Call Ambulance"
            color="#DC2626"
            onPress={() => {/* Handle emergency call */}}
          />
          <IconButton
            icon="🏥"
            title="Nearest Hospital"
            color="#7C2D12"
            onPress={() => {/* Handle nearest hospital */}}
          />
        </View>
      </View>

      <View style={styles.healthTips}>
        <Text style={styles.sectionTitle}>💡 Daily Health Tips</Text>
        <VoiceButton text="Daily health tips" size={20} />
        <View style={styles.tipCard}>
          <Text style={styles.tipText}>
            Drink at least 8 glasses of water daily to stay hydrated and healthy.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  welcome: {
    flex: 1,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#22C55E',
  },
  greeting: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 9,
    justifyContent: 'space-between',
  },
  emergencySection: {
    margin: 20,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
  },
  emergencyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#DC2626',
  },
  emergencyButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  healthTips: {
    margin: 20,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  tipCard: {
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: 8,
    marginTop: 12,
  },
  tipText: {
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
  }
});