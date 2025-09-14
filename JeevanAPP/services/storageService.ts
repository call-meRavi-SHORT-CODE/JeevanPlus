import AsyncStorage from '@react-native-async-storage/async-storage';
import { Consultation } from '@/types';

class StorageService {
  private static instance: StorageService;

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  async saveConsultation(consultation: Consultation): Promise<void> {
    try {
      const consultations = await this.getConsultations();
      consultations.push(consultation);
      await AsyncStorage.setItem('consultations', JSON.stringify(consultations));
    } catch (error) {
      console.error('Error saving consultation:', error);
    }
  }

  async getConsultations(): Promise<Consultation[]> {
    try {
      const data = await AsyncStorage.getItem('consultations');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting consultations:', error);
      return [];
    }
  }

  async getConsultationById(id: string): Promise<Consultation | null> {
    try {
      const consultations = await this.getConsultations();
      return consultations.find(c => c.id === id) || null;
    } catch (error) {
      console.error('Error getting consultation by ID:', error);
      return null;
    }
  }

  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  }
}

export default StorageService.getInstance();