import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '@/components/common/Header';
import { VoiceButton } from '@/components/common/VoiceButton';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import StorageService from '@/services/storageService';
import { Consultation } from '@/types';

export default function RecordsScreen() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const { t } = useLanguage();
  const { user, logout } = useAuth();

  useEffect(() => {
    loadConsultations();
  }, []);

  const loadConsultations = async () => {
    try {
      const records = await StorageService.getConsultations();
      setConsultations(records);
    } catch (error) {
      console.error('Error loading consultations:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#22C55E';
      case 'pending': return '#F59E0B';
      case 'cancelled': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <View style={styles.container}>
      <Header 
        title={t('healthRecords')} 
        showHome
        onHome={() => router.push('/')}
      />
      
      <View style={styles.profileSection}>
        <View style={styles.profileInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name || 'User'}</Text>
            <Text style={styles.userPhone}>{user?.phoneNumber}</Text>
            <Text style={styles.userLocation}>{user?.location}</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.voiceSection}>
          <VoiceButton 
            text={`Your health records. You have ${consultations.length} consultations.`} 
          />
        </View>
      </View>

      <ScrollView style={styles.recordsList}>
        <Text style={styles.sectionTitle}>Consultation History</Text>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading records...</Text>
          </View>
        ) : consultations.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>📋</Text>
            <Text style={styles.emptyStateTitle}>No Records Yet</Text>
            <Text style={styles.emptyStateText}>
              Your consultation history will appear here after your first visit
            </Text>
            <TouchableOpacity 
              style={styles.consultButton}
              onPress={() => router.push('/doctor-consultation')}
            >
              <Text style={styles.consultButtonText}>
                Start Your First Consultation
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          consultations.map((consultation) => (
            <View key={consultation.id} style={styles.recordCard}>
              <View style={styles.recordHeader}>
                <Text style={styles.recordDate}>
                  {formatDate(consultation.date)}
                </Text>
                <View style={[
                  styles.statusBadge, 
                  { backgroundColor: getStatusColor(consultation.status) + '20' }
                ]}>
                  <Text style={[
                    styles.statusText, 
                    { color: getStatusColor(consultation.status) }
                  ]}>
                    {consultation.status.toUpperCase()}
                  </Text>
                </View>
              </View>
              
              <View style={styles.recordBody}>
                <Text style={styles.recordSymptoms}>
                  Symptoms: {consultation.symptoms.join(', ')}
                </Text>
                <Text style={styles.recordDiagnosis}>
                  Diagnosis: {consultation.diagnosis}
                </Text>
                <Text style={styles.recordPrescription}>
                  Prescription: {consultation.prescription}
                </Text>
              </View>
              
              <View style={styles.recordFooter}>
                <View style={styles.consultationMode}>
                  <Ionicons 
                    name={
                      consultation.mode === 'video' ? 'videocam' : 
                      consultation.mode === 'audio' ? 'call' : 'chatbubbles'
                    } 
                    size={16} 
                    color="#6B7280" 
                  />
                  <Text style={styles.modeText}>{consultation.mode}</Text>
                </View>
                
                <TouchableOpacity style={styles.shareButton}>
                  <Ionicons name="share-outline" size={16} color="#3B82F6" />
                  <Text style={styles.shareText}>Share</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
        
        <View style={styles.privacyNote}>
          <Text style={styles.privacyTitle}>🔒 Privacy & Security</Text>
          <Text style={styles.privacyText}>
            All your health records are stored securely on your device and are not shared with anyone without your consent.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  profileSection: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
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
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  userLocation: {
    fontSize: 14,
    color: '#6B7280',
  },
  logoutButton: {
    padding: 8,
  },
  voiceSection: {
    alignItems: 'center',
  },
  recordsList: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    margin: 16,
    marginBottom: 8,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  consultButton: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  consultButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  recordCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  recordDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  recordBody: {
    marginBottom: 12,
  },
  recordSymptoms: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  recordDiagnosis: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  recordPrescription: {
    fontSize: 14,
    color: '#374151',
  },
  recordFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  consultationMode: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modeText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#6B7280',
    textTransform: 'capitalize',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shareText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#3B82F6',
  },
  privacyNote: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#22C55E',
  },
  privacyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  privacyText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  }
});