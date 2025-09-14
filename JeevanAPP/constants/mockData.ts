import { Doctor, Pharmacy } from '@/types';

export const MOCK_DOCTORS: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Manjeet Singh',
    specialization: 'General Physician',
    languages: ['punjabi', 'hindi', 'english'],
    gender: 'male',
    rating: 4.8,
    available: true,
    consultationModes: ['video', 'audio', 'chat']
  },
  {
    id: '2',
    name: 'Dr. Simran Kaur',
    specialization: 'Family Medicine',
    languages: ['punjabi', 'hindi'],
    gender: 'female',
    rating: 4.9,
    available: true,
    consultationModes: ['video', 'audio', 'chat']
  },
  {
    id: '3',
    name: 'Dr. Rajesh Kumar',
    specialization: 'Internal Medicine',
    languages: ['hindi', 'english'],
    gender: 'male',
    rating: 4.7,
    available: false,
    consultationModes: ['video', 'chat']
  },
  {
    id: '4',
    name: 'Dr. Preet Kaur',
    specialization: 'Pediatrics',
    languages: ['punjabi', 'english'],
    gender: 'female',
    rating: 4.9,
    available: true,
    consultationModes: ['video', 'audio', 'chat']
  }
];

export const MOCK_PHARMACIES: Pharmacy[] = [
  {
    id: '1',
    name: 'Sharma Medical Store',
    address: 'Main Bazaar, Nabha',
    distance: 0.5,
    phone: '+91-9876543210',
    medicines: {
      'Paracetamol': true,
      'Cough Syrup': true,
      'Antibiotics': false,
      'Pain Relief': true
    },
    location: {
      latitude: 30.3752,
      longitude: 76.1539
    }
  },
  {
    id: '2',
    name: 'Apollo Pharmacy',
    address: 'Civil Lines, Nabha',
    distance: 1.2,
    phone: '+91-9876543211',
    medicines: {
      'Paracetamol': true,
      'Cough Syrup': false,
      'Antibiotics': true,
      'Pain Relief': true
    },
    location: {
      latitude: 30.3762,
      longitude: 76.1549
    }
  },
  {
    id: '3',
    name: 'Singh Medical Hall',
    address: 'Bus Stand Road, Nabha',
    distance: 0.8,
    phone: '+91-9876543212',
    medicines: {
      'Paracetamol': true,
      'Cough Syrup': true,
      'Antibiotics': true,
      'Pain Relief': false
    },
    location: {
      latitude: 30.3742,
      longitude: 76.1529
    }
  }
];