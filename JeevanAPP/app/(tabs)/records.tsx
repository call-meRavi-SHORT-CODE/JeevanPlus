import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';

const PRIMARY_BLUE = '#1976D2';
const LIGHT_BLUE = '#E3F2FD';
const WHITE = '#FFFFFF';

interface HealthRecord {
  id: string;
  disease: string;
  date: string;
  doctor: string;
  status: 'ongoing' | 'recovered' | 'follow-up';
  prescription: string;
  symptoms: string[];
  diagnosis: string;
  nextVisit?: string;
}

const MOCK_RECORDS: HealthRecord[] = [
  {
    id: '1',
    disease: 'Hypertension',
    date: '2024-01-15',
    doctor: 'Dr. Manjeet Singh',
    status: 'ongoing',
    prescription: 'Amlodipine 5mg - Once daily\nLifestyle modifications\nRegular BP monitoring',
    symptoms: ['High blood pressure', 'Headache', 'Dizziness'],
    diagnosis: 'Essential Hypertension - Stage 1',
    nextVisit: '2024-02-15'
  },
  {
    id: '2',
    disease: 'Diabetes Type 2',
    date: '2024-01-10',
    doctor: 'Dr. Simran Kaur',
    status: 'ongoing',
    prescription: 'Metformin 500mg - Twice daily\nDiet control\nRegular exercise\nBlood sugar monitoring',
    symptoms: ['Increased thirst', 'Frequent urination', 'Fatigue'],
    diagnosis: 'Type 2 Diabetes Mellitus',
    nextVisit: '2024-02-10'
  },
  {
    id: '3',
    disease: 'Seasonal Flu',
    date: '2024-01-05',
    doctor: 'Dr. Rajesh Kumar',
    status: 'recovered',
    prescription: 'Paracetamol 500mg - As needed\nRest and fluids\nCompleted course',
    symptoms: ['Fever', 'Body ache', 'Cough', 'Runny nose'],
    diagnosis: 'Viral Upper Respiratory Infection'
  },
  {
    id: '4',
    disease: 'Migraine',
    date: '2023-12-20',
    doctor: 'Dr. Preet Kaur',
    status: 'follow-up',
    prescription: 'Sumatriptan 50mg - As needed\nStress management\nSleep hygiene',
    symptoms: ['Severe headache', 'Nausea', 'Light sensitivity'],
    diagnosis: 'Migraine without Aura',
    nextVisit: '2024-01-20'
  },
  {
    id: '5',
    disease: 'Gastritis',
    date: '2023-12-15',
    doctor: 'Dr. Manjeet Singh',
    status: 'recovered',
    prescription: 'Omeprazole 20mg - Once daily\nDietary modifications\nCompleted treatment',
    symptoms: ['Stomach pain', 'Acidity', 'Nausea'],
    diagnosis: 'Acute Gastritis'
  }
];

export default function RecordsScreen() {
  const [records, setRecords] = useState<HealthRecord[]>(MOCK_RECORDS);
  const [selectedRecord, setSelectedRecord] = useState<HealthRecord | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'ongoing' | 'recovered' | 'follow-up'>('all');

  const router = useRouter();
  const { user, logout } = useAuth();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ongoing': return '#F59E0B';
      case 'recovered': return '#22C55E';
      case 'follow-up': return '#3B82F6';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ongoing': return 'time-outline';
      case 'recovered': return 'checkmark-circle';
      case 'follow-up': return 'calendar-outline';
      default: return 'help-circle-outline';
    }
  };

  const filteredRecords = filterStatus === 'all' 
    ? records 
    : records.filter(record => record.status === filterStatus);

  const stats = {
    total: records.length,
    ongoing: records.filter(r => r.status === 'ongoing').length,
    recovered: records.filter(r => r.status === 'recovered').length,
    followUp: records.filter(r => r.status === 'follow-up').length
  };

  const openRecordDetails = (record: HealthRecord) => {
    setSelectedRecord(record);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={WHITE} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Health Records</Text>
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color={WHITE} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Profile Section */}
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
          </View>
        </View>

        {/* Statistics Cards */}
        <View style={styles.statsSection}>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor: '#EBF4FF' }]}>
              <Text style={styles.statNumber}>{stats.total}</Text>
              <Text style={styles.statLabel}>Total Records</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: '#FEF3C7' }]}>
              <Text style={[styles.statNumber, { color: '#F59E0B' }]}>{stats.ongoing}</Text>
              <Text style={styles.statLabel}>Ongoing</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: '#ECFDF5' }]}>
              <Text style={[styles.statNumber, { color: '#22C55E' }]}>{stats.recovered}</Text>
              <Text style={styles.statLabel}>Recovered</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: '#EFF6FF' }]}>
              <Text style={[styles.statNumber, { color: '#3B82F6' }]}>{stats.followUp}</Text>
              <Text style={styles.statLabel}>Follow-up</Text>
            </View>
          </View>
        </View>

        {/* Filter Buttons */}
        <View style={styles.filterSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[
              { key: 'all', label: 'All' },
              { key: 'ongoing', label: 'Ongoing' },
              { key: 'recovered', label: 'Recovered' },
              { key: 'follow-up', label: 'Follow-up' }
            ].map((filter) => (
              <TouchableOpacity
                key={filter.key}
                style={[
                  styles.filterButton,
                  filterStatus === filter.key && styles.activeFilterButton
                ]}
                onPress={() => setFilterStatus(filter.key as any)}
              >
                <Text style={[
                  styles.filterText,
                  filterStatus === filter.key && styles.activeFilterText
                ]}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Records List */}
        <View style={styles.recordsSection}>
          <Text style={styles.sectionTitle}>Medical Records</Text>
          {filteredRecords.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>📋</Text>
              <Text style={styles.emptyStateTitle}>No Records Found</Text>
              <Text style={styles.emptyStateText}>
                No records match your current filter
              </Text>
            </View>
          ) : (
            filteredRecords.map((record) => (
              <TouchableOpacity
                key={record.id}
                style={styles.recordCard}
                onPress={() => openRecordDetails(record)}
                activeOpacity={0.8}
              >
                <View style={styles.recordHeader}>
                  <View style={styles.recordTitleSection}>
                    <Text style={styles.recordDisease}>{record.disease}</Text>
                    <Text style={styles.recordDate}>
                      {new Date(record.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </Text>
                  </View>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(record.status) + '20' }
                  ]}>
                    <Ionicons 
                      name={getStatusIcon(record.status)} 
                      size={14} 
                      color={getStatusColor(record.status)} 
                    />
                    <Text style={[
                      styles.statusText,
                      { color: getStatusColor(record.status) }
                    ]}>
                      {record.status.toUpperCase()}
                    </Text>
                  </View>
                </View>
                
                <Text style={styles.recordDoctor}>Dr. {record.doctor}</Text>
                
                <View style={styles.recordFooter}>
                  <Text style={styles.symptomsPreview}>
                    {record.symptoms.slice(0, 2).join(', ')}
                    {record.symptoms.length > 2 && '...'}
                  </Text>
                  <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                </View>
                
                {record.nextVisit && (
                  <View style={styles.nextVisitBanner}>
                    <Ionicons name="calendar" size={14} color={PRIMARY_BLUE} />
                    <Text style={styles.nextVisitText}>
                      Next visit: {new Date(record.nextVisit).toLocaleDateString()}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {/* Record Details Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={24} color={PRIMARY_BLUE} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Medical Record</Text>
            <TouchableOpacity>
              <Ionicons name="share-outline" size={24} color={PRIMARY_BLUE} />
            </TouchableOpacity>
          </View>
          
          {selectedRecord && (
            <ScrollView style={styles.modalContent}>
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Disease Information</Text>
                <Text style={styles.modalDisease}>{selectedRecord.disease}</Text>
                <Text style={styles.modalDate}>
                  Diagnosed on {new Date(selectedRecord.date).toLocaleDateString()}
                </Text>
              </View>
              
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Doctor</Text>
                <Text style={styles.modalDoctor}>{selectedRecord.doctor}</Text>
              </View>
              
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Symptoms</Text>
                {selectedRecord.symptoms.map((symptom, index) => (
                  <Text key={index} style={styles.modalSymptom}>• {symptom}</Text>
                ))}
              </View>
              
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Diagnosis</Text>
                <Text style={styles.modalDiagnosis}>{selectedRecord.diagnosis}</Text>
              </View>
              
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Prescription</Text>
                <Text style={styles.modalPrescription}>{selectedRecord.prescription}</Text>
              </View>
              
              {selectedRecord.nextVisit && (
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Next Visit</Text>
                  <Text style={styles.modalNextVisit}>
                    {new Date(selectedRecord.nextVisit).toLocaleDateString()}
                  </Text>
                </View>
              )}
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFF',
  },
  header: {
    backgroundColor: PRIMARY_BLUE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: WHITE,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  logoutButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  profileSection: {
    backgroundColor: WHITE,
    margin: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: LIGHT_BLUE,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
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
    color: '#1F2937',
    marginBottom: 4,
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
  statsSection: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: WHITE,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: PRIMARY_BLUE,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  filterSection: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: WHITE,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeFilterButton: {
    backgroundColor: PRIMARY_BLUE,
    borderColor: PRIMARY_BLUE,
  },
  filterText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  activeFilterText: {
    color: WHITE,
  },
  recordsSection: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: WHITE,
    borderRadius: 12,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  recordCard: {
    backgroundColor: WHITE,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  recordTitleSection: {
    flex: 1,
  },
  recordDisease: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  recordDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 4,
  },
  recordDoctor: {
    fontSize: 14,
    color: PRIMARY_BLUE,
    marginBottom: 8,
  },
  recordFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  symptomsPreview: {
    fontSize: 12,
    color: '#6B7280',
    flex: 1,
  },
  nextVisitBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: LIGHT_BLUE,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 8,
  },
  nextVisitText: {
    fontSize: 12,
    color: PRIMARY_BLUE,
    marginLeft: 6,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: WHITE,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  modalSection: {
    marginBottom: 24,
  },
  modalSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  modalDisease: {
    fontSize: 20,
    fontWeight: 'bold',
    color: PRIMARY_BLUE,
    marginBottom: 4,
  },
  modalDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  modalDoctor: {
    fontSize: 16,
    color: '#1F2937',
  },
  modalSymptom: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  modalDiagnosis: {
    fontSize: 16,
    color: '#1F2937',
    lineHeight: 24,
  },
  modalPrescription: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
  },
  modalNextVisit: {
    fontSize: 16,
    color: PRIMARY_BLUE,
    fontWeight: '500',
  },
});