import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MOCK_DOCTORS } from '../../../constants/mockData';
import { Doctor } from '../../../types';

const PRIMARY_BLUE = '#1976D2';
const LIGHT_BLUE = '#E3F2FD';
const WHITE = '#FFFFFF';

export default function DoctorsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  const specialty = params.specialty;
  const specialtyName = params.name;

  // Filter doctors by specialty if provided
  let filteredDoctors = specialty
    ? MOCK_DOCTORS.filter((doc: Doctor) => 
        doc.specialization?.toLowerCase().includes(String(specialty).toLowerCase())
      )
    : MOCK_DOCTORS;

  // Apply search filter
  if (searchQuery) {
    filteredDoctors = filteredDoctors.filter((doc: Doctor) =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Apply availability filter
  if (selectedFilter === 'available') {
    filteredDoctors = filteredDoctors.filter((doc: Doctor) => doc.available);
  }

  const filters = [
    { key: 'all', label: 'All Doctors' },
    { key: 'available', label: 'Available Now' },
    { key: 'video', label: 'Video Call' },
    { key: 'chat', label: 'Chat' }
  ];

  const renderDoctor = ({ item }: { item: Doctor }) => (
    <TouchableOpacity
      style={styles.doctorCard}
      onPress={() => router.push(`/DoctorChatScreen?doctorId=${item.id}&doctor=${encodeURIComponent(JSON.stringify(item))}`)}
      activeOpacity={0.8}
    >
      <View style={styles.doctorHeader}>
        <Image 
          source={{ uri: item.image || 'https://via.placeholder.com/60x60?text=Dr' }} 
          style={styles.doctorAvatar} 
        />
        <View style={styles.doctorInfo}>
          <Text style={styles.doctorName}>{item.name}</Text>
          <Text style={styles.doctorSpecialty}>{item.specialization}</Text>
          <View style={styles.doctorMeta}>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={14} color="#F59E0B" />
              <Text style={styles.rating}>{item.rating}</Text>
            </View>
            <Text style={styles.experience}>8+ years exp</Text>
          </View>
          <View style={styles.languagesContainer}>
            <Ionicons name="language" size={12} color="#6B7280" />
            <Text style={styles.languages}>{item.languages.join(', ')}</Text>
          </View>
        </View>
        <View style={styles.doctorRight}>
          <View style={[
            styles.availabilityBadge,
            { backgroundColor: item.available ? '#ECFDF5' : '#FEE2E2' }
          ]}>
            <View style={[
              styles.availabilityDot,
              { backgroundColor: item.available ? '#22C55E' : '#EF4444' }
            ]} />
            <Text style={[
              styles.availabilityText,
              { color: item.available ? '#22C55E' : '#EF4444' }
            ]}>
              {item.available ? 'Available' : 'Busy'}
            </Text>
          </View>
          <Text style={styles.consultationFee}>₹299</Text>
        </View>
      </View>
      
      <View style={styles.consultationModes}>
        {item.consultationModes.map((mode) => (
          <View key={mode} style={styles.modeChip}>
            <Ionicons 
              name={
                mode === 'video' ? 'videocam' : 
                mode === 'audio' ? 'call' : 'chatbubbles'
              } 
              size={14} 
              color={PRIMARY_BLUE} 
            />
            <Text style={styles.modeText}>
              {mode === 'video' ? 'Video' : mode === 'audio' ? 'Audio' : 'Chat'}
            </Text>
          </View>
        ))}
      </View>
      
      <View style={styles.cardFooter}>
        <Text style={styles.nextAvailable}>Next available: 2:30 PM today</Text>
        <TouchableOpacity style={styles.consultButton}>
          <Text style={styles.consultButtonText}>Consult Now</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={WHITE} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>
            {specialtyName ? `${specialtyName} Doctors` : 'Find a Doctor'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {filteredDoctors.length} doctors available
          </Text>
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={24} color={WHITE} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search doctors, specialties..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filtersSection}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={filters}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterTab,
                selectedFilter === item.key && styles.activeFilterTab
              ]}
              onPress={() => setSelectedFilter(item.key)}
            >
              <Text style={[
                styles.filterTabText,
                selectedFilter === item.key && styles.activeFilterTabText
              ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.filtersContent}
        />
      </View>

      {/* Doctors List */}
      <FlatList
        data={filteredDoctors}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderDoctor}
        contentContainerStyle={styles.doctorsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>👨‍⚕️</Text>
            <Text style={styles.emptyStateTitle}>No Doctors Found</Text>
            <Text style={styles.emptyStateText}>
              Try adjusting your search or filters
            </Text>
          </View>
        )}
      />
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
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: WHITE,
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  filterButton: {
    marginLeft: 12,
  },
  searchSection: {
    backgroundColor: WHITE,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  filtersSection: {
    backgroundColor: WHITE,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filtersContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  activeFilterTab: {
    backgroundColor: PRIMARY_BLUE,
  },
  filterTabText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  activeFilterTabText: {
    color: WHITE,
  },
  doctorsList: {
    padding: 16,
  },
  doctorCard: {
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  doctorHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  doctorAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: LIGHT_BLUE,
    marginRight: 12,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: PRIMARY_BLUE,
    marginBottom: 6,
  },
  doctorMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  rating: {
    fontSize: 12,
    color: '#374151',
    marginLeft: 2,
    fontWeight: '500',
  },
  experience: {
    fontSize: 12,
    color: '#6B7280',
  },
  languagesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languages: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  doctorRight: {
    alignItems: 'flex-end',
  },
  availabilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  availabilityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  availabilityText: {
    fontSize: 10,
    fontWeight: '600',
  },
  consultationFee: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#22C55E',
  },
  consultationModes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  modeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: LIGHT_BLUE,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  modeText: {
    marginLeft: 4,
    fontSize: 12,
    color: PRIMARY_BLUE,
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nextAvailable: {
    fontSize: 12,
    color: '#22C55E',
    fontWeight: '500',
  },
  consultButton: {
    backgroundColor: PRIMARY_BLUE,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  consultButtonText: {
    fontSize: 12,
    color: WHITE,
    fontWeight: '600',
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
});