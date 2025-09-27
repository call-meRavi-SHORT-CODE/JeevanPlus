@@ .. @@
 import React from 'react';
-import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
+import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput } from 'react-native';
 import { useRouter, useLocalSearchParams } from 'expo-router';
 import { Ionicons } from '@expo/vector-icons';
+import { SafeAreaView } from 'react-native-safe-area-context';
 import { MOCK_DOCTORS } from '../../../constants/mockData';
 import { Doctor } from '../../../types';

@@ .. @@
 export default function DoctorsScreen() {
   const router = useRouter();
   const params = useLocalSearchParams();
-  const specialty = params.specialty;
+  const specialty = params.specialty;
+  const specialtyName = params.name;

   // Filter doctors by specialty if provided
@@ .. @@
   const renderDoctor = ({ item }: { item: Doctor }) => (
     <TouchableOpacity
       style={styles.card}
-      onPress={() => router.push(`/doctors/DoctorChatScreen?doctorId=${item.id}`)}
+      onPress={() => router.push(`/DoctorChatScreen?doctor=${encodeURIComponent(JSON.stringify(item))}`)}
       activeOpacity={0.85}
     >
-      {/* Use a placeholder image if item.image is not present */}
-      <Image source={{ uri: item.image || 'https://via.placeholder.com/60x60?text=Dr' }} style={styles.avatar} />
+      <View style={styles.avatar}>
+        <Text style={styles.avatarText}>
+          {item.gender === 'female' ? '👩‍⚕️' : '👨‍⚕️'}
+        </Text>
+      </View>
       <View style={styles.infoContainer}>
         <Text style={styles.name}>{item.name}</Text>
         <Text style={styles.specialty}>{item.specialization}</Text>
-        <Text style={styles.experience}>{item.rating} ★ rating</Text>
+        <View style={styles.ratingContainer}>
+          <Ionicons name="star" size={14} color="#F59E0B" />
+          <Text style={styles.rating}>{item.rating}</Text>
+          <Text style={styles.experience}>• 5+ years exp</Text>
+        </View>
         <View style={styles.row}>
           <Ionicons name="location" size={14} color="#757575" style={{ marginRight: 3 }} />
           <Text style={styles.location}>{item.languages.join(', ')}</Text>
         </View>
+        <View style={styles.availabilityContainer}>
+          <View style={[styles.statusDot, { backgroundColor: item.available ? '#22C55E' : '#EF4444' }]} />
+          <Text style={[styles.availability, { color: item.available ? '#22C55E' : '#EF4444' }]}>
+            {item.available ? 'Available Now' : 'Not Available'}
+          </Text>
+        </View>
       </View>
-      <Ionicons name="chevron-forward" size={22} color={PRIMARY_BLUE} style={styles.chevron} />
+      <View style={styles.rightSection}>
+        <Text style={styles.consultFee}>₹299</Text>
+        <Ionicons name="chevron-forward" size={20} color={PRIMARY_BLUE} />
+      </View>
     </TouchableOpacity>
   );

   return (
-    <View style={styles.container}>
-      <Text style={styles.headerTitle}>Find a Doctor</Text>
+    <SafeAreaView style={styles.container}>
+      {/* Header */}
+      <View style={styles.header}>
+        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
+          <Ionicons name="arrow-back" size={24} color={WHITE} />
+        </TouchableOpacity>
+        <Text style={styles.headerTitle}>{specialtyName || 'Find a Doctor'}</Text>
+        <View style={styles.headerRight} />
+      </View>
+
+      {/* Search Bar */}
+      <View style={styles.searchContainer}>
+        <Ionicons name="search" size={20} color="#9CA3AF" />
+        <TextInput
+          style={styles.searchInput}
+          placeholder="Search doctors by name or specialty"
+          placeholderTextColor="#9CA3AF"
+        />
+        <TouchableOpacity style={styles.filterButton}>
+          <Ionicons name="options" size={20} color={PRIMARY_BLUE} />
+        </TouchableOpacity>
+      </View>
+
+      <View style={styles.resultsHeader}>
+        <Text style={styles.resultsCount}>{filteredDoctors.length} doctors available</Text>
+        <TouchableOpacity style={styles.sortButton}>
+          <Text style={styles.sortText}>Sort by</Text>
+          <Ionicons name="chevron-down" size={16} color={PRIMARY_BLUE} />
+        </TouchableOpacity>
+      </View>
+
       <FlatList
         data={filteredDoctors}
         keyExtractor={(item) => String(item.id)}
         renderItem={renderDoctor}
-        contentContainerStyle={{ paddingBottom: 30 }}
+        contentContainerStyle={styles.listContainer}
         showsVerticalScrollIndicator={false}
       />
-    </View>
+    </SafeAreaView>
   );
 }

@@ .. @@
   container: {
     flex: 1,
     backgroundColor: WHITE,
-    paddingHorizontal: 16,
-    paddingTop: 18,
   },
-  headerTitle: {
-    fontSize: 22,
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
+  headerRight: {
+    width: 32,
+  },
+  searchContainer: {
+    flexDirection: 'row',
+    alignItems: 'center',
+    backgroundColor: '#F3F4F6',
+    margin: 16,
+    borderRadius: 12,
+    paddingHorizontal: 16,
+    paddingVertical: 12,
+  },
+  searchInput: {
+    flex: 1,
+    marginLeft: 12,
+    fontSize: 16,
+    color: '#1F2937',
+  },
+  filterButton: {
+    padding: 4,
+  },
+  resultsHeader: {
+    flexDirection: 'row',
+    justifyContent: 'space-between',
+    alignItems: 'center',
+    paddingHorizontal: 16,
+    marginBottom: 8,
+  },
+  resultsCount: {
+    fontSize: 14,
+    color: '#6B7280',
+  },
+  sortButton: {
+    flexDirection: 'row',
+    alignItems: 'center',
+  },
+  sortText: {
+    fontSize: 14,
+    color: PRIMARY_BLUE,
     fontWeight: 'bold',
-    color: PRIMARY_BLUE,
-    marginBottom: 18,
-    textAlign: 'left',
+    marginRight: 4,
+  },
+  listContainer: {
+    paddingBottom: 30,
   },
   card: {
     flexDirection: 'row',
     alignItems: 'center',
-    backgroundColor: '#F5F8FF',
+    backgroundColor: WHITE,
     borderRadius: 14,
-    padding: 14,
-    marginBottom: 14,
-    elevation: 1,
+    padding: 16,
+    marginHorizontal: 16,
+    marginBottom: 12,
+    elevation: 2,
     shadowColor: '#000',
-    shadowOffset: { width: 0, height: 1 },
-    shadowOpacity: 0.06,
-    shadowRadius: 2,
+    shadowOffset: { width: 0, height: 2 },
+    shadowOpacity: 0.1,
+    shadowRadius: 4,
   },
   avatar: {
     width: 60,
     height: 60,
     borderRadius: 30,
-    marginRight: 14,
-    backgroundColor: '#E3F2FD',
+    backgroundColor: LIGHT_BLUE,
+    justifyContent: 'center',
+    alignItems: 'center',
+    marginRight: 12,
+  },
+  avatarText: {
+    fontSize: 28,
   },
   infoContainer: {
     flex: 1,
@@ .. @@
   name: {
     fontSize: 16,
-    fontWeight: '700',
-    color: '#222',
-    marginBottom: 2,
+    fontWeight: '600',
+    color: '#1F2937',
+    marginBottom: 4,
   },
   specialty: {
-    fontSize: 13,
-    color: '#1976D2',
-    marginBottom: 2,
+    fontSize: 14,
+    color: PRIMARY_BLUE,
+    marginBottom: 4,
+  },
+  ratingContainer: {
+    flexDirection: 'row',
+    alignItems: 'center',
+    marginBottom: 4,
+  },
+  rating: {
+    fontSize: 12,
+    fontWeight: '500',
+    color: '#374151',
+    marginLeft: 2,
   },
   experience: {
     fontSize: 12,
-    color: '#757575',
-    marginBottom: 2,
+    color: '#6B7280',
+    marginLeft: 4,
   },
   row: {
     flexDirection: 'row',
     alignItems: 'center',
+    marginBottom: 4,
   },
   location: {
     fontSize: 12,
-    color: '#757575',
+    color: '#6B7280',
+  },
+  availabilityContainer: {
+    flexDirection: 'row',
+    alignItems: 'center',
+  },
+  statusDot: {
+    width: 8,
+    height: 8,
+    borderRadius: 4,
+    marginRight: 6,
+  },
+  availability: {
+    fontSize: 12,
+    fontWeight: '500',
+  },
+  rightSection: {
+    alignItems: 'flex-end',
+    justifyContent: 'center',
   },
-  chevron: {
-    marginLeft: 8,
+  consultFee: {
+    fontSize: 14,
+    fontWeight: '600',
+    color: '#22C55E',
+    marginBottom: 8,
   },
 });