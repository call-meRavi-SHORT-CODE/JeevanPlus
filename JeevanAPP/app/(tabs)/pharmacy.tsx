import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '@/components/common/Header';

import { VoiceButton } from '@/components/common/VoiceButton';
import { useLanguage } from '@/contexts/LanguageContext';
import { MOCK_PHARMACIES } from '@/constants/mockData';
import PharmacyCard from '../../components/cards/PharmacyCard';

export default function PharmacyScreen() {
  const [searchMedicine, setSearchMedicine] = useState('');
  const [requiredMedicines, setRequiredMedicines] = useState<string[]>([]);

  const router = useRouter();
  const { t } = useLanguage();

  const handleAddMedicine = () => {
    if (searchMedicine.trim() && !requiredMedicines.includes(searchMedicine.trim())) {
      setRequiredMedicines([...requiredMedicines, searchMedicine.trim()]);
      setSearchMedicine('');
    }
  };

  const handleRemoveMedicine = (medicine: string) => {
    setRequiredMedicines(requiredMedicines.filter(m => m !== medicine));
  };

  const sortedPharmacies = MOCK_PHARMACIES.sort((a, b) => a.distance - b.distance);

  return (
    <View style={styles.container}>
      <Header 
        title={t('pharmacyFinder')} 
        showHome
        onHome={() => router.push('/')}
      />
      
      <View style={styles.searchSection}>
        <Text style={styles.sectionTitle}>Find Medicine</Text>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            value={searchMedicine}
            onChangeText={setSearchMedicine}
            placeholder="Enter medicine name..."
            onSubmitEditing={handleAddMedicine}
          />
          <VoiceButton 
            type="listen" 
            onVoiceInput={(input) => setSearchMedicine(input)} 
            size={20}
          />
        </View>
        
        {requiredMedicines.length > 0 && (
          <View style={styles.medicinesList}>
            <Text style={styles.medicinesTitle}>Required Medicines:</Text>
            <View style={styles.medicinesChips}>
              {requiredMedicines.map((medicine) => (
                <View key={medicine} style={styles.medicineChip}>
                  <Text style={styles.medicineChipText}>{medicine}</Text>
                  <Text 
                    style={styles.removeChip}
                    onPress={() => handleRemoveMedicine(medicine)}
                  >
                    ×
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.voiceSection}>
          <VoiceButton 
            text={`${sortedPharmacies.length} pharmacies found near you in Nabha`} 
          />
        </View>
      </View>

      <ScrollView style={styles.pharmaciesList}>
        <Text style={styles.listTitle}>Nearby Pharmacies</Text>
        {sortedPharmacies.map((pharmacy) => (
          <PharmacyCard
            key={pharmacy.id}
            pharmacy={pharmacy}
            requiredMedicines={requiredMedicines}
          />
        ))}
        
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>💡 Tips</Text>
          <Text style={styles.infoText}>
            • Call before visiting to confirm medicine availability
          </Text>
          <Text style={styles.infoText}>
            • Keep your prescription ready
          </Text>
          <Text style={styles.infoText}>
            • Generic medicines are often cheaper
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
  searchSection: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
  },
  medicinesList: {
    marginBottom: 16,
  },
  medicinesTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  medicinesChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  medicineChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF4FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  medicineChipText: {
    fontSize: 14,
    color: '#3B82F6',
    marginRight: 8,
  },
  removeChip: {
    fontSize: 18,
    color: '#EF4444',
    fontWeight: 'bold',
  },
  voiceSection: {
    alignItems: 'center',
  },
  pharmaciesList: {
    flex: 1,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    margin: 16,
    marginBottom: 8,
  },
  infoSection: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
    lineHeight: 20,
  }
});