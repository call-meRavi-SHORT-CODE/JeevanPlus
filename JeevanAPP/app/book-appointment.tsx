import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const PRIMARY_BLUE = '#1976D2';
const LIGHT_BLUE = '#E3F2FD';
const WHITE = '#FFFFFF';

const DISEASES = [
  { id: 'diabetes', name: 'Diabetes', icon: '🩺', specialists: ['Endocrinologist', 'General Physician'] },
  { id: 'hypertension', name: 'Hypertension', icon: '❤️', specialists: ['Cardiologist', 'General Physician'] },
  { id: 'asthma', name: 'Asthma', icon: '🫁', specialists: ['Pulmonologist', 'General Physician'] },
  { id: 'arthritis', name: 'Arthritis', icon: '🦴', specialists: ['Rheumatologist', 'Orthopedic'] },
  { id: 'migraine', name: 'Migraine', icon: '🧠', specialists: ['Neurologist', 'General Physician'] },
  { id: 'skin-allergy', name: 'Skin Allergy', icon: '🧴', specialists: ['Dermatologist'] },
];

const DOCTORS = [
  {
    id: '1',
    name: 'Dr. Manjeet Singh',
    specialization: 'General Physician',
    rating: 4.8,
    experience: '8 years',
    available: true,
    nextSlot: '2:00 PM Today'
  },
  {
    id: '2',
    name: 'Dr. Simran Kaur',
    specialization: 'Cardiologist',
    rating: 4.9,
    experience: '12 years',
    available: true,
    nextSlot: '4:30 PM Today'
  },
  {
    id: '3',
    name: 'Dr. Rajesh Kumar',
    specialization: 'Endocrinologist',
    rating: 4.7,
    experience: '10 years',
    available: false,
    nextSlot: '10:00 AM Tomorrow'
  },
];

const TIME_SLOTS = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM',
  '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM'
];

