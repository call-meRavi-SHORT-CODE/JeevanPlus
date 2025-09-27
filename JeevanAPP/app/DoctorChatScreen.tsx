import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  Modal, 
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const PRIMARY_BLUE = '#1976D2';
const LIGHT_BLUE = '#E3F2FD';
const WHITE = '#FFFFFF';

interface Message {
  id: string;
  text: string;
  isDoctor: boolean;
  timestamp: Date;
}

export default function DoctorChatScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  let doctor = null;
  if (params.doctor) {
    try {
      doctor = JSON.parse(decodeURIComponent(params.doctor as string));
    } catch (e) {
      doctor = { name: 'Doctor', specialization: 'General Physician' };
    }
  }

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hello! I'm ${doctor?.name || 'Dr. Smith'}. How can I help you today?`,
      isDoctor: true,
      timestamp: new Date()
    }
  ]);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: message,
        isDoctor: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
      
      // Simulate doctor response
      setTimeout(() => {
        const doctorResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: "Thank you for sharing that information. Based on what you've described, I'd like to ask a few more questions to better understand your condition.",
          isDoctor: true,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, doctorResponse]);
      }, 2000);
    }
  };

  const handleVideoCall = () => {
    setShowVideoCall(true);
    setIsCallActive(true);
    setCallDuration(0);
  };

  const handleEndCall = () => {
    setShowVideoCall(false);
    setIsCallActive(false);
    setCallDuration(0);
  };

  const renderMessage = (msg: Message) => (
    <View key={msg.id} style={[
      styles.messageContainer,
      msg.isDoctor ? styles.doctorMessageContainer : styles.patientMessageContainer
    ]}>
      {msg.isDoctor && (
        <View style={styles.doctorAvatar}>
          <Text style={styles.avatarText}>👨‍⚕️</Text>
        </View>
      )}
      <View style={[
        styles.messageBubble,
        msg.isDoctor ? styles.doctorBubble : styles.patientBubble
      ]}>
        <Text style={[
          styles.messageText,
          msg.isDoctor ? styles.doctorText : styles.patientText
        ]}>
          {msg.text}
        </Text>
        <Text style={[
          styles.timestamp,
          msg.isDoctor ? styles.doctorTimestamp : styles.patientTimestamp
        ]}>
          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={WHITE} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{doctor?.name || 'Doctor'}</Text>
          <Text style={styles.headerSubtitle}>{doctor?.specialization || 'General Physician'}</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleVideoCall} style={styles.actionButton}>
            <Ionicons name="videocam" size={24} color={WHITE} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="call" size={24} color={WHITE} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Chat Messages */}
      <KeyboardAvoidingView 
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map(renderMessage)}
        </ScrollView>

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.textInput}
              placeholder="Type your message..."
              value={message}
              onChangeText={setMessage}
              multiline
              placeholderTextColor="#9CA3AF"
            />
            <TouchableOpacity
              style={[styles.sendButton, message.trim() && styles.sendButtonActive]}
              onPress={handleSendMessage}
              disabled={!message.trim()}
            >
              <Ionicons 
                name="send" 
                size={20} 
                color={message.trim() ? WHITE : '#9CA3AF'} 
              />
            </TouchableOpacity>
          </View>
          
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickActionButton}>
              <Ionicons name="camera" size={20} color={PRIMARY_BLUE} />
              <Text style={styles.quickActionText}>Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionButton}>
              <Ionicons name="document-text" size={20} color={PRIMARY_BLUE} />
              <Text style={styles.quickActionText}>Report</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionButton}>
              <Ionicons name="mic" size={20} color={PRIMARY_BLUE} />
              <Text style={styles.quickActionText}>Voice</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Video Call Modal */}
      <Modal visible={showVideoCall} animationType="slide" presentationStyle="fullScreen">
        <View style={styles.videoCallContainer}>
          {/* Video Call Header */}
          <View style={styles.videoCallHeader}>
            <View style={styles.callInfo}>
              <Text style={styles.callDoctorName}>{doctor?.name || 'Doctor'}</Text>
              <Text style={styles.callDuration}>{formatDuration(callDuration)}</Text>
            </View>
          </View>

          {/* Video Area */}
          <View style={styles.videoArea}>
            <View style={styles.doctorVideo}>
              <Text style={styles.videoPlaceholder}>👨‍⚕️</Text>
              <Text style={styles.videoLabel}>Dr. {doctor?.name || 'Doctor'}</Text>
            </View>
            
            <View style={styles.patientVideo}>
              <Text style={styles.videoPlaceholder}>👤</Text>
              <Text style={styles.videoLabel}>You</Text>
            </View>
          </View>

          {/* Call Controls */}
          <View style={styles.callControls}>
            <TouchableOpacity style={styles.controlButton}>
              <Ionicons name="mic-off" size={24} color={WHITE} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlButton}>
              <Ionicons name="videocam-off" size={24} color={WHITE} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.controlButton, styles.endCallButton]} onPress={handleEndCall}>
              <Ionicons name="call" size={24} color={WHITE} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlButton}>
              <Ionicons name="chatbubbles" size={24} color={WHITE} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: WHITE,
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  headerActions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 16,
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: '#F8FAFF',
  },
  messagesContent: {
    padding: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  doctorMessageContainer: {
    justifyContent: 'flex-start',
  },
  patientMessageContainer: {
    justifyContent: 'flex-end',
  },
  doctorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: PRIMARY_BLUE,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  avatarText: {
    fontSize: 16,
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  doctorBubble: {
    backgroundColor: WHITE,
    borderBottomLeftRadius: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  patientBubble: {
    backgroundColor: PRIMARY_BLUE,
    borderBottomRightRadius: 4,
    alignSelf: 'flex-end',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  doctorText: {
    color: '#1F2937',
  },
  patientText: {
    color: WHITE,
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
  },
  doctorTimestamp: {
    color: '#9CA3AF',
  },
  patientTimestamp: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  inputContainer: {
    backgroundColor: WHITE,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
    backgroundColor: '#F9FAFB',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonActive: {
    backgroundColor: PRIMARY_BLUE,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: LIGHT_BLUE,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  quickActionText: {
    marginLeft: 4,
    fontSize: 12,
    color: PRIMARY_BLUE,
    fontWeight: '500',
  },
  videoCallContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoCallHeader: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  callInfo: {
    alignItems: 'center',
  },
  callDoctorName: {
    fontSize: 20,
    fontWeight: '600',
    color: WHITE,
    marginBottom: 4,
  },
  callDuration: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  videoArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  doctorVideo: {
    width: '100%',
    height: '70%',
    backgroundColor: '#1F2937',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginHorizontal: 20,
  },
  patientVideo: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 120,
    height: 160,
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  videoPlaceholder: {
    fontSize: 48,
    marginBottom: 8,
  },
  videoLabel: {
    fontSize: 14,
    color: WHITE,
    fontWeight: '500',
  },
  callControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  endCallButton: {
    backgroundColor: '#EF4444',
  },
});