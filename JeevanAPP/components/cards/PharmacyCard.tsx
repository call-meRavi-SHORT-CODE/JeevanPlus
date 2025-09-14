import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Pharmacy } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface PharmacyCardProps {
  pharmacy: Pharmacy;
  requiredMedicines?: string[];
}

export function PharmacyCard({ pharmacy, requiredMedicines = [] }: PharmacyCardProps) {
  const { t } = useLanguage();

  const handleCall = () => {
    Linking.openURL(`tel:${pharmacy.phone}`);
  };

  const handleNavigate = () => {
    const url = `https://maps.google.com/?q=${pharmacy.location.latitude},${pharmacy.location.longitude}`;
    Linking.openURL(url);
  };

  const getAvailabilityStatus = () => {
    if (requiredMedicines.length === 0) return 'unknown';
    
    const available = requiredMedicines.filter(med => pharmacy.medicines[med]).length;
    const total = requiredMedicines.length;
    
    if (available === total) return 'all';
    if (available > 0) return 'partial';
    return 'none';
  };

  const status = getAvailabilityStatus();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>{pharmacy.name}</Text>
        <View style={styles.distance}>
          <Ionicons name="location" size={16} color="#6B7280" />
          <Text style={styles.distanceText}>{pharmacy.distance} km</Text>
        </View>
      </View>
      
      <Text style={styles.address}>{pharmacy.address}</Text>
      
      {requiredMedicines.length > 0 && (
        <View style={styles.medicineStatus}>
          <Text style={styles.medicineStatusTitle}>Medicine Availability:</Text>
          {requiredMedicines.map((medicine) => (
            <View key={medicine} style={styles.medicineItem}>
              <Ionicons 
                name={pharmacy.medicines[medicine] ? 'checkmark-circle' : 'close-circle'} 
                size={16} 
                color={pharmacy.medicines[medicine] ? '#22C55E' : '#EF4444'} 
              />
              <Text style={styles.medicineName}>{medicine}</Text>
            </View>
          ))}
        </View>
      )}
      
      <View style={styles.actions}>
        <TouchableOpacity style={[styles.actionButton, styles.callButton]} onPress={handleCall}>
          <Ionicons name="call" size={20} color="white" />
          <Text style={styles.actionButtonText}>Call</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.actionButton, styles.navigationButton]} onPress={handleNavigate}>
          <Ionicons name="navigate" size={20} color="white" />
          <Text style={styles.actionButtonText}>Navigate</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  distance: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#6B7280',
  },
  address: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  medicineStatus: {
    marginBottom: 16,
  },
  medicineStatusTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  medicineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  medicineName: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6B7280',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  callButton: {
    backgroundColor: '#22C55E',
  },
  navigationButton: {
    backgroundColor: '#3B82F6',
  },
  actionButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  }
});