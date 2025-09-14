import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { VoiceButton } from '@/components/common/VoiceButton';

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { login, sendOTP } = useAuth();
  const { t } = useLanguage();

  const handleSendOTP = async () => {
    if (phoneNumber.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    try {
      const success = await sendOTP(phoneNumber);
      if (success) {
        setOtpSent(true);
        Alert.alert('Success', 'OTP sent to your phone number. Use 1234 for testing.');
      } else {
        Alert.alert('Error', 'Failed to send OTP. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 4) {
      Alert.alert('Error', 'Please enter a valid 4-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const success = await login(phoneNumber, otp);
      if (success) {
        router.replace('/(tabs)');
      } else {
        Alert.alert('Error', 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>🏥</Text>
        </View>
        <Text style={styles.appName}>{t('appName')}</Text>
        <Text style={styles.welcome}>{t('welcome')}</Text>
      </View>

      <LanguageSwitcher />

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t('phoneNumber')}</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="9876543210"
              keyboardType="numeric"
              maxLength={10}
              editable={!otpSent}
            />
            <VoiceButton 
              type="listen" 
              onVoiceInput={(input) => setPhoneNumber(input)} 
              size={20}
            />
          </View>
        </View>

        {otpSent && (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t('enterOTP')}</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={otp}
                onChangeText={setOtp}
                placeholder="1234"
                keyboardType="numeric"
                maxLength={4}
              />
              <VoiceButton 
                type="listen" 
                onVoiceInput={(input) => setOtp(input)} 
                size={20}
              />
            </View>
          </View>
        )}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={otpSent ? handleVerifyOTP : handleSendOTP}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Loading...' : otpSent ? t('verify') : t('sendOTP')}
          </Text>
        </TouchableOpacity>

        {otpSent && (
          <TouchableOpacity
            style={styles.resendButton}
            onPress={() => {
              setOtpSent(false);
              setOtp('');
            }}
          >
            <Text style={styles.resendText}>Send OTP Again</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.footer}>
        <VoiceButton 
          text={`${t('welcome')} ${t('appName')}`} 
          size={24} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#22C55E',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 40,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  welcome: {
    fontSize: 18,
    color: '#6B7280',
  },
  form: {
    flex: 1,
    maxHeight: 300,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  input: {
    flex: 1,
    height: 56,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 18,
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#22C55E',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  resendButton: {
    alignItems: 'center',
    marginTop: 16,
  },
  resendText: {
    fontSize: 16,
    color: '#3B82F6',
    textDecorationLine: 'underline',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  }
});