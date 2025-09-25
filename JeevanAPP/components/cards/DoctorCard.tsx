import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Doctor } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface DoctorCardProps {
  doctor: Doctor;
  onPress: () => void;
}

export function DoctorCard({ doctor, onPress }: DoctorCardProps) {
  const { t } = useLanguage();

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {doctor.gender === 'female' ? '👩‍⚕️' : '👨‍⚕️'}
          </Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{doctor.name}</Text>
          <Text style={styles.specialization}>{doctor.specialization}</Text>
          <View style={styles.rating}>
            <Ionicons name="star" size={16} color="#F59E0B" />
            <Text style={styles.ratingText}>{doctor.rating}</Text>
          </View>
        </View>
        <View style={styles.status}>
          <View style={[
            styles.statusIndicator, 
            { backgroundColor: doctor.available ? '#22C55E' : '#EF4444' }
          ]} />
          <Text style={[
            styles.statusText, 
            { color: doctor.available ? '#22C55E' : '#EF4444' }
          ]}>
            {doctor.available ? t('available') : t('notAvailable')}
          </Text>
        </View>
      </View>
      
      <View style={styles.languages}>
        <Text style={styles.languagesLabel}>Languages:</Text>
        <Text style={styles.languagesList}>
          {doctor.languages.join(', ')}
        </Text>
      </View>
      
      <View style={styles.consultationModes}>
        {doctor.consultationModes.map((mode) => (
          <TouchableOpacity
            key={mode}
            style={styles.modeChip}
            onPress={() => {
              if (mode === 'video') {
                // Use expo-router navigation to DoctorChatScreen and pass doctor object
                const { useRouter } = require('expo-router');
                const router = useRouter();
                router.push({
                  pathname: '/DoctorChatScreen',
                  params: { doctor: JSON.stringify(doctor) }
                });
              }
            }}
          >
            <Ionicons 
              name={
                mode === 'video' ? 'videocam' : 
                mode === 'audio' ? 'call' : 'chatbubbles'
              } 
              size={16} 
              color="#3B82F6" 
            />
            <Text style={styles.modeText}>{t(mode === 'video' ? 'videoCall' : mode === 'audio' ? 'audioCall' : 'chat')}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 32,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  specialization: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  status: {
    alignItems: 'center',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  languages: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  languagesLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginRight: 8,
  },
  languagesList: {
    fontSize: 14,
    color: '#6B7280',
    textTransform: 'capitalize',
  },
  consultationModes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  modeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF4FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  modeText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '500',
  }
});