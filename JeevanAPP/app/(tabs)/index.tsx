import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Dimensions,
  Platform,
  Animated,
  StatusBar
} from 'react-native';
import { useRouter } from 'expo-router';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext'; 
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context'; // For proper safe area handling

const { width } = Dimensions.get('window');

// Color constants
const PRIMARY_BLUE = '#1976D2';
const ACCENT_BLUE = '#2196F3';
const LIGHT_BLUE = '#E3F2FD';
const WHITE = '#FFFFFF';


// Enhanced Voice Button Component
const EnhancedVoiceButton = ({ text, size = 16, style, onPress, iconColor = 'white' }) => {
  const [isPressed, setIsPressed] = useState(false);
  const [pulseAnim] = useState(new Animated.Value(1));

  const startPulse = () => {
    setIsPressed(true);
    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.1,
        duration: 150,
        useNativeDriver: false,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: false,
      }),
    ]).start(() => {
      setIsPressed(false);
      if (onPress) onPress();
    });
  };

  return (
    <Animated.View style={[{ transform: [{ scale: pulseAnim }] }, style]}>
      <TouchableOpacity
        style={styles.voiceButton}
        onPress={startPulse}
        activeOpacity={0.8}
      >
        <Ionicons name="volume-medium" size={size} color={iconColor} />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function HomeScreen() {
  const router = useRouter();
  const { t, currentLanguage } = useLanguage();
  const { user } = useAuth();
  
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState('Nabha');
  const [selectedProblem, setSelectedProblem] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);

  const locations = ['Bangalore', 'Mumbai', 'Delhi', 'Chennai', 'Hyderabad', 'Pune'];

  const healthTips = [
    "Drink at least 8 glasses of water daily to stay hydrated and healthy.",
    "Take a 10-minute walk after every meal to improve digestion.",
    "Get 7-8 hours of quality sleep for better mental and physical health.",
    "Eat colorful fruits and vegetables for essential vitamins and minerals."
  ];

  const languageNames: { [key: string]: string } = {
    punjabi: 'Punjabi',
    hindi: 'Hindi',
    english: 'English',
  };

  const getLanguageDisplayName = (code: string): string => {
    return languageNames[code] || 'Punjabi';
  };

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % healthTips.length);
    }, 5000);

    return () => clearInterval(tipInterval);
  }, []);

  useEffect(() => {
    let timer: any;
    if (isRecording) {
      timer = setInterval(() => setRecordTime((t) => t + 1), 1000);
    } else {
      setRecordTime(0);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={PRIMARY_BLUE} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.locationContainer} activeOpacity={0.8}>
              <Ionicons name="location" size={18} color="white" />
              <Text style={styles.locationText}>{selectedLocation}</Text>
              <Ionicons name="chevron-down" size={14} color="white" />
            </TouchableOpacity>
            <View style={styles.headerRight}>
              <Text style={styles.languageText}>{getLanguageDisplayName(currentLanguage)}</Text>
              <EnhancedVoiceButton 
                text={t('Welcome to JeevanPlus')} 
                size={18}
                style={{ marginLeft: 12, backgroundColor: 'rgba(255,255,255,0.25)', borderColor: 'rgba(255,255,255,0.3)' }}
                onPress={() => console.log('App welcome voice triggered')}
                iconColor="white"
              />
            </View>
          </View>
          {/* Add Language Switcher below header */}
          <LanguageSwitcher />
          {/* Search Bar - Integrated into the header with rounded corners and shadow */}
          <View style={styles.searchBarWrapper}>
            <TouchableOpacity style={styles.searchBar} activeOpacity={0.7}>
              <Ionicons name="search" size={20} color="#6B7280" />
              <Text style={styles.searchPlaceholder}>{t('Search') || 'Search for doctors, medicines, tests...'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Feature Cards (Physical Appointment, Instant Video Consult style) */}
        <View style={styles.mainFeaturesSection}>
          {[ // Only main features, direct navigation
            {
              id: 'consult-doctor',
              icon: 'chatbubble-ellipses', // Ionicons chat icon
              title: t('doctorConsultation'),
              subtitle: t('videoCall') + ' & ' + t('chat') + ' ' + t('doctorConsultation'),
              route: '/DoctorChatScreen', // Direct to chat interface
            },
            {
              id: 'check-symptoms',
              icon: 'clipboard-outline',
              title: t('symptomChecker'),
              subtitle: t('AI Symptom Checker') || 'AI Symptom Checker',
              route: '/symptom-checker', // Direct to symptom checker
            },
          ].map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.mainFeatureCard, { backgroundColor: LIGHT_BLUE }]}
              onPress={() => router.push(item.route as any)}
              activeOpacity={0.8}
            >
              <View>
                <Text style={styles.mainFeatureTitle}>{item.title}</Text>
                <Text style={styles.mainFeatureSubtitle}>{item.subtitle}</Text>
              </View>
              <Ionicons name={item.icon as any} size={40} color={PRIMARY_BLUE} style={styles.mainFeatureIcon} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Other Services Section (Medicines, Health Records, Book Appointments) */}
        <View style={styles.otherServicesSection}>
          {[ // Only main features, direct navigation
            {
              id: 'find-pharmacy',
              icon: 'medical-outline',
              title: t('pharmacyFinder'),
              route: '/pharmacy',
            },
            {
              id: 'health-records',
              icon: 'document-text-outline',
              title: t('healthRecords'),
              route: '/records',
            },
            {
              id: 'book-appointments',
              icon: 'calendar-outline',
              title: t('scheduleConsultation'),
              route: '/book-appointment',
            },
          ].map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.otherServiceCard}
              onPress={() => router.push(item.route as any)}
              activeOpacity={0.8}
            >
              <Ionicons name={item.icon as any} size={28} color={PRIMARY_BLUE} />
              <Text style={styles.otherServiceTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Emergency Section */}
        <View style={styles.emergencySection}>
          <View style={styles.emergencyCard}>
            <View style={styles.emergencyHeader}>
              <Text style={styles.emergencyTitle}>🚨 {t('emergency')}</Text>
              <EnhancedVoiceButton 
                text={t('emergency') + ' ' + t('callAmbulance') + ' ' + t('nearestHospital')} 
                size={16}
                onPress={() => console.log('Emergency voice triggered')}
                iconColor="white"
                style={{ backgroundColor: 'rgba(255,255,255,0.25)', borderColor: 'rgba(255,255,255,0.3)' }}
              />
            </View>
            <Text style={styles.emergencySubtitle}>24/7 {t('emergency')} {t('support') || 'Support'}</Text>
            <View style={styles.emergencyButtons}>
              <TouchableOpacity 
                style={styles.emergencyButton}
                activeOpacity={0.8}
              >
                <View style={styles.emergencyButtonIcon}>
                  <Text style={styles.emergencyButtonEmoji}>🚑</Text>
                </View>
                <Text style={styles.emergencyButtonText}>{t('callAmbulance')}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.emergencyButton}
                activeOpacity={0.8}
              >
                <View style={styles.emergencyButtonIcon}>
                  <Text style={styles.emergencyButtonEmoji}>🏥</Text>
                </View>
                <Text style={styles.emergencyButtonText}>{t('nearestHospital')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Health Tips */}
        <View style={styles.healthTipsSection}>
          <View style={styles.healthTipsCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>💡 {t('dailyHealthTips')}</Text>
              <EnhancedVoiceButton 
                text={healthTips[currentTipIndex]} 
                size={16}
                onPress={() => console.log(`Daily tip voice triggered: ${healthTips[currentTipIndex]}`)}
                iconColor={PRIMARY_BLUE}
                style={{ backgroundColor: '#F0F0F0', borderColor: '#E0E0E0' }}
              />
            </View>
            <Text style={styles.tipText}>{healthTips[currentTipIndex]}</Text>
            <View style={styles.tipIndicators}>
              {healthTips.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setCurrentTipIndex(index)}
                  style={[
                    styles.tipIndicator,
                    currentTipIndex === index && styles.activeTipIndicator
                  ]}
                />
              ))}
            </View>
          </View>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
      {/* Static Voice Record Button at Bottom Right */}
      <View style={styles.voiceRecordWrapper}>
        <TouchableOpacity 
          style={styles.voiceRecordButton}
          activeOpacity={0.8}
          onPress={() => setIsRecording(true)}
        >
          <Ionicons name={isRecording ? 'mic-outline' : 'mic'} size={32} color={PRIMARY_BLUE} />
        </TouchableOpacity>
      </View>
      {/* Recording UI Overlay */}
      {isRecording && (
        <View style={styles.recordingOverlay}>
          <View style={styles.recordingBox}>
            <Ionicons name="mic" size={32} color={PRIMARY_BLUE} />
            <Text style={styles.recordingText}>Recording...</Text>
            <Text style={styles.recordingTimer}>{`${Math.floor(recordTime/60).toString().padStart(2, '0')}:${(recordTime%60).toString().padStart(2, '0')}`}</Text>
            <TouchableOpacity style={styles.stopButton} onPress={() => setIsRecording(false)}>
              <Ionicons name="stop" size={28} color={WHITE} />
              <Text style={styles.stopButtonText}>Stop</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );

}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: WHITE,
  },
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  headerContainer: {
    backgroundColor: '#1976D2',
    paddingBottom: 20,
    borderBottomLeftRadius: 32, // Increased for more rounded corners
    borderBottomRightRadius: 32, // Increased for more rounded corners
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 10 : 0,
    paddingBottom: 10,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 16, // Increased for better touch and centering
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 20, // Slightly more rounded
    minWidth: 120,
    justifyContent: 'center',
    marginLeft: 0, // Remove any left margin
    marginRight: 8, // Add a little right margin for spacing
  },
  locationText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 6,
    marginRight: 4,
    textAlignVertical: 'center',
    textAlign: 'center',
    minWidth: 60, // Ensures text is centered
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 8,
  },
  voiceButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0, // Removed border for cleaner look
  },
  searchBarWrapper: {
    paddingHorizontal: 16,
    marginTop: 10, // Position search bar slightly below header
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8, // More square-ish than super round
    paddingHorizontal: 15,
    paddingVertical: 12,
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  searchPlaceholder: {
    marginLeft: 10,
    color: '#6B7280', // Darker gray for better contrast
    fontSize: 15,
    flex: 1,
  },

  // Main Feature Cards (like Practo's big cards)
  mainFeaturesSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 20, // Pushed down from the search bar
    marginBottom: 20,
  },
  mainFeatureCard: {
    width: (width - 48) / 2, // 2 cards, 16px padding on sides, 16px in between
    height: 140, // Fixed height for consistency
    borderRadius: 12,
    padding: 15,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    overflow: 'hidden', // Ensures icon stays within bounds
    backgroundColor: LIGHT_BLUE, // Blue card
  },
  mainFeatureTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  mainFeatureSubtitle: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 18,
  },
  mainFeatureIcon: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    opacity: 0.3, // Make icon subtle
  },

  // Other Services (below main cards)
  otherServicesSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    marginBottom: 25,
  },
  otherServiceCard: {
    width: (width - 64) / 3, // 3 cards, 16px padding, 16px gaps
    alignItems: 'center',
    paddingVertical: 15,
    backgroundColor: WHITE,
    borderRadius: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  otherServiceTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginTop: 8,
    textAlign: 'center',
  },

  // Section Header for general use (Find Doctor, Health Tips)
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111', // Enforced black for section title
  },
  
  // Emergency Section
  emergencySection: {
    marginHorizontal: 16,
    marginBottom: 30,
  },
  emergencyCard: {
    backgroundColor: '#1976D2', // Blue for emergency
    padding: 20,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  emergencyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  emergencySubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 20,
  },
  emergencyButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  emergencyButton: {
    alignItems: 'center',
  },
  emergencyButtonIcon: {
    backgroundColor: ACCENT_BLUE,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  emergencyButtonEmoji: {
    fontSize: 22,
  },
  emergencyButtonText: {
    color: WHITE,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },

  // Health Tips
  healthTipsSection: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  healthTipsCard: {
    backgroundColor: WHITE,
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  tipText: {
    fontSize: 14,
    color: PRIMARY_BLUE,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 16,
    fontStyle: 'italic', // Added for a more "tip" feel
  },
  tipIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  tipIndicator: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 4,
  },
  activeTipIndicator: {
    backgroundColor: PRIMARY_BLUE,
    width: 18,
  },
  // Voice Record Button styles
  voiceRecordWrapper: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    alignItems: 'center',
    zIndex: 100,
  },
  voiceRecordButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(33, 150, 243, 0.25)', // Transparent accent blue
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: PRIMARY_BLUE,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    borderWidth: 2,
    borderColor: PRIMARY_BLUE,
  },
  recordingOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    backgroundColor: 'rgba(33,150,243,0.10)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: 200,
  },
  recordingBox: {
    marginBottom: 80,
    backgroundColor: PRIMARY_BLUE,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  recordingText: {
    color: WHITE,
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
  },
  recordingTimer: {
    color: WHITE,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  stopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ACCENT_BLUE,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 8,
    marginTop: 8,
  },
  stopButtonText: {
    color: WHITE,
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 8,
  },
});

// NOTE: To update the navigation bar (tab bar) color, set the tabBarStyle/backgroundColor and tabBarActiveTintColor/tabBarInactiveTintColor in your navigation config/layout file, e.g.:
// tabBarStyle: { backgroundColor: PRIMARY_BLUE }, tabBarActiveTintColor: WHITE, tabBarInactiveTintColor: '#BBDEFB'