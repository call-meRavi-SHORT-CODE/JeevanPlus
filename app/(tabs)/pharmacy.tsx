@@ .. @@
 import React, { useState } from 'react';
-import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
+import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
 import { useRouter } from 'expo-router';
-import { Header } from '@/components/common/Header';
+import { Ionicons } from '@expo/vector-icons';
+import { SafeAreaView } from 'react-native-safe-area-context';
 import { PharmacyCard } from '@/components/cards/PharmacyCard';
-import { VoiceButton } from '@/components/common/VoiceButton';
 import { useLanguage } from '@/contexts/LanguageContext';
 import { MOCK_PHARMACIES } from '@/constants/mockData';

+const PRIMARY_BLUE = '#1976D2';
+const LIGHT_BLUE = '#E3F2FD';
+const WHITE = '#FFFFFF';
+
 export default function PharmacyScreen() {
   const [searchMedicine, setSearchMedicine] = useState('');
   const [requiredMedicines, setRequiredMedicines] = useState<string[]>([]);

@@ .. @@
   const sortedPharmacies = MOCK_PHARMACIES.sort((a, b) => a.distance - b.distance);

   return (
-    <View style={styles.container}>
-      <Header 
-        title={t('pharmacyFinder')} 
-        showHome
-        onHome={() => router.push('/')}
-      />
+    <SafeAreaView style={styles.container}>
+      {/* Header */}
+      <View style={styles.header}>
+        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
+          <Ionicons name="arrow-back" size={24} color={WHITE} />
+        </TouchableOpacity>
+        <Text style={styles.headerTitle}>Find Pharmacy</Text>
+        <TouchableOpacity onPress={() => router.push('/')} style={styles.homeButton}>
+          <Ionicons name="home" size={24} color={WHITE} />
+        </TouchableOpacity>
+      </View>
       
       <View style={styles.searchSection}>
-        <Text style={styles.sectionTitle}>Find Medicine</Text>
+        <Text style={styles.sectionTitle}>🏥 Find Medicine</Text>
         <View style={styles.searchContainer}>
           <TextInput
             style={styles.searchInput}
             value={searchMedicine}
             onChangeText={setSearchMedicine}
-            placeholder="Enter medicine name..."
+            placeholder="Search for medicines..."
+            placeholderTextColor="#9CA3AF"
             onSubmitEditing={handleAddMedicine}
           />
-          <VoiceButton 
-            type="listen" 
-            onVoiceInput={(input) => setSearchMedicine(input)} 
-            size={20}
-          />
+          <TouchableOpacity style={styles.addButton} onPress={handleAddMedicine}>
+            <Ionicons name="add" size={20} color={PRIMARY_BLUE} />
+          </TouchableOpacity>
         </View>
         
         {requiredMedicines.length > 0 && (
           <View style={styles.medicinesList}>
-            <Text style={styles.medicinesTitle}>Required Medicines:</Text>
+            <Text style={styles.medicinesTitle}>💊 Required Medicines:</Text>
             <View style={styles.medicinesChips}>
               {requiredMedicines.map((medicine) => (
                 <View key={medicine} style={styles.medicineChip}>
                   <Text style={styles.medicineChipText}>{medicine}</Text>
-                  <Text 
+                  <TouchableOpacity 
                     style={styles.removeChip}
-                    onPress={() => handleRemoveMedicine(medicine)}
+                    onPress={() => handleRemoveMedicine(medicine)}
                   >
-                    ×
-                  </Text>
+                    <Ionicons name="close" size={16} color="#EF4444" />
+                  </TouchableOpacity>
                 </View>
               ))}
             </View>
           </View>
         )}

-        <View style={styles.voiceSection}>
-          <VoiceButton 
-            text={`${sortedPharmacies.length} pharmacies found near you in Nabha`} 
-          />
+        <View style={styles.infoCard}>
+          <Ionicons name="location" size={20} color={PRIMARY_BLUE} />
+          <Text style={styles.infoText}>
+            {sortedPharmacies.length} pharmacies found near you in Nabha
+          </Text>
         </View>
       </View>

       <ScrollView style={styles.pharmaciesList}>
-        <Text style={styles.listTitle}>Nearby Pharmacies</Text>
+        <Text style={styles.listTitle}>🏪 Nearby Pharmacies</Text>
         {sortedPharmacies.map((pharmacy) => (
           <PharmacyCard
             key={pharmacy.id}
@@ .. @@
         
         <View style={styles.infoSection}>
-          <Text style={styles.infoTitle}>💡 Tips</Text>
+          <Text style={styles.infoTitle}>💡 Helpful Tips</Text>
           <Text style={styles.infoText}>
             • Call before visiting to confirm medicine availability
           </Text>
@@ .. @@
           </Text>
         </View>
       </ScrollView>
-    </View>
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
   },
   searchSection: {
-    backgroundColor: 'white',
+    backgroundColor: LIGHT_BLUE,
     padding: 16,
-    borderBottomWidth: 1,
-    borderBottomColor: '#E5E7EB',
   },
   sectionTitle: {
     fontSize: 18,
     fontWeight: '600',
-    color: '#111827',
+    color: PRIMARY_BLUE,
     marginBottom: 12,
   },
   searchContainer: {
     flexDirection: 'row',
     alignItems: 'center',
-    gap: 12,
+    backgroundColor: WHITE,
+    borderRadius: 12,
+    paddingHorizontal: 16,
+    paddingVertical: 4,
     marginBottom: 16,
+    elevation: 2,
+    shadowColor: '#000',
+    shadowOffset: { width: 0, height: 1 },
+    shadowOpacity: 0.1,
+    shadowRadius: 2,
   },
   searchInput: {
     flex: 1,
-    height: 48,
-    borderWidth: 1,
-    borderColor: '#D1D5DB',
-    borderRadius: 8,
-    paddingHorizontal: 12,
+    height: 44,
     fontSize: 16,
-    backgroundColor: '#F9FAFB',
+    color: '#1F2937',
+  },
+  addButton: {
+    padding: 8,
   },
   medicinesList: {
     marginBottom: 16,
@@ .. @@
   medicinesTitle: {
     fontSize: 14,
     fontWeight: '500',
-    color: '#374151',
+    color: PRIMARY_BLUE,
     marginBottom: 8,
   },
   medicinesChips: {
@@ .. @@
   medicineChip: {
     flexDirection: 'row',
     alignItems: 'center',
-    backgroundColor: '#EBF4FF',
+    backgroundColor: WHITE,
     paddingHorizontal: 12,
-    paddingVertical: 6,
+    paddingVertical: 8,
     borderRadius: 16,
+    elevation: 1,
+    shadowColor: '#000',
+    shadowOffset: { width: 0, height: 1 },
+    shadowOpacity: 0.1,
+    shadowRadius: 1,
   },
   medicineChipText: {
     fontSize: 14,
-    color: '#3B82F6',
+    color: PRIMARY_BLUE,
     marginRight: 8,
+    fontWeight: '500',
   },
   removeChip: {
-    fontSize: 18,
-    color: '#EF4444',
-    fontWeight: 'bold',
+    padding: 2,
   },
-  voiceSection: {
-    alignItems: 'center',
+  infoCard: {
+    flexDirection: 'row',
+    alignItems: 'center',
+    backgroundColor: WHITE,
+    padding: 12,
+    borderRadius: 8,
+    elevation: 1,
+    shadowColor: '#000',
+    shadowOffset: { width: 0, height: 1 },
+    shadowOpacity: 0.1,
+    shadowRadius: 1,
+  },
+  infoText: {
+    marginLeft: 8,
+    fontSize: 14,
+    color: PRIMARY_BLUE,
+    fontWeight: '500',
   },
   pharmaciesList: {
     flex: 1,
+    backgroundColor: '#F8F9FA',
   },
   listTitle: {
     fontSize: 18,
     fontWeight: '600',
-    color: '#111827',
+    color: PRIMARY_BLUE,
     margin: 16,
     marginBottom: 8,
   },
   infoSection: {
-    backgroundColor: 'white',
+    backgroundColor: WHITE,
     margin: 16,
     padding: 16,
     borderRadius: 12,
     borderLeftWidth: 4,
-    borderLeftColor: '#3B82F6',
+    borderLeftColor: PRIMARY_BLUE,
+    elevation: 2,
+    shadowColor: '#000',
+    shadowOffset: { width: 0, height: 1 },
+    shadowOpacity: 0.1,
+    shadowRadius: 2,
   },
   infoTitle: {
     fontSize: 16,
     fontWeight: '600',
-    color: '#111827',
+    color: PRIMARY_BLUE,
     marginBottom: 12,
   },
-  infoText: {
+  infoSection: {
     fontSize: 14,
     color: '#6B7280',
     marginBottom: 4,
     lineHeight: 20,
-  }
+  },
 });