export default function BookAppointmentScreen() {
  const [step, setStep] = useState(1); // 1: Disease, 2: Doctor, 3: Time Slot, 4: Confirmation
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('Today');
  const [selectedTime, setSelectedTime] = useState(null);
  const [patientNotes, setPatientNotes] = useState('');

  const router = useRouter();

  const handleDiseaseSelect = (disease) => {
    setSelectedDisease(disease);
    setStep(2);
  };

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setStep(3);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setStep(4);
  };
  
  const handleBookAppointment = () => {
    // Here you would typically make an API call to book the appointment
    alert('Appointment booked successfully!');
    router.push('/(tabs)');
  };

  const renderDiseaseSelection = () => (
    <ScrollView style={styles.content}>
      <Text style={styles.stepTitle}>Select Health Condition</Text>
      <Text style={styles.stepSubtitle}>Choose the condition you want to consult about</Text>
      
      <View style={styles.diseaseGrid}>
        {DISEASES.map((disease) => (
          <TouchableOpacity
            key={disease.id}
            style={styles.diseaseCard}
            onPress={() => handleDiseaseSelect(disease)}
            activeOpacity={0.8}
          >
            <Text style={styles.diseaseIcon}>{disease.icon}</Text>
            <Text style={styles.diseaseName}>{disease.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  const renderDoctorSelection = () => (
    <ScrollView style={styles.content}>
      <View style={styles.selectedInfo}>
        <Text style={styles.selectedLabel}>Selected Condition:</Text>
        <Text style={styles.selectedValue}>{selectedDisease?.name}</Text>
      </View>
      
      <Text style={styles.stepTitle}>Choose Doctor</Text>
      <Text style={styles.stepSubtitle}>Select from available specialists</Text>
      
      {DOCTORS.filter(doctor => 
        selectedDisease?.specialists.includes(doctor.specialization)
      ).map((doctor) => (
        <TouchableOpacity
          key={doctor.id}
          style={styles.doctorCard}
          onPress={() => handleDoctorSelect(doctor)}
          activeOpacity={0.8}
        >
          <View style={styles.doctorAvatar}>
            <Text style={styles.doctorAvatarText}>👨‍⚕️</Text>
          </View>
          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>{doctor.name}</Text>
            <Text style={styles.doctorSpecialty}>{doctor.specialization}</Text>
            <View style={styles.doctorMeta}>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={14} color="#F59E0B" />
                <Text style={styles.rating}>{doctor.rating}</Text>
              </View>
              <Text style={styles.experience}>{doctor.experience} exp</Text>
            </View>
            <Text style={styles.nextSlot}>Next: {doctor.nextSlot}</Text>
          </View>
          <View style={styles.doctorRight}>
            <Text style={styles.fee}>₹{doctor.fee}</Text>
            <View style={[styles.availabilityDot, { 
              backgroundColor: doctor.available ? '#22C55E' : '#EF4444' 
            }]} />
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderTimeSlotSelection = () => (
    <ScrollView style={styles.content}>
      <View style={styles.selectedInfo}>
        <Text style={styles.selectedLabel}>Doctor:</Text>
        <Text style={styles.selectedValue}>{selectedDoctor?.name}</Text>
      </View>
      
      <Text style={styles.stepTitle}>Select Date & Time</Text>
      
      <View style={styles.dateSelector}>
        {['Today', 'Tomorrow', 'Day After'].map((date) => (
          <TouchableOpacity
            key={date}
            style={[styles.dateButton, selectedDate === date && styles.selectedDateButton]}
            onPress={() => setSelectedDate(date)}
          >
            <Text style={[styles.dateText, selectedDate === date && styles.selectedDateText]}>
              {date}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <Text style={styles.slotsTitle}>Available Time Slots</Text>
      <View style={styles.timeSlots}>
        {TIME_SLOTS.map((time) => (
          <TouchableOpacity
            key={time}
            style={[styles.timeSlot, selectedTime === time && styles.selectedTimeSlot]}
            onPress={() => setSelectedTime(time)}
          >
            <Text style={[styles.timeText, selectedTime === time && styles.selectedTimeText]}>
              {time}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {selectedTime && (
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => handleTimeSelect(selectedTime)}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );

  const renderConfirmation = () => (
    <ScrollView style={styles.content}>
      <Text style={styles.stepTitle}>Confirm Appointment</Text>
      
      <View style={styles.confirmationCard}>
        <View style={styles.confirmationRow}>
          <Text style={styles.confirmationLabel}>Condition:</Text>
          <Text style={styles.confirmationValue}>{selectedDisease?.name}</Text>
        </View>
        <View style={styles.confirmationRow}>
          <Text style={styles.confirmationLabel}>Doctor:</Text>
          <Text style={styles.confirmationValue}>{selectedDoctor?.name}</Text>
        </View>
        <View style={styles.confirmationRow}>
          <Text style={styles.confirmationLabel}>Date:</Text>
          <Text style={styles.confirmationValue}>{selectedDate}</Text>
        </View>
        <View style={styles.confirmationRow}>
          <Text style={styles.confirmationLabel}>Time:</Text>
          <Text style={styles.confirmationValue}>{selectedTime}</Text>
        </View>
        <View style={styles.confirmationRow}>
          <Text style={styles.confirmationLabel}>Fee:</Text>
          <Text style={styles.confirmationValue}>₹{selectedDoctor?.fee}</Text>
        </View>
      </View>
      
      <View style={styles.notesSection}>
        <Text style={styles.notesLabel}>Additional Notes (Optional)</Text>
        <TextInput
          style={styles.notesInput}
          value={patientNotes}
          onChangeText={setPatientNotes}
          placeholder="Any specific symptoms or concerns..."
          multiline
          numberOfLines={4}
          placeholderTextColor="#9CA3AF"
        />
      </View>
      
      <TouchableOpacity
        style={styles.bookButton}
        onPress={handleBookAppointment}
      >
        <Text style={styles.bookButtonText}>Book Appointment</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {
          if (step > 1) {
            setStep(step - 1);
          } else {
            router.back();
          }
        }} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={WHITE} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Appointment</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          {[1, 2, 3, 4].map((stepNumber) => (
            <View
              key={stepNumber}
              style={[
                styles.progressStep,
                stepNumber <= step && styles.activeProgressStep
              ]}
            />
          ))}
        </View>
        <Text style={styles.progressText}>Step {step} of 4</Text>
      </View>

      {step === 1 && renderDiseaseSelection()}
      {step === 2 && renderDoctorSelection()}
      {step === 3 && renderTimeSlotSelection()}
      {step === 4 && renderConfirmation()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  header: {
    backgroundColor: PRIMARY_BLUE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: WHITE,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  headerRight: {
    width: 32,
  },
  progressContainer: {
    backgroundColor: LIGHT_BLUE,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  progressBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressStep: {
    flex: 1,
    height: 4,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 2,
    borderRadius: 2,
  },
  activeProgressStep: {
    backgroundColor: PRIMARY_BLUE,
  },
  progressText: {
    fontSize: 12,
    color: PRIMARY_BLUE,
    textAlign: 'center',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: PRIMARY_BLUE,
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  selectedInfo: {
    backgroundColor: LIGHT_BLUE,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  selectedLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  selectedValue: {
    fontSize: 16,
    fontWeight: '600',
    color: PRIMARY_BLUE,
  },
  diseaseGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  diseaseCard: {
    width: '48%',
    backgroundColor: WHITE,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  diseaseIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  diseaseName: {
    fontSize: 14,
    fontWeight: '600',
    color: PRIMARY_BLUE,
    textAlign: 'center',
  },
  doctorCard: {
    flexDirection: 'row',
    backgroundColor: WHITE,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  doctorAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: LIGHT_BLUE,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  doctorAvatarText: {
    fontSize: 24,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: PRIMARY_BLUE,
    marginBottom: 4,
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
  },
  experience: {
    fontSize: 12,
    color: '#6B7280',
  },
  nextSlot: {
    fontSize: 12,
    color: '#22C55E',
    fontWeight: '500',
  },
  doctorRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  fee: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#22C55E',
    marginBottom: 8,
  },
  availabilityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dateSelector: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  dateButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    marginHorizontal: 4,
    alignItems: 'center',
  },
  selectedDateButton: {
    backgroundColor: PRIMARY_BLUE,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  selectedDateText: {
    color: WHITE,
  },
  slotsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: PRIMARY_BLUE,
    marginBottom: 12,
  },
  timeSlots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  timeSlot: {
    width: '30%',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    marginBottom: 12,
  },
  selectedTimeSlot: {
    backgroundColor: PRIMARY_BLUE,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  selectedTimeText: {
    color: WHITE,
  },
  continueButton: {
    backgroundColor: PRIMARY_BLUE,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: WHITE,
  },
  confirmationCard: {
    backgroundColor: WHITE,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  confirmationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  confirmationLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  confirmationValue: {
    fontSize: 14,
    fontWeight: '600',
    color: PRIMARY_BLUE,
  },
  notesSection: {
    marginBottom: 20,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    textAlignVertical: 'top',
    backgroundColor: WHITE,
  },
  bookButton: {
    backgroundColor: '#22C55E',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: WHITE,
  },
});