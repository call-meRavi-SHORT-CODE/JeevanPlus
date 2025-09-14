export interface User {
  id: string;
  phoneNumber: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  preferredLanguage: 'punjabi' | 'hindi' | 'english';
  location: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  languages: string[];
  gender: 'male' | 'female';
  rating: number;
  available: boolean;
  image?: string;
  consultationModes: ('video' | 'audio' | 'chat')[];
}

export interface Symptom {
  id: string;
  name: string;
  icon: string;
  category: string;
}

export interface SymptomResponse {
  symptomId: string;
  response: 'yes' | 'no' | 'not_sure';
}

export interface Consultation {
  id: string;
  patientId: string;
  doctorId: string;
  symptoms: string[];
  diagnosis: string;
  prescription: string;
  date: Date;
  mode: 'video' | 'audio' | 'chat';
  status: 'completed' | 'pending' | 'cancelled';
}

export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  distance: number;
  phone: string;
  medicines: { [key: string]: boolean };
  location: {
    latitude: number;
    longitude: number;
  };
}

export interface Language {
  code: 'punjabi' | 'hindi' | 'english';
  name: string;
  nativeName: string;
}