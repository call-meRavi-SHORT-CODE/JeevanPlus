import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const PRIMARY_BLUE = '#1976D2';
const LIGHT_BLUE = '#E3F2FD';
const WHITE = '#FFFFFF';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  options?: string[];
}

const SYMPTOM_FLOW = {
  greeting: {
    message: "Hello! I'm your AI health assistant. I'll help you understand your symptoms better. What's bothering you today?",
    options: ["Headache", "Fever", "Body Pain", "Cough", "Stomach Pain", "Other"]
  },
  headache: {
    message: "I understand you have a headache. Can you describe the pain?",
    options: ["Sharp/Stabbing", "Dull/Throbbing", "Pressure-like", "Pulsating"]
  },
  fever: {
    message: "You mentioned fever. How high is your temperature and how long have you had it?",
    options: ["Low grade (99-100°F)", "Moderate (101-102°F)", "High (103°F+)", "Don't know"]
  },
  bodyPain: {
    message: "Body pain can have various causes. Where exactly do you feel the pain?",
    options: ["All over body", "Back/Neck", "Joints", "Muscles", "Specific area"]
  },
  cough: {
    message: "Tell me about your cough. What type is it?",
    options: ["Dry cough", "Wet/Productive", "With blood", "Persistent"]
  },
  stomachPain: {
    message: "Stomach pain can vary. Can you describe your symptoms?",
    options: ["Sharp pain", "Cramping", "Burning", "Nausea/Vomiting"]
  }
};

