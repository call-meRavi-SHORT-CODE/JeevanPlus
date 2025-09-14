import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (phoneNumber: string, otp: string) => Promise<boolean>;
  logout: () => void;
  sendOTP: (phoneNumber: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendOTP = async (phoneNumber: string): Promise<boolean> => {
    // Mock OTP sending - in real app, this would call backend API
    try {
      await AsyncStorage.setItem('pendingOTP', '1234'); // Mock OTP
      await AsyncStorage.setItem('pendingPhone', phoneNumber);
      return true;
    } catch (error) {
      console.error('Error sending OTP:', error);
      return false;
    }
  };

  const login = async (phoneNumber: string, otp: string): Promise<boolean> => {
    try {
      const storedOTP = await AsyncStorage.getItem('pendingOTP');
      const storedPhone = await AsyncStorage.getItem('pendingPhone');
      
      if (otp === storedOTP && phoneNumber === storedPhone) {
        const newUser: User = {
          id: Date.now().toString(),
          phoneNumber,
          name: 'User',
          age: 0,
          gender: 'male',
          preferredLanguage: 'punjabi',
          location: 'Nabha, Punjab'
        };
        
        await AsyncStorage.setItem('user', JSON.stringify(newUser));
        await AsyncStorage.removeItem('pendingOTP');
        await AsyncStorage.removeItem('pendingPhone');
        
        setUser(newUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, sendOTP }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}