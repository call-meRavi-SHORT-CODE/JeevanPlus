import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Pharmacy {
  id: string;
  name: string;
  address: string;
  distance: number;
  phone?: string;
}

interface PharmacyCardProps {
  pharmacy: Pharmacy;
  requiredMedicines?: string[];
}

const PRIMARY_BLUE = '#1976D2';
const WHITE = '#FFFFFF';

const PharmacyCard: React.FC<PharmacyCardProps> = ({ pharmacy, requiredMedicines = [] }) => {
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
              <Ionicons name="medkit" size={16} color={PRIMARY_BLUE} />
              <Text style={styles.medicineText}>{medicine}</Text>
            </View>
          ))}
        </View>
      )}
      <View style={styles.actions}>
        <TouchableOpacity style={[styles.actionButton, styles.callButton]}>
          <Ionicons name="call" size={18} color="white" />
          <Text style={styles.actionButtonText}>Call</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.navigationButton]}>
          <Ionicons name="navigate" size={18} color="white" />
          <Text style={styles.actionButtonText}>Navigate</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: WHITE,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: PRIMARY_BLUE,
  },
  distance: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceText: {
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 4,
  },
  address: {
    fontSize: 13,
    color: '#374151',
    marginBottom: 8,
  },
  medicineStatus: {
    marginBottom: 8,
  },
  medicineStatusTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: PRIMARY_BLUE,
    marginBottom: 4,
  },
  medicineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  medicineText: {
    fontSize: 13,
    color: PRIMARY_BLUE,
    marginLeft: 6,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PRIMARY_BLUE,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  callButton: {
    marginRight: 8,
  },
  navigationButton: {
    marginLeft: 8,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default PharmacyCard;