export default function SymptomCheckerScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: SYMPTOM_FLOW.greeting.message,
      isBot: true,
      timestamp: new Date(),
      options: SYMPTOM_FLOW.greeting.options
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [currentFlow, setCurrentFlow] = useState('greeting');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const router = useRouter();

  const addMessage = (text: string, isBot: boolean, options?: string[]) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isBot,
      timestamp: new Date(),
      options
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleOptionPress = (option: string) => {
    // Add user message
    addMessage(option, false);
    
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      
      // Bot response based on option
      let botResponse = "";
      let nextOptions: string[] = [];
      
      switch (option.toLowerCase()) {
        case 'headache':
          botResponse = SYMPTOM_FLOW.headache.message;
          nextOptions = SYMPTOM_FLOW.headache.options;
          setCurrentFlow('headache');
          break;
        case 'fever':
          botResponse = SYMPTOM_FLOW.fever.message;
          nextOptions = SYMPTOM_FLOW.fever.options;
          setCurrentFlow('fever');
          break;
        case 'body pain':
          botResponse = SYMPTOM_FLOW.bodyPain.message;
          nextOptions = SYMPTOM_FLOW.bodyPain.options;
          setCurrentFlow('bodyPain');
          break;
        case 'cough':
          botResponse = SYMPTOM_FLOW.cough.message;
          nextOptions = SYMPTOM_FLOW.cough.options;
          setCurrentFlow('cough');
          break;
        case 'stomach pain':
          botResponse = SYMPTOM_FLOW.stomachPain.message;
          nextOptions = SYMPTOM_FLOW.stomachPain.options;
          setCurrentFlow('stomachPain');
          break;
        default:
          botResponse = "Based on your symptoms, I recommend consulting with a doctor for proper diagnosis. Would you like me to help you find a doctor?";
          nextOptions = ["Find Doctor", "Get First Aid Tips", "Check Another Symptom"];
      }
      
      addMessage(botResponse, true, nextOptions);
    }, 1500);
  };

  const handleSendMessage = () => {
    if (inputText.trim()) {
      addMessage(inputText, false);
      setInputText('');
      
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        addMessage("Thank you for the information. Based on what you've told me, I recommend consulting with a healthcare professional for proper diagnosis.", true, ["Find Doctor", "Emergency Help"]);
      }, 1500);
    }
  };

  const handleActionPress = (action: string) => {
    switch (action) {
      case 'Find Doctor':
        router.push('/doctors');
        break;
      case 'Emergency Help':
        // Handle emergency
        break;
      case 'Get First Aid Tips':
        // Handle first aid
        break;
      case 'Check Another Symptom':
        // Reset chat
        setMessages([{
          id: Date.now().toString(),
          text: SYMPTOM_FLOW.greeting.message,
          isBot: true,
          timestamp: new Date(),
          options: SYMPTOM_FLOW.greeting.options
        }]);
        setCurrentFlow('greeting');
        break;
    }
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const renderMessage = (message: Message) => (
    <View key={message.id} style={[
      styles.messageContainer,
      message.isBot ? styles.botMessageContainer : styles.userMessageContainer
    ]}>
      {message.isBot && (
        <View style={styles.botAvatar}>
          <Text style={styles.botAvatarText}>🤖</Text>
        </View>
      )}
      <View style={[
        styles.messageBubble,
        message.isBot ? styles.botBubble : styles.userBubble
      ]}>
        <Text style={[
          styles.messageText,
          message.isBot ? styles.botText : styles.userText
        ]}>
          {message.text}
        </Text>
        <Text style={[
          styles.timestamp,
          message.isBot ? styles.botTimestamp : styles.userTimestamp
        ]}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );

  const renderOptions = (options: string[]) => (
    <View style={styles.optionsContainer}>
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={styles.optionButton}
          onPress={() => {
            if (['Find Doctor', 'Emergency Help', 'Get First Aid Tips', 'Check Another Symptom'].includes(option)) {
              handleActionPress(option);
            } else {
              handleOptionPress(option);
            }
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderTypingIndicator = () => (
    <View style={styles.typingContainer}>
      <View style={styles.botAvatar}>
        <Text style={styles.botAvatarText}>🤖</Text>
      </View>
      <View style={styles.typingBubble}>
        <View style={styles.typingDots}>
          <View style={[styles.dot, styles.dot1]} />
          <View style={[styles.dot, styles.dot2]} />
          <View style={[styles.dot, styles.dot3]} />
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={WHITE} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>AI Health Assistant</Text>
          <Text style={styles.headerSubtitle}>Online</Text>
        </View>
        <TouchableOpacity style={styles.helpButton}>
          <Ionicons name="help-circle-outline" size={24} color={WHITE} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map(renderMessage)}
          
          {messages.length > 0 && messages[messages.length - 1].options && (
            renderOptions(messages[messages.length - 1].options!)
          )}
          
          {isTyping && renderTypingIndicator()}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type your message..."
            placeholderTextColor="#9CA3AF"
            multiline
          />
          <TouchableOpacity
            style={[styles.sendButton, inputText.trim() && styles.sendButtonActive]}
            onPress={handleSendMessage}
            disabled={!inputText.trim()}
          >
            <Ionicons 
              name="send" 
              size={20} 
              color={inputText.trim() ? WHITE : '#9CA3AF'} 
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  helpButton: {
    marginLeft: 12,
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
  botMessageContainer: {
    justifyContent: 'flex-start',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  botAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: PRIMARY_BLUE,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  botAvatarText: {
    fontSize: 16,
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  botBubble: {
    backgroundColor: WHITE,
    borderBottomLeftRadius: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  userBubble: {
    backgroundColor: PRIMARY_BLUE,
    borderBottomRightRadius: 4,
    alignSelf: 'flex-end',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  botText: {
    color: '#1F2937',
  },
  userText: {
    color: WHITE,
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
  },
  botTimestamp: {
    color: '#9CA3AF',
  },
  userTimestamp: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  optionsContainer: {
    marginTop: 12,
    marginLeft: 40,
  },
  optionButton: {
    backgroundColor: LIGHT_BLUE,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#BBDEFB',
  },
  optionText: {
    fontSize: 14,
    color: PRIMARY_BLUE,
    fontWeight: '500',
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  typingBubble: {
    backgroundColor: WHITE,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#9CA3AF',
    marginHorizontal: 2,
  },
  dot1: {
    opacity: 0.4,
  },
  dot2: {
    opacity: 0.7,
  },
  dot3: {
    opacity: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: WHITE,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
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
});