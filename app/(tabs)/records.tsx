@@ .. @@
 import React, { useState, useEffect } from 'react';
-import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
+import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
 import { useRouter } from 'expo-router';
 import { Ionicons } from '@expo/vector-icons';
-import { Header } from '@/components/common/Header';
-import { VoiceButton } from '@/components/common/VoiceButton';
+import { SafeAreaView } from 'react-native-safe-area-context';
 import { useLanguage } from '@/contexts/LanguageContext';
 import { useAuth } from '@/contexts/AuthContext';
-import StorageService from '@/services/storageService';
-import { Consultation } from '@/types';
+
+const PRIMARY_BLUE = '#1976D2';
+const LIGHT_BLUE = '#E3F2FD';
+const WHITE = '#FFFFFF';
+
+// Mock health records data
+const MOCK_HEALTH_RECORDS = [
+  {
+    id: '1',
+    diseaseName: 'Hypertension',
+    date: '2024-01-15',
+    doctor: 'Dr. Manjeet Singh',
+    prescription: 'Amlodipine 5mg once daily, Low sodium diet, Regular exercise',
+    status: 'ongoing',
+    severity: 'moderate'
+  },
+  {
+    id: '2',
+    diseaseName: 'Common Cold',
+    date: '2024-01-10',
+    doctor: 'Dr. Simran Kaur',
+    prescription: 'Paracetamol 500mg twice daily, Rest, Warm water gargling',
+    status: 'recovered',
+    severity: 'mild'
+  },
+  {
+    id: '3',
+    diseaseName: 'Diabetes Type 2',
+    date: '2024-01-05',
+    doctor: 'Dr. Rajesh Kumar',
+    prescription: 'Metformin 500mg twice daily, Sugar-free diet, Regular monitoring',
+    status: 'ongoing',
+    severity: 'high'
+  },
+  {
+    id: '4',
+    diseaseName: 'Migraine',
+    date: '2023-12-28',
+    doctor: 'Dr. Preet Kaur',
+    prescription: 'Sumatriptan as needed, Avoid triggers, Stress management',
+    status: 'managed',
+    severity: 'moderate'
+  },
+  {
+    id: '5',
+    diseaseName: 'Gastritis',
+    date: '2023-12-20',
+    doctor: 'Dr. Manjeet Singh',
+    prescription: 'Omeprazole 20mg before meals, Avoid spicy food, Small frequent meals',
+    status: 'recovered',
+    severity: 'mild'
+  }
+];

 export default function RecordsScreen() {
-  const [consultations, setConsultations] = useState<Consultation[]>([]);
-  const [loading, setLoading] = useState(true);
+  const [selectedRecord, setSelectedRecord] = useState(null);

   const router = useRouter();
   const { t } = useLanguage();
   const { user, logout } = useAuth();

-  useEffect(() => {
-    loadConsultations();
-  }, []);
-
-  const loadConsultations = async () => {
-    try {
-      const records = await StorageService.getConsultations();
-      setConsultations(records);
-    } catch (error) {
-      console.error('Error loading consultations:', error);
-    } finally {
-      setLoading(false);
-    }
-  };
-
   const formatDate = (date: Date) => {
-    return new Date(date).toLocaleDateString('en-IN', {
+    return new Date(date).toLocaleDateString('en-US', {
       day: 'numeric',
       month: 'short',
       year: 'numeric'
     });
   };

-  const getStatusColor = (status: string) => {
+  const getStatusInfo = (status: string) => {
     switch (status) {
-      case 'completed': return '#22C55E';
-      case 'pending': return '#F59E0B';
-      case 'cancelled': return '#EF4444';
-      default: return '#6B7280';
+      case 'ongoing': return { color: '#F59E0B', text: 'Ongoing', icon: 'time' };
+      case 'recovered': return { color: '#22C55E', text: 'Recovered', icon: 'checkmark-circle' };
+      case 'managed': return { color: '#3B82F6', text: 'Managed', icon: 'medical' };
+      default: return { color: '#6B7280', text: 'Unknown', icon: 'help-circle' };
+    }
+  };
+
+  const getSeverityColor = (severity: string) => {
+    switch (severity) {
+      case 'high': return '#EF4444';
+      case 'moderate': return '#F59E0B';
+      case 'mild': return '#22C55E';
+      default: return '#6B7280';
     }
   };

+  const renderHealthRecord = ({ item }) => {
+    const statusInfo = getStatusInfo(item.status);
+    const severityColor = getSeverityColor(item.severity);
+
+    return (
+      <TouchableOpacity
+        style={styles.recordCard}
+        onPress={() => setSelectedRecord(item)}
+        activeOpacity={0.8}
+      >
+        <View style={styles.recordHeader}>
+          <View style={styles.recordTitleContainer}>
+            <Text style={styles.recordTitle}>{item.diseaseName}</Text>
+            <View style={[styles.severityBadge, { backgroundColor: severityColor + '20' }]}>
+              <Text style={[styles.severityText, { color: severityColor }]}>
+                {item.severity.toUpperCase()}
+              </Text>
+            </View>
+          </View>
+          <Text style={styles.recordDate}>{item.date}</Text>
+        </View>
+        
+        <View style={styles.recordBody}>
+          <Text style={styles.doctorName}>👨‍⚕️ {item.doctor}</Text>
+          <View style={styles.statusContainer}>
+            <Ionicons name={statusInfo.icon} size={16} color={statusInfo.color} />
+            <Text style={[styles.statusText, { color: statusInfo.color }]}>
+              {statusInfo.text}
+            </Text>
+          </View>
+        </View>
+        
+        <View style={styles.recordFooter}>
+          <Text style={styles.viewDetails}>View Prescription</Text>
+          <Ionicons name="chevron-forward" size={16} color={PRIMARY_BLUE} />
+        </View>
+      </TouchableOpacity>
+    );
+  };
+
+  if (selectedRecord) {
+    const statusInfo = getStatusInfo(selectedRecord.status);
+    const severityColor = getSeverityColor(selectedRecord.severity);
+
+    return (
+      <SafeAreaView style={styles.container}>
+        <View style={styles.header}>
+          <TouchableOpacity onPress={() => setSelectedRecord(null)} style={styles.backButton}>
+            <Ionicons name="arrow-back" size={24} color={WHITE} />
+          </TouchableOpacity>
+          <Text style={styles.headerTitle}>Health Record</Text>
+          <TouchableOpacity style={styles.shareButton}>
+            <Ionicons name="share-outline" size={24} color={WHITE} />
+          </TouchableOpacity>
+        </View>
+
+        <ScrollView style={styles.detailContainer}>
+          <View style={styles.detailCard}>
+            <View style={styles.detailHeader}>
+              <Text style={styles.detailTitle}>{selectedRecord.diseaseName}</Text>
+              <View style={[styles.severityBadge, { backgroundColor: severityColor + '20' }]}>
+                <Text style={[styles.severityText, { color: severityColor }]}>
+                  {selectedRecord.severity.toUpperCase()}
+                </Text>
+              </View>
+            </View>
+            
+            <View style={styles.detailInfo}>
+              <View style={styles.infoRow}>
+                <Ionicons name="calendar" size={20} color={PRIMARY_BLUE} />
+                <Text style={styles.infoLabel}>Date:</Text>
+                <Text style={styles.infoValue}>{selectedRecord.date}</Text>
+              </View>
+              
+              <View style={styles.infoRow}>
+                <Ionicons name="person" size={20} color={PRIMARY_BLUE} />
+                <Text style={styles.infoLabel}>Doctor:</Text>
+                <Text style={styles.infoValue}>{selectedRecord.doctor}</Text>
+              </View>
+              
+              <View style={styles.infoRow}>
+                <Ionicons name={statusInfo.icon} size={20} color={statusInfo.color} />
+                <Text style={styles.infoLabel}>Status:</Text>
+                <Text style={[styles.infoValue, { color: statusInfo.color }]}>
+                  {statusInfo.text}
+                </Text>
+              </View>
+            </View>
+          </View>
+
+          <View style={styles.prescriptionCard}>
+            <Text style={styles.prescriptionTitle}>💊 Prescription</Text>
+            <Text style={styles.prescriptionText}>{selectedRecord.prescription}</Text>
+          </View>
+
+          <View style={styles.actionButtons}>
+            <TouchableOpacity style={styles.actionButton}>
+              <Ionicons name="download-outline" size={20} color={PRIMARY_BLUE} />
+              <Text style={styles.actionButtonText}>Download</Text>
+            </TouchableOpacity>
+            <TouchableOpacity style={styles.actionButton}>
+              <Ionicons name="share-outline" size={20} color={PRIMARY_BLUE} />
+              <Text style={styles.actionButtonText}>Share</Text>
+            </TouchableOpacity>
+          </View>
+        </ScrollView>
+      </SafeAreaView>
+    );
+  }
+
   return (
-    <View style={styles.container}>
-      <Header 
-        title={t('healthRecords')} 
-        showHome
-        onHome={() => router.push('/')}
-      />
+    <SafeAreaView style={styles.container}>
+      <View style={styles.header}>
+        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
+          <Ionicons name="arrow-back" size={24} color={WHITE} />
+        </TouchableOpacity>
+        <Text style={styles.headerTitle}>Health Records</Text>
+        <TouchableOpacity onPress={() => router.push('/')} style={styles.homeButton}>
+          <Ionicons name="home" size={24} color={WHITE} />
+        </TouchableOpacity>
+      </View>
       
       <View style={styles.profileSection}>
         <View style={styles.profileInfo}>
           <View style={styles.avatar}>
-            <Text style={styles.avatarText}>👤</Text>
+            <Text style={styles.avatarText}>👨‍💼</Text>
           </View>
           <View style={styles.userInfo}>
             <Text style={styles.userName}>{user?.name || 'User'}</Text>
             <Text style={styles.userPhone}>{user?.phoneNumber}</Text>
-            <Text style={styles.userLocation}>{user?.location}</Text>
+            <Text style={styles.userLocation}>📍 {user?.location}</Text>
           </View>
           <TouchableOpacity style={styles.logoutButton} onPress={logout}>
             <Ionicons name="log-out-outline" size={20} color="#EF4444" />
           </TouchableOpacity>
         </View>
-        
-        <View style={styles.voiceSection}>
-          <VoiceButton 
-            text={`Your health records. You have ${consultations.length} consultations.`} 
-          />
+
+        <View style={styles.statsContainer}>
+          <View style={styles.statItem}>
+            <Text style={styles.statNumber}>{MOCK_HEALTH_RECORDS.length}</Text>
+            <Text style={styles.statLabel}>Total Records</Text>
+          </View>
+          <View style={styles.statItem}>
+            <Text style={styles.statNumber}>
+              {MOCK_HEALTH_RECORDS.filter(r => r.status === 'ongoing').length}
+            </Text>
+            <Text style={styles.statLabel}>Ongoing</Text>
+          </View>
+          <View style={styles.statItem}>
+            <Text style={styles.statNumber}>
+              {MOCK_HEALTH_RECORDS.filter(r => r.status === 'recovered').length}
+            </Text>
+            <Text style={styles.statLabel}>Recovered</Text>
+          </View>
         </View>
       </View>

-      <ScrollView style={styles.recordsList}>
-        <Text style={styles.sectionTitle}>Consultation History</Text>
-        
-        {loading ? (
-          <View style={styles.loadingContainer}>
-            <Text style={styles.loadingText}>Loading records...</Text>
-          </View>
-        ) : consultations.length === 0 ? (
-          <View style={styles.emptyState}>
-            <Text style={styles.emptyStateIcon}>📋</Text>
-            <Text style={styles.emptyStateTitle}>No Records Yet</Text>
-            <Text style={styles.emptyStateText}>
-              Your consultation history will appear here after your first visit
-            </Text>
-            <TouchableOpacity 
-              style={styles.consultButton}
-              onPress={() => router.push('/doctor-consultation')}
-            >
-              <Text style={styles.consultButtonText}>
-                Start Your First Consultation
-              </Text>
-            </TouchableOpacity>
-          </View>
-        ) : (
-          consultations.map((consultation) => (
-            <View key={consultation.id} style={styles.recordCard}>
-              <View style={styles.recordHeader}>
-                <Text style={styles.recordDate}>
-                  {formatDate(consultation.date)}
-                </Text>
-                <View style={[
-                  styles.statusBadge, 
-                  { backgroundColor: getStatusColor(consultation.status) + '20' }
-                ]}>
-                  <Text style={[
-                    styles.statusText, 
-                    { color: getStatusColor(consultation.status) }
-                  ]}>
-                    {consultation.status.toUpperCase()}
-                  </Text>
-                </View>
-              </View>
-              
-              <View style={styles.recordBody}>
-                <Text style={styles.recordSymptoms}>
-                  Symptoms: {consultation.symptoms.join(', ')}
-                </Text>
-                <Text style={styles.recordDiagnosis}>
-                  Diagnosis: {consultation.diagnosis}
-                </Text>
-                <Text style={styles.recordPrescription}>
-                  Prescription: {consultation.prescription}
-                </Text>
-              </View>
-              
-              <View style={styles.recordFooter}>
-                <View style={styles.consultationMode}>
-                  <Ionicons 
-                    name={
-                      consultation.mode === 'video' ? 'videocam' : 
-                      consultation.mode === 'audio' ? 'call' : 'chatbubbles'
-                    } 
-                    size={16} 
-                    color="#6B7280" 
-                  />
-                  <Text style={styles.modeText}>{consultation.mode}</Text>
-                </View>
-                
-                <TouchableOpacity style={styles.shareButton}>
-                  <Ionicons name="share-outline" size={16} color="#3B82F6" />
-                  <Text style={styles.shareText}>Share</Text>
-                </TouchableOpacity>
-              </View>
-            </View>
-          ))
-        )}
-        
-        <View style={styles.privacyNote}>
-          <Text style={styles.privacyTitle}>🔒 Privacy & Security</Text>
-          <Text style={styles.privacyText}>
-            All your health records are stored securely on your device and are not shared with anyone without your consent.
-          </Text>
-        </View>
-      </ScrollView>
-    </View>
+      <View style={styles.recordsList}>
+        <Text style={styles.sectionTitle}>📋 Medical History</Text>
+        <FlatList
+          data={MOCK_HEALTH_RECORDS}
+          keyExtractor={(item) => item.id}
+          renderItem={renderHealthRecord}
+          showsVerticalScrollIndicator={false}
+          contentContainerStyle={styles.listContainer}
+        />
+      </View>
+    </SafeAreaView>
   );
 }

@@ .. @@
   container: {
     flex: 1,
-    backgroundColor: '#F9FAFB',
+    backgroundColor: WHITE,
+  },
+  header: {
+    backgroundColor: PRIMARY_BLUE,
+    flexDirection: 'row',
+    alignItems: 'center',
+    justifyContent: 'space-between',
+    paddingHorizontal: 16,
+    paddingVertical: 12,
+  },
+  backButton: {
+    padding: 4,
+  },
+  headerTitle: {
+    fontSize: 18,
+    fontWeight: '600',
+    color: WHITE,
+    flex: 1,
+    textAlign: 'center',
+    marginHorizontal: 16,
+  },
+  homeButton: {
+    padding: 4,
+  },
+  shareButton: {
+    padding: 4,
   },
   profileSection: {
-    backgroundColor: 'white',
+    backgroundColor: LIGHT_BLUE,
     padding: 16,
-    borderBottomWidth: 1,
-    borderBottomColor: '#E5E7EB',
   },
   profileInfo: {
     flexDirection: 'row',
@@ .. @@
   avatar: {
     width: 60,
     height: 60,
     borderRadius: 30,
-    backgroundColor: '#F3F4F6',
+    backgroundColor: WHITE,
     justifyContent: 'center',
     alignItems: 'center',
     marginRight: 12,
+    elevation: 2,
+    shadowColor: '#000',
+    shadowOffset: { width: 0, height: 1 },
+    shadowOpacity: 0.1,
+    shadowRadius: 2,
   },
   avatarText: {
-    fontSize: 32,
+    fontSize: 28,
   },
   userInfo: {
     flex: 1,
@@ .. @@
   userName: {
     fontSize: 18,
     fontWeight: '600',
-    color: '#111827',
+    color: PRIMARY_BLUE,
     marginBottom: 2,
   },
   userPhone: {
@@ .. @@
   logoutButton: {
     padding: 8,
   },
-  voiceSection: {
-    alignItems: 'center',
+  statsContainer: {
+    flexDirection: 'row',
+    justifyContent: 'space-around',
+    marginTop: 16,
+    backgroundColor: WHITE,
+    borderRadius: 12,
+    padding: 16,
+    elevation: 2,
+    shadowColor: '#000',
+    shadowOffset: { width: 0, height: 1 },
+    shadowOpacity: 0.1,
+    shadowRadius: 2,
+  },
+  statItem: {
+    alignItems: 'center',
+  },
+  statNumber: {
+    fontSize: 24,
+    fontWeight: 'bold',
+    color: PRIMARY_BLUE,
+  },
+  statLabel: {
+    fontSize: 12,
+    color: '#6B7280',
+    marginTop: 4,
   },
   recordsList: {
     flex: 1,
+    backgroundColor: '#F8F9FA',
   },
   sectionTitle: {
     fontSize: 18,
     fontWeight: '600',
-    color: '#111827',
+    color: PRIMARY_BLUE,
     margin: 16,
     marginBottom: 8,
   },
-  loadingContainer: {
-    padding: 40,
-    alignItems: 'center',
-  },
-  loadingText: {
-    fontSize: 16,
-    color: '#6B7280',
-  },
-  emptyState: {
-    alignItems: 'center',
-    padding: 40,
-  },
-  emptyStateIcon: {
-    fontSize: 64,
-    marginBottom: 16,
-  },
-  emptyStateTitle: {
-    fontSize: 20,
-    fontWeight: '600',
-    color: '#111827',
-    marginBottom: 8,
-  },
-  emptyStateText: {
-    fontSize: 16,
-    color: '#6B7280',
-    textAlign: 'center',
-    marginBottom: 24,
-    lineHeight: 24,
-  },
-  consultButton: {
-    backgroundColor: '#22C55E',
-    paddingHorizontal: 24,
-    paddingVertical: 12,
-    borderRadius: 8,
+  listContainer: {
+    paddingBottom: 20,
   },
-  consultButtonText: {
-    fontSize: 16,
-    fontWeight: '600',
-    color: 'white',
-  },
   recordCard: {
-    backgroundColor: 'white',
+    backgroundColor: WHITE,
     marginHorizontal: 16,
-    marginVertical: 8,
+    marginVertical: 6,
     borderRadius: 12,
     padding: 16,
-    elevation: 2,
+    elevation: 3,
+    shadowColor: '#000',
     shadowOffset: { width: 0, height: 2 },
     shadowOpacity: 0.1,
-    shadowRadius: 3.84,
+    shadowRadius: 4,
   },
   recordHeader: {
-    flexDirection: 'row',
-    justifyContent: 'space-between',
-    alignItems: 'center',
     marginBottom: 12,
   },
-  recordDate: {
+  recordTitleContainer: {
+    flexDirection: 'row',
+    justifyContent: 'space-between',
+    alignItems: 'center',
+    marginBottom: 4,
+  },
+  recordTitle: {
     fontSize: 16,
     fontWeight: '600',
-    color: '#111827',
+    color: PRIMARY_BLUE,
+    flex: 1,
+  },
+  recordDate: {
+    fontSize: 12,
+    color: '#6B7280',
   },
-  statusBadge: {
+  severityBadge: {
     paddingHorizontal: 8,
     paddingVertical: 4,
-    borderRadius: 12,
+    borderRadius: 8,
   },
-  statusText: {
+  severityText: {
     fontSize: 12,
     fontWeight: '600',
   },
   recordBody: {
     marginBottom: 12,
   },
-  recordSymptoms: {
+  doctorName: {
     fontSize: 14,
-    color: '#374151',
+    color: '#1F2937',
     marginBottom: 4,
+    fontWeight: '500',
   },
-  recordDiagnosis: {
-    fontSize: 14,
-    color: '#374151',
-    marginBottom: 4,
+  statusContainer: {
+    flexDirection: 'row',
+    alignItems: 'center',
   },
-  recordPrescription: {
+  statusText: {
     fontSize: 14,
-    color: '#374151',
+    fontWeight: '500',
+    marginLeft: 6,
   },
   recordFooter: {
     flexDirection: 'row',
     justifyContent: 'space-between',
     alignItems: 'center',
   },
-  consultationMode: {
-    flexDirection: 'row',
-    alignItems: 'center',
-  },
-  modeText: {
-    marginLeft: 4,
+  viewDetails: {
     fontSize: 14,
-    color: '#6B7280',
-    textTransform: 'capitalize',
+    color: PRIMARY_BLUE,
+    fontWeight: '500',
   },
-  shareButton: {
+  
+  // Detail view styles
+  detailContainer: {
+    flex: 1,
+    backgroundColor: '#F8F9FA',
+  },
+  detailCard: {
+    backgroundColor: WHITE,
+    margin: 16,
+    borderRadius: 12,
+    padding: 20,
+    elevation: 3,
+    shadowColor: '#000',
+    shadowOffset: { width: 0, height: 2 },
+    shadowOpacity: 0.1,
+    shadowRadius: 4,
+  },
+  detailHeader: {
     flexDirection: 'row',
+    justifyContent: 'space-between',
     alignItems: 'center',
+    marginBottom: 20,
   },
-  shareText: {
-    marginLeft: 4,
-    fontSize: 14,
-    color: '#3B82F6',
+  detailTitle: {
+    fontSize: 20,
+    fontWeight: 'bold',
+    color: PRIMARY_BLUE,
+    flex: 1,
   },
-  privacyNote: {
-    backgroundColor: 'white',
+  detailInfo: {
+    gap: 12,
+  },
+  infoRow: {
+    flexDirection: 'row',
+    alignItems: 'center',
+  },
+  infoLabel: {
+    fontSize: 14,
+    fontWeight: '500',
+    color: '#374151',
+    marginLeft: 12,
+    minWidth: 60,
+  },
+  infoValue: {
+    fontSize: 14,
+    color: '#1F2937',
+    marginLeft: 8,
+    flex: 1,
+  },
+  prescriptionCard: {
+    backgroundColor: WHITE,
     margin: 16,
-    padding: 16,
     borderRadius: 12,
-    borderLeftWidth: 4,
-    borderLeftColor: '#22C55E',
+    padding: 20,
+    elevation: 3,
+    shadowColor: '#000',
+    shadowOffset: { width: 0, height: 2 },
+    shadowOpacity: 0.1,
+    shadowRadius: 4,
   },
-  privacyTitle: {
+  prescriptionTitle: {
     fontSize: 16,
     fontWeight: '600',
-    color: '#111827',
-    marginBottom: 8,
+    color: PRIMARY_BLUE,
+    marginBottom: 12,
   },
-  privacyText: {
+  prescriptionText: {
     fontSize: 14,
-    color: '#6B7280',
+    color: '#374151',
     lineHeight: 20,
-  }
+  },
+  actionButtons: {
+    flexDirection: 'row',
+    justifyContent: 'space-around',
+    margin: 16,
+  },
+  actionButton: {
+    flexDirection: 'row',
+    alignItems: 'center',
+    backgroundColor: WHITE,
+    paddingHorizontal: 20,
+    paddingVertical: 12,
+    borderRadius: 8,
+    elevation: 2,
+    shadowColor: '#000',
+    shadowOffset: { width: 0, height: 1 },
+    shadowOpacity: 0.1,
+    shadowRadius: 2,
+  },
+  actionButtonText: {
+    marginLeft: 8,
+    fontSize: 14,
+    fontWeight: '500',
+    color: PRIMARY_BLUE,
+  },
 });