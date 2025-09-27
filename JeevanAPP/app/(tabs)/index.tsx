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
  StatusBar // Added for status bar control
} from 'react-native';
import { useRouter } from 'expo-router';
// import { useLanguage } from '@/contexts/LanguageContext'; // Assuming these contexts are correctly set up
// import { useAuth } from '@/contexts/AuthContext'; 
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context'; // For proper safe area handling

const { width } = Dimensions.get('window');

// Placeholder for contexts if not available, uncomment actual imports if they exist
const useLanguage = () => ({
  t: (key) => key, // Simple passthrough for demonstration
  currentLanguage: 'en'
});
const useAuth = () => ({
  user: { name: 'User' } // Simple placeholder
});

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

  const locations = ['Bangalore', 'Mumbai', 'Delhi', 'Chennai', 'Hyderabad', 'Pune'];

  const healthTips = [
    "Drink at least 8 glasses of water daily to stay hydrated and healthy.",
    "Take a 10-minute walk after every meal to improve digestion.",
    "Get 7-8 hours of quality sleep for better mental and physical health.",
    "Eat colorful fruits and vegetables for essential vitamins and minerals."
  ];

  const commonHealthProblems = [
    'Fever',
    'Cough',
    'Headache',
    'Stomach Pain',
    'Back Pain',
    'Diabetes',
    'Hypertension',
    'Allergy',
    'Cold',
    'Acidity',
    'Asthma',
  ];

  // Doctor specialties (only 3 as requested)
  const specialtyItems = [
    { icon: '🩺', title: 'General\nPhysician', color: '#E3F2FD', route: '/doctors?specialty=general' },
    { icon: '💆‍♀️', title: 'Skin &\nHair', color: '#F3E5F5', route: '/doctors?specialty=skin' }, // Changed emoji for hair
    { icon: '🤰', title: "Women's\nHealth", color: '#FFEBEE', route: '/doctors?specialty=women' }, // Changed emoji for women's health
  ];

  const getLanguageDisplayName = (code) => {
    const languageNames = {
      'en': 'English',
      'hi': 'हिंदी',
      'kn': 'ಕನ್ನಡ'
    };
    return languageNames[code] || 'English';
  };

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % healthTips.length);
    }, 5000);

    return () => clearInterval(tipInterval);
  }, []);

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
                text={`Welcome to Healthcare App`} 
                size={18}
                style={{ marginLeft: 12, backgroundColor: 'rgba(255,255,255,0.25)', borderColor: 'rgba(255,255,255,0.3)' }}
                onPress={() => console.log('App welcome voice triggered')}
                iconColor="white"
              />
            </View>
          </View>
          {/* Search Bar - Integrated into the header with rounded corners and shadow */}
          <View style={styles.searchBarWrapper}>
            <TouchableOpacity style={styles.searchBar} activeOpacity={0.7}>
              <Ionicons name="search" size={20} color="#6B7280" />
              <Text style={styles.searchPlaceholder}>Search for doctors, medicines, tests...</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Feature Cards (Physical Appointment, Instant Video Consult style) */}
        <View style={styles.mainFeaturesSection}>
          {[
            {
              id: 'consult-doctor',
              icon: 'stethoscope', // Changed to represent medical consultation
              title: 'Consult Doctor',
              subtitle: 'Video & chat with specialists',
              route: '/doctors',
              image: 'https://via.placeholder.com/150/FFC107/000000?text=Consult+Doctor', // Placeholder image
              backgroundColor: '#FFFDE7', // Light yellow background
              iconColor: '#FBC02D', // Darker yellow for icon
            },
            {
              id: 'check-symptoms',
              icon: 'clipboard-outline', // Changed to represent symptom checking
              title: 'Check Symptoms',
              subtitle: 'AI Symptom Checker',
              route: '/check-symptoms',
              image: 'https://via.placeholder.com/150/E0F7FA/000000?text=AI+Checker', // Placeholder image
              backgroundColor: '#E0F7FA', // Light blue background
              iconColor: '#00BCD4', // Darker blue for icon
            },
          ].map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.mainFeatureCard, { backgroundColor: LIGHT_BLUE }]}
              onPress={() => router.push(item.route)}
              activeOpacity={0.8}
            >
              <View>
                <Text style={styles.mainFeatureTitle}>{item.title}</Text>
                <Text style={styles.mainFeatureSubtitle}>{item.subtitle}</Text>
              </View>
              <Ionicons name={item.icon} size={40} color={PRIMARY_BLUE} style={styles.mainFeatureIcon} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Other Services Section (Medicines, Health Records, Book Appointments) */}
        <View style={styles.otherServicesSection}>
          {[
            {
              id: 'find-pharmacy',
              icon: 'pill',
              title: 'Find Pharmacy',
              route: '/pharmacy',
              color: '#673AB7', // Deep Purple
            },
            {
              id: 'health-records',
              icon: 'document-text-outline',
              title: 'Health Records',
              route: '/health-records',
              color: '#F44336', // Red
            },
            {
              id: 'book-appointments',
              icon: 'calendar-outline',
              title: 'Book Appointments',
              route: '/appointment',
              color: '#2196F3', // Blue
            },
          ].map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={styles.otherServiceCard}
              onPress={() => router.push(item.route)}
              activeOpacity={0.8}
            >
              <Ionicons name={item.icon} size={28} color={PRIMARY_BLUE} />
              <Text style={styles.otherServiceTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Find Doctor by Specialty */}
        <View style={styles.specialtySection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: '#111' }]}>Find a Doctor for your Health Problem</Text>
            <EnhancedVoiceButton 
              text="Find a Doctor for your Health Problem" 
              size={18} 
              onPress={() => console.log('Find Doctor voice triggered')}
              iconColor="#1976D2" // Blue for icons in white background sections
              style={{ backgroundColor: '#F0F4FF', borderColor: '#E0E7EF' }}
            />
          </View>
          {/* Common Health Problems Chips */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
            {commonHealthProblems.map((problem, idx) => (
              <TouchableOpacity
                key={problem}
                style={[
                  styles.chip,
                  selectedProblem === problem && styles.chipSelected
                ]}
                onPress={() => setSelectedProblem(problem)}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.chipText,
                  selectedProblem === problem && styles.chipTextSelected
                ]}>{problem}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.specialtyGrid}>
            {specialtyItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.specialtyItem, { backgroundColor: item.color }]}
                onPress={() => router.push(item.route)}
                activeOpacity={0.9}
              >
                <Text style={styles.specialtyIcon}>{item.icon}</Text>
                <Text style={styles.specialtyTitle}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Emergency Section */}
        <View style={styles.emergencySection}>
          <View style={styles.emergencyCard}>
            <View style={styles.emergencyHeader}>
              <Text style={styles.emergencyTitle}>🚨 Emergency</Text>
              <EnhancedVoiceButton 
                text="Emergency help available. Call Ambulance or find Nearest Hospital." 
                size={16}
                onPress={() => console.log('Emergency voice triggered')}
                iconColor="white"
                style={{ backgroundColor: 'rgba(255,255,255,0.25)', borderColor: 'rgba(255,255,255,0.3)' }}
              />
            </View>
            <Text style={styles.emergencySubtitle}>24/7 Emergency Support</Text>
            <View style={styles.emergencyButtons}>
              <TouchableOpacity 
                style={styles.emergencyButton}
                activeOpacity={0.8}
              >
                <View style={styles.emergencyButtonIcon}>
                  <Text style={styles.emergencyButtonEmoji}>🚑</Text>
                </View>
                <Text style={styles.emergencyButtonText}>Call Ambulance</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.emergencyButton}
                activeOpacity={0.8}
              >
                <View style={styles.emergencyButtonIcon}>
                  <Text style={styles.emergencyButtonEmoji}>🏥</Text>
                </View>
                <Text style={styles.emergencyButtonText}>Nearest Hospital</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Health Tips */}
        <View style={styles.healthTipsSection}>
          <View style={styles.healthTipsCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>💡 Daily Health Tips</Text>
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

  // Specialty Section (Find a Doctor)
  specialtySection: {
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 30,
    backgroundColor: '#F8FAFF', // Subtle blue-tinted white
    borderRadius: 12,
    paddingTop: 10,
    paddingBottom: 18,
  },
  specialtyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start', // Align to start since only 3 items
    gap: (width - (16 * 2) - (80 * 3)) / 2, // Calculate dynamic gap for 3 items
  },
  specialtyItem: {
    width: 80, // Fixed width for each item
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    backgroundColor: LIGHT_BLUE, // Blue for specialty
  },
  specialtyIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  specialtyTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    lineHeight: 14,
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

  // Add styles for problem chips
  chipScroll: {
    flexDirection: 'row',
    marginBottom: 16,
    marginLeft: -4,
  },
  chip: {
    backgroundColor: '#E3F2FD',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 7,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#BBDEFB',
  },
  chipSelected: {
    backgroundColor: '#1976D2',
    borderColor: '#1976D2',
  },
  chipText: {
    color: '#1976D2',
    fontWeight: '600',
    fontSize: 13,
  },
  chipTextSelected: {
    color: 'white',
  },
});

// NOTE: To update the navigation bar (tab bar) color, set the tabBarStyle/backgroundColor and tabBarActiveTintColor/tabBarInactiveTintColor in your navigation config/layout file, e.g.:
// tabBarStyle: { backgroundColor: PRIMARY_BLUE }, tabBarActiveTintColor: WHITE, tabBarInactiveTintColor: '#BBDEFB'