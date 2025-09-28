@@ .. @@
 import { useLanguage } from '@/contexts/LanguageContext';

+const PRIMARY_BLUE = '#1976D2';
+const LIGHT_BLUE = '#E3F2FD';
+const WHITE = '#FFFFFF';
+
 interface PharmacyCardProps {
   pharmacy: Pharmacy;
   requiredMedicines?: string[];
@@ .. @@
   return (
     <View style={styles.container}>
       <View style={styles.header}>
-        <Text style={styles.name}>{pharmacy.name}</Text>
+        <View style={styles.nameContainer}>
+          <Text style={styles.pharmacyIcon}>🏪</Text>
+          <Text style={styles.name}>{pharmacy.name}</Text>
+        </View>
         <View style={styles.distance}>
           <Ionicons name="location" size={16} color="#6B7280" />
           <Text style={styles.distanceText}>{pharmacy.distance} km</Text>
         </View>
       </View>
       
-      <Text style={styles.address}>{pharmacy.address}</Text>
+      <Text style={styles.address}>📍 {pharmacy.address}</Text>
       
       {requiredMedicines.length > 0 && (
         <View style={styles.medicineStatus}>
-          <Text style={styles.medicineStatusTitle}>Medicine Availability:</Text>
+          <Text style={styles.medicineStatusTitle}>💊 Medicine Availability:</Text>
           {requiredMedicines.map((medicine) => (
             <View key={medicine} style={styles.medicineItem}>
               <Ionicons 
@@ .. @@
       
       <View style={styles.actions}>
         <TouchableOpacity style={[styles.actionButton, styles.callButton]} onPress={handleCall}>
-          <Ionicons name="call" size={20} color="white" />
+          <Ionicons name="call" size={18} color="white" />
           <Text style={styles.actionButtonText}>Call</Text>
         </TouchableOpacity>
         
         <TouchableOpacity style={[styles.actionButton, styles.navigationButton]} onPress={handleNavigate}>
-          <Ionicons name="navigate" size={20} color="white" />
+          <Ionicons name="navigate" size={18} color="white" />
           <Text style={styles.actionButtonText}>Navigate</Text>
         </TouchableOpacity>
       </View>
@@ .. @@
 const styles = StyleSheet.create({
   container: {
-    backgroundColor: 'white',
+    backgroundColor: WHITE,
     borderRadius: 12,
     padding: 16,
     marginVertical: 8,
     marginHorizontal: 16,
-    elevation: 2,
+    elevation: 3,
     shadowOffset: { width: 0, height: 2 },
     shadowOpacity: 0.1,
-    shadowRadius: 3.84,
+    shadowRadius: 4,
   },
   header: {
     flexDirection: 'row',
@@ -1,6 +1,12 @@
     alignItems: 'center',
     marginBottom: 8,
   },
+  nameContainer: {
+    flexDirection: 'row',
+    alignItems: 'center',
+    flex: 1,
+  },
+  pharmacyIcon: {
+    fontSize: 20,
+    marginRight: 8,
+  },
   name: {
     fontSize: 16,
     fontWeight: '600',
-    color: '#111827',
-    flex: 1,
+    color: PRIMARY_BLUE,
   },
   distance: {
     flexDirection: 'row',
@@ .. @@
   medicineStatusTitle: {
     fontSize: 14,
     fontWeight: '500',
-    color: '#374151',
+    color: PRIMARY_BLUE,
     marginBottom: 8,
   },
   medicineItem: {
@@ .. @@
   callButton: {
-    backgroundColor: '#22C55E',
+    backgroundColor: PRIMARY_BLUE,
   },
   navigationButton: {
-    backgroundColor: '#3B82F6',
+    backgroundColor: '#22C55E',
   },
   actionButtonText: {
     marginLeft: 8,