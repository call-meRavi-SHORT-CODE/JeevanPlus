import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '@/components/common/Header';
import { DoctorCard } from '@/components/cards/DoctorCard';
import { VoiceButton } from '@/components/common/VoiceButton';
import { useLanguage } from '@/contexts/LanguageContext';
import { MOCK_DOCTORS } from '@/constants/mockData';
import { Doctor } from '@/types';

export default function DoctorsScreen() {
  const [selectedGender, setSelectedGender] = useState<'all' | 'male' | 'female'>('all');
  const [selectedMode, setSelectedMode] = useState<'all' | 'video' | 'audio' | 'chat'>('all');

  const router = useRouter();
  const { t } = useLanguage();

  const filteredDoctors = MOCK_DOCTORS.filter((doctor) => {
    const genderMatch = selectedGender === 'all' || doctor.gender === selectedGender;
    const modeMatch = selectedMode === 'all' || doctor.consultationModes.includes(selectedMode as any);
    return genderMatch && modeMatch;
  });

  const handleDoctorSelect = (doctor: Doctor) => {
    // Navigate to consultation screen with selected doctor
    router.push({
      pathname: '/doctor-consultation',
      params: { doctorId: doctor.id }
    });
  };

  return (
    <View style={styles.container}>
      <Header 
        title={t('doctorConsultation')} 
        showHome
        onHome={() => router.push('/')}
      />
      
      <View style={styles.filtersContainer}>
        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>Gender Preference</Text>
          <View style={styles.filterButtons}>
            {['all', 'male', 'female'].map((gender) => (
              <TouchableOpacity
                key={gender}
                style={[
                  styles.filterButton,
                  selectedGender === gender && styles.activeFilterButton
                ]}
                onPress={() => setSelectedGender(gender as any)}
              >
                <Text style={[
                  styles.filterButtonText,
                  selectedGender === gender && styles.activeFilterText
                ]}>
                  {gender === 'all' ? 'All' : 
                   gender === 'male' ? '👨‍⚕️ Male' : '👩‍⚕️ Female'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>Consultation Mode</Text>
          <View style={styles.filterButtons}>
            {['all', 'video', 'audio', 'chat'].map((mode) => (
              <TouchableOpacity
                key={mode}
                style={[
                  styles.filterButton,
                  selectedMode === mode && styles.activeFilterButton
                ]}
                onPress={() => setSelectedMode(mode as any)}
              >
                <Text style={[
                  styles.filterButtonText,
                  selectedMode === mode && styles.activeFilterText
                ]}>
                  {mode === 'all' ? 'All' : 
                   mode === 'video' ? '🎥 Video' : 
                   mode === 'audio' ? '📞 Audio' : '💬 Chat'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.voiceSection}>
          <VoiceButton 
            text={`Found ${filteredDoctors.length} doctors available for consultation`} 
          />
        </View>
      </View>

      <ScrollView style={styles.doctorsList}>
        {filteredDoctors.map((doctor) => (
          <DoctorCard
            key={doctor.id}
            doctor={doctor}
            onPress={() => handleDoctorSelect(doctor)}
          />
        ))}
        
        {filteredDoctors.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No doctors found</Text>
            <Text style={styles.emptyStateText}>
              Try adjusting your filters to see more doctors
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  filtersContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterSection: {
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  activeFilterButton: {
    backgroundColor: '#22C55E',
    borderColor: '#22C55E',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#6B7280',
  },
  activeFilterText: {
    color: 'white',
  },
  voiceSection: {
    alignItems: 'center',
  },
  doctorsList: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  }
});