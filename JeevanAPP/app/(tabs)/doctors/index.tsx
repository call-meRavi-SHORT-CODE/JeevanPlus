import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MOCK_DOCTORS } from '../../../constants/mockData';
import { Doctor } from '../../../types';

const PRIMARY_BLUE = '#1976D2';
const ACCENT_BLUE = '#2196F3';
const WHITE = '#FFFFFF';

export default function DoctorsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const specialty = params.specialty;

  // Filter doctors by specialty if provided
  const filteredDoctors = specialty
    ? MOCK_DOCTORS.filter((doc: Doctor) => doc.specialization?.toLowerCase().includes(String(specialty).toLowerCase()))
    : MOCK_DOCTORS;

  const renderDoctor = ({ item }: { item: Doctor }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/doctors/DoctorChatScreen?doctorId=${item.id}`)}
      activeOpacity={0.85}
    >
      {/* Use a placeholder image if item.image is not present */}
      <Image source={{ uri: item.image || 'https://via.placeholder.com/60x60?text=Dr' }} style={styles.avatar} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.specialty}>{item.specialization}</Text>
        <Text style={styles.experience}>{item.rating} ★ rating</Text>
        <View style={styles.row}>
          <Ionicons name="location" size={14} color="#757575" style={{ marginRight: 3 }} />
          <Text style={styles.location}>{item.languages.join(', ')}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={22} color={PRIMARY_BLUE} style={styles.chevron} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Find a Doctor</Text>
      <FlatList
        data={filteredDoctors}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderDoctor}
        contentContainerStyle={{ paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
    paddingHorizontal: 16,
    paddingTop: 18,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: PRIMARY_BLUE,
    marginBottom: 18,
    textAlign: 'left',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F8FF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 14,
    backgroundColor: '#E3F2FD',
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
    marginBottom: 2,
  },
  specialty: {
    fontSize: 13,
    color: '#1976D2',
    marginBottom: 2,
  },
  experience: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 12,
    color: '#757575',
  },
  chevron: {
    marginLeft: 8,
  },
});
