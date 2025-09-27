@@ .. @@
 import React, { useState } from 'react';
-import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
+import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
 import { useRouter } from 'expo-router';
-import { Header } from '@/components/common/Header';
-import { IconButton } from '@/components/common/IconButton';
-import { VoiceButton } from '@/components/common/VoiceButton';
+import { Ionicons } from '@expo/vector-icons';
+import { SafeAreaView } from 'react-native-safe-area-context';
 import { useLanguage } from '@/contexts/LanguageContext';
-import { COMMON_SYMPTOMS, SYMPTOM_QUESTIONS } from '@/constants/symptoms';
-import { SymptomResponse } from '@/types';
+
+const PRIMARY_BLUE = '#1976D2';
+const LIGHT_BLUE = '#E3F2FD';
+const WHITE = '#FFFFFF';
+
+interface ChatMessage {
+  id: string;
+  text: string;
+  isBot: boolean;
+  timestamp: Date;
+}
+
+const SYMPTOM_FLOW = {
+  start: {
+    message: "Hello! I'm here to help you understand your symptoms. What's bothering you today?",
+    options: ['Headache', 'Fever', 'Cough', 'Stomach Pain', 'Body Pain', 'Other']
+  },
+  headache: {
+    message: "I understand you have a headache. Can you tell me more about it?",
+    options: ['Mild pain', 'Severe pain', 'With nausea', 'With fever']
+  },
+  fever: {
+    message: "You mentioned fever. How high is your temperature?",
+    options: ['Low grade (99-100°F)', 'Moderate (100-102°F)', 'High (102°F+)', 'Not sure']
+  },
+  cough: {
+    message: "Tell me about your cough. What type is it?",
+    options: ['Dry cough', 'Wet cough', 'With blood', 'Persistent']
+  },
+  'stomach-pain': {
+    message: "Where exactly is your stomach pain located?",
+    options: ['Upper abdomen', 'Lower abdomen', 'All over', 'With nausea']
+  },
+  'body-pain': {
+    message: "Which part of your body is paining?",
+    options: ['Back pain', 'Joint pain', 'Muscle pain', 'All over body']
+  }
+};

 export default function SymptomCheckerScreen() {
-  const [currentSymptom, setCurrentSymptom] = useState<string | null>(null);
-  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
-  const [responses, setResponses] = useState<SymptomResponse[]>([]);
-  const [showResults, setShowResults] = useState(false);
+  const [messages, setMessages] = useState<ChatMessage[]>([
+    {
+      id: '1',
+      text: "Hello! I'm here to help you understand your symptoms. What's bothering you today?",
+      isBot: true,
+      timestamp: new Date()
+    }
+  ]);
+  const [inputText, setInputText] = useState('');
+  const [currentStep, setCurrentStep] = useState('start');
+  const [showOptions, setShowOptions] = useState(true);

   const router = useRouter();
   const { t } = useLanguage();

-  const handleSymptomSelect = (symptomId: string) => {
-    setCurrentSymptom(symptomId);
-    setCurrentQuestionIndex(0);
-    setResponses([]);
-    setShowResults(false);
+  const addMessage = (text: string, isBot: boolean = false) => {
+    const newMessage: ChatMessage = {
+      id: Date.now().toString(),
+      text,
+      isBot,
+      timestamp: new Date()
+    };
+    setMessages(prev => [...prev, newMessage]);
   };

-  const handleResponse = (response: 'yes' | 'no' | 'not_sure') => {
-    if (!currentSymptom) return;
-
-    const newResponse: SymptomResponse = {
-      symptomId: currentSymptom,
-      response
-    };
-
-    const updatedResponses = [...responses, newResponse];
-    setResponses(updatedResponses);
-
-    const questions = SYMPTOM_QUESTIONS[currentSymptom as keyof typeof SYMPTOM_QUESTIONS];
-    if (currentQuestionIndex < questions.length - 1) {
-      setCurrentQuestionIndex(currentQuestionIndex + 1);
-    } else {
-      setShowResults(true);
+  const handleOptionSelect = (option: string) => {
+    addMessage(option, false);
+    setShowOptions(false);
+    
+    setTimeout(() => {
+      const symptomKey = option.toLowerCase().replace(' ', '-');
+      const nextStep = SYMPTOM_FLOW[symptomKey as keyof typeof SYMPTOM_FLOW];
+      
+      if (nextStep) {
+        addMessage(nextStep.message, true);
+        setCurrentStep(symptomKey);
+        setShowOptions(true);
+      } else {
+        // Provide diagnosis based on symptoms
+        const diagnosis = getDiagnosis(option);
+        addMessage(diagnosis, true);
+        
+        setTimeout(() => {
+          addMessage("Would you like to consult with a doctor for proper diagnosis?", true);
+          setShowOptions(true);
+          setCurrentStep('consult');
+        }, 1000);
+      }
+    }, 1000);
+  };
+
+  const getDiagnosis = (symptom: string): string => {
+    const diagnoses = {
+      'Mild pain': "Based on your symptoms, you might have tension headache. Try rest and hydration.",
+      'Severe pain': "Severe headache could indicate migraine or other serious conditions. Please consult a doctor.",
+      'Low grade (99-100°F)': "Low grade fever might indicate viral infection. Rest and monitor temperature.",
+      'High (102°F+)': "High fever needs immediate medical attention. Please consult a doctor now.",
+      'Dry cough': "Dry cough could be due to allergies or viral infection. Stay hydrated.",
+      'Wet cough': "Productive cough might indicate respiratory infection. Consider seeing a doctor.",
+      'Upper abdomen': "Upper abdominal pain could be related to gastritis or acid reflux.",
+      'Back pain': "Back pain might be due to muscle strain. Rest and gentle stretching may help."
+    };
+    
+    return diagnoses[symptom as keyof typeof diagnoses] || "Based on your symptoms, I recommend consulting with a healthcare professional for proper diagnosis.";
+  };
+
+  const handleSendMessage = () => {
+    if (inputText.trim()) {
+      addMessage(inputText, false);
+      setInputText('');
+      
+      setTimeout(() => {
+        addMessage("Thank you for sharing. Let me help you with that symptom.", true);
+      }, 1000);
     }
   };

-  const getRecommendation = () => {
-    const yesCount = responses.filter(r => r.response === 'yes').length;
-    const totalQuestions = responses.length;
-    
-    if (yesCount >= totalQuestions * 0.7) {
-      return {
-        severity: 'high',
-        message: 'Based on your symptoms, we recommend consulting a doctor immediately.',
-        action: 'Consult Doctor Now'
-      };
-    } else if (yesCount >= totalQuestions * 0.4) {
-      return {
-        severity: 'medium',
-        message: 'Your symptoms suggest you should see a doctor for proper diagnosis.',
-        action: 'Schedule Consultation'
-      };
-    } else {
-      return {
-        severity: 'low',
-        message: 'Your symptoms appear mild. Monitor and consider consulting if they persist.',
-        action: 'Get First Aid Tips'
-      };
-    }
+  const getCurrentOptions = () => {
+    if (currentStep === 'consult') {
+      return ['Yes, consult doctor', 'No, just advice'];
+    }
+    return SYMPTOM_FLOW[currentStep as keyof typeof SYMPTOM_FLOW]?.options || [];
   };

-  const resetChecker = () => {
-    setCurrentSymptom(null);
-    setCurrentQuestionIndex(0);
-    setResponses([]);
-    setShowResults(false);
+  const handleConsultOption = (option: string) => {
+    addMessage(option, false);
+    if (option === 'Yes, consult doctor') {
+      setTimeout(() => {
+        addMessage("Great! I'll redirect you to our doctors. They can provide proper diagnosis and treatment.", true);
+        setTimeout(() => {
+          router.push('/doctors/disease-selection');
+        }, 2000);
+      }, 1000);
+    } else {
+      addMessage("Please monitor your symptoms and consult a doctor if they worsen or persist.", true);
+    }
   };

-  if (showResults) {
-    const recommendation = getRecommendation();
-    
-    return (
-      <View style={styles.container}>
-        <Header 
-          title={t('symptomChecker')} 
-          showBack 
-          onBack={resetChecker}
-          showHome
-          onHome={() => router.push('/')}
-        />
-        
-        <ScrollView style={styles.content}>
-          <View style={styles.resultCard}>
-            <Text style={styles.resultTitle}>{t('assessmentComplete')}</Text>
-            <View style={[
-              styles.severityBadge, 
-              { backgroundColor: 
-                recommendation.severity === 'high' ? '#FEE2E2' : 
-                recommendation.severity === 'medium' ? '#FEF3C7' : '#ECFDF5' 
-              }
-            ]}>
-              <Text style={[
-                styles.severityText,
-                { color: 
-                  recommendation.severity === 'high' ? '#DC2626' : 
-                  recommendation.severity === 'medium' ? '#D97706' : '#16A34A' 
-                }
-              ]}>
-                {recommendation.severity === 'high' ? t('highPriority') :
-                 recommendation.severity === 'medium' ? t('mediumPriority') : t('lowPriority')}
-              </Text>
-            </View>
-            
-            <Text style={styles.recommendationText}>
-              {recommendation.message}
-            </Text>
-            
-            <TouchableOpacity 
-              style={styles.actionButton}
-              onPress={() => router.push('/doctors')}
-            >
-              <Text style={styles.actionButtonText}>
-                {recommendation.severity === 'high' ? t('consultDoctorNow') :
-                 recommendation.severity === 'medium' ? t('scheduleConsultation') : t('getFirstAidTips')}
-              </Text>
-            </TouchableOpacity>
-            
-            <TouchableOpacity 
-              style={styles.secondaryButton}
-              onPress={resetChecker}
-            >
-              <Text style={styles.secondaryButtonText}>
-                {t('checkAnotherSymptom')}
-              </Text>
-            </TouchableOpacity>
-          </View>
-          
-          <View style={styles.voiceSection}>
-            <VoiceButton text={recommendation.message} />
-          </View>
-        </ScrollView>
-      </View>
-    );
-  }
-
-  if (currentSymptom) {
-    const questions = SYMPTOM_QUESTIONS[currentSymptom as keyof typeof SYMPTOM_QUESTIONS];
-    const currentQuestion = questions[currentQuestionIndex];
-    
-    return (
-      <View style={styles.container}>
-        <Header 
-          title={t('symptomChecker')} 
-          showBack 
-          onBack={() => setCurrentSymptom(null)}
-          showHome
-          onHome={() => router.push('/')}
-        />
-        
-        <View style={styles.questionContainer}>
-          <View style={styles.progressContainer}>
-            <Text style={styles.progressText}>
-              {t('question')} {currentQuestionIndex + 1} {t('of')} {questions.length}
-            </Text>
-            <View style={styles.progressBar}>
-              <View 
-                style={[
-                  styles.progressFill, 
-                  { width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }
-                ]} 
-              />
-            </View>
-          </View>
-          
-          <Text style={styles.question}>{currentQuestion}</Text>
-          
-          <View style={styles.responseButtons}>
-            <TouchableOpacity 
-              style={[styles.responseButton, styles.yesButton]}
-              onPress={() => handleResponse('yes')}
-            >
-              <Text style={styles.responseButtonIcon}>✅</Text>
-              <Text style={styles.responseButtonText}>{t('yes')}</Text>
-            </TouchableOpacity>
-            
-            <TouchableOpacity 
-              style={[styles.responseButton, styles.noButton]}
-              onPress={() => handleResponse('no')}
-            >
-              <Text style={styles.responseButtonIcon}>❌</Text>
-              <Text style={styles.responseButtonText}>{t('no')}</Text>
-            </TouchableOpacity>
-            
-            <TouchableOpacity 
-              style={[styles.responseButton, styles.unsureButton]}
-              onPress={() => handleResponse('not_sure')}
-            >
-              <Text style={styles.responseButtonIcon}>❓</Text>
-              <Text style={styles.responseButtonText}>{t('notSure')}</Text>
-            </TouchableOpacity>
-          </View>
-          
-          <View style={styles.voiceSection}>
-            <VoiceButton text={currentQuestion} />
-          </View>
-        </View>
-      </View>
-    );
-  }
-
   return (
-    <View style={styles.container}>
-      <Header 
-        title={t('symptomChecker')} 
-        showHome
-        onHome={() => router.push('/')}
-      />
-      
-      <ScrollView style={styles.content}>
-        <View style={styles.instruction}>
-          <Text style={styles.instructionTitle}>{t('selectMainSymptom')}</Text>
-          <Text style={styles.instructionText}>
-            {t('chooseSymptom')}
-          </Text>
-          <VoiceButton text={t('selectMainSymptom')} />
-        </View>
-        
-        <View style={styles.symptomList}>
-          {COMMON_SYMPTOMS.map((symptom) => (
-            <TouchableOpacity
-              key={symptom.id}
-              style={styles.symptomItem}
-              onPress={() => handleSymptomSelect(symptom.id)}
-            >
-              <View style={[
-                styles.symptomIconContainer,
-                { backgroundColor: 
-                  symptom.category === 'general' ? '#EF4444' :
-                  symptom.category === 'respiratory' ? '#3B82F6' :
-                  symptom.category === 'pain' ? '#F59E0B' :
-                  symptom.category === 'digestive' ? '#22C55E' :
-                  symptom.category === 'dermatological' ? '#8B5CF6' :
-                  '#6B7280'
-                }
-              ]}>
-                <Text style={styles.symptomIcon}>{symptom.icon}</Text>
-              </View>
-              <Text style={styles.symptomName}>{symptom.name}</Text>
-            </TouchableOpacity>
-          ))}
-        </View>
+    <SafeAreaView style={styles.container}>
+      {/* Header */}
+      <View style={styles.header}>
+        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
+          <Ionicons name="arrow-back" size={24} color={WHITE} />
+        </TouchableOpacity>
+        <Text style={styles.headerTitle}>AI Symptom Checker</Text>
+        <TouchableOpacity style={styles.helpButton}>
+          <Ionicons name="help-circle-outline" size={24} color={WHITE} />
+        </TouchableOpacity>
+      </View>
+
+      {/* Chat Messages */}
+      <ScrollView style={styles.chatContainer} showsVerticalScrollIndicator={false}>
+        {messages.map((message) => (
+          <View key={message.id} style={[
+            styles.messageContainer,
+            message.isBot ? styles.botMessage : styles.userMessage
+          ]}>
+            {message.isBot && (
+              <View style={styles.botAvatar}>
+                <Text style={styles.botAvatarText}>🤖</Text>
+              </View>
+            )}
+            <View style={[
+              styles.messageBubble,
+              message.isBot ? styles.botBubble : styles.userBubble
+            ]}>
+              <Text style={[
+                styles.messageText,
+                message.isBot ? styles.botText : styles.userText
+              ]}>
+                {message.text}
+              </Text>
+            </View>
+          </View>
+        ))}
+        
+        {/* Options */}
+        {showOptions && (
+          <View style={styles.optionsContainer}>
+            {getCurrentOptions().map((option, index) => (
+              <TouchableOpacity
+                key={index}
+                style={styles.optionButton}
+                onPress={() => currentStep === 'consult' ? handleConsultOption(option) : handleOptionSelect(option)}
+                activeOpacity={0.8}
+              >
+                <Text style={styles.optionText}>{option}</Text>
+              </TouchableOpacity>
+            ))}
+          </View>
+        )}
       </ScrollView>
-    </View>
+
+      {/* Input Area */}
+      <View style={styles.inputContainer}>
+        <TextInput
+          style={styles.textInput}
+          value={inputText}
+          onChangeText={setInputText}
+          placeholder="Type your symptoms here..."
+          placeholderTextColor="#9CA3AF"
+          multiline
+        />
+        <TouchableOpacity 
+          style={styles.sendButton} 
+          onPress={handleSendMessage}
+          disabled={!inputText.trim()}
+        >
+          <Ionicons name="send" size={20} color={inputText.trim() ? PRIMARY_BLUE : '#9CA3AF'} />
+        </TouchableOpacity>
+      </View>
+    </SafeAreaView>
   );
 }

@@ .. @@
   container: {
     flex: 1,
-    backgroundColor: '#F9FAFB',
+    backgroundColor: WHITE,
   },
-  content: {
-    flex: 1,
+  header: {
+    backgroundColor: PRIMARY_BLUE,
+    flexDirection: 'row',
+    alignItems: 'center',
+    justifyContent: 'space-between',
+    paddingHorizontal: 16,
+    paddingVertical: 12,
   },
-  instruction: {
-    padding: 20,
-    backgroundColor: 'white',
-    margin: 16,
-    borderRadius: 12,
-    alignItems: 'center',
+  backButton: {
+    padding: 4,
   },
-  instructionTitle: {
-    fontSize: 20,
+  headerTitle: {
+    fontSize: 18,
     fontWeight: '600',
-    color: '#111827',
-    marginBottom: 8,
+    color: WHITE,
+    flex: 1,
+    textAlign: 'center',
+    marginHorizontal: 16,
   },
-  instructionText: {
-    fontSize: 16,
-    color: '#6B7280',
-    textAlign: 'center',
-    marginBottom: 16,
+  helpButton: {
+    padding: 4,
   },
-  symptomList: {
+  chatContainer: {
+    flex: 1,
     padding: 16,
+    backgroundColor: '#F8F9FA',
   },
-  symptomItem: {
+  messageContainer: {
     flexDirection: 'row',
-    alignItems: 'center',
-    backgroundColor: 'white',
-    padding: 16,
     marginBottom: 12,
-    borderRadius: 12,
-    shadowColor: '#000',
-    shadowOffset: { width: 0, height: 2 },
-    shadowOpacity: 0.1,
-    shadowRadius: 4,
-    elevation: 3,
   },
-  symptomIconContainer: {
-    width: 60,
-    height: 60,
-    borderRadius: 12,
+  botMessage: {
+    justifyContent: 'flex-start',
+  },
+  userMessage: {
+    justifyContent: 'flex-end',
+  },
+  botAvatar: {
+    width: 32,
+    height: 32,
+    borderRadius: 16,
+    backgroundColor: LIGHT_BLUE,
     justifyContent: 'center',
     alignItems: 'center',
-    marginRight: 16,
+    marginRight: 8,
+    alignSelf: 'flex-end',
   },
-  symptomIcon: {
-    fontSize: 28,
+  botAvatarText: {
+    fontSize: 16,
   },
-  symptomName: {
-    fontSize: 16,
-    fontWeight: '600',
-    color: '#111827',
-    flex: 1,
+  messageBubble: {
+    maxWidth: '80%',
+    paddingHorizontal: 16,
+    paddingVertical: 12,
+    borderRadius: 20,
   },
-  questionContainer: {
-    flex: 1,
-    padding: 20,
-    justifyContent: 'center',
+  botBubble: {
+    backgroundColor: WHITE,
+    borderBottomLeftRadius: 4,
   },
-  progressContainer: {
-    marginBottom: 40,
+  userBubble: {
+    backgroundColor: PRIMARY_BLUE,
+    borderBottomRightRadius: 4,
   },
-  progressText: {
-    fontSize: 16,
-    color: '#6B7280',
-    marginBottom: 8,
-    textAlign: 'center',
+  messageText: {
+    fontSize: 15,
+    lineHeight: 20,
   },
-  progressBar: {
-    height: 8,
-    backgroundColor: '#E5E7EB',
-    borderRadius: 4,
+  botText: {
+    color: '#1F2937',
   },
-  progressFill: {
-    height: '100%',
-    backgroundColor: '#22C55E',
-    borderRadius: 4,
+  userText: {
+    color: WHITE,
   },
-  question: {
-    fontSize: 24,
-    fontWeight: '600',
-    color: '#111827',
-    textAlign: 'center',
-    marginBottom: 40,
-    lineHeight: 32,
+  optionsContainer: {
+    marginTop: 12,
+    marginLeft: 40,
   },
-  responseButtons: {
-    gap: 16,
+  optionButton: {
+    backgroundColor: WHITE,
+    borderWidth: 1,
+    borderColor: PRIMARY_BLUE,
+    borderRadius: 20,
+    paddingHorizontal: 16,
+    paddingVertical: 10,
+    marginBottom: 8,
+    alignSelf: 'flex-start',
   },
-  responseButton: {
+  optionText: {
+    color: PRIMARY_BLUE,
+    fontSize: 14,
+    fontWeight: '500',
+  },
+  inputContainer: {
     flexDirection: 'row',
     alignItems: 'center',
-    padding: 20,
+    paddingHorizontal: 16,
+    paddingVertical: 12,
+    backgroundColor: WHITE,
+    borderTopWidth: 1,
+    borderTopColor: '#E5E7EB',
+  },
+  textInput: {
+    flex: 1,
+    borderWidth: 1,
+    borderColor: '#D1D5DB',
     borderRadius: 12,
-    elevation: 2,
-    shadowOffset: { width: 0, height: 2 },
-    shadowOpacity: 0.1,
-    shadowRadius: 3.84,
+    paddingHorizontal: 16,
+    paddingVertical: 12,
+    fontSize: 16,
+    maxHeight: 100,
+    marginRight: 12,
   },
-  yesButton: {
-    backgroundColor: '#DCFCE7',
+  sendButton: {
+    width: 44,
+    height: 44,
+    borderRadius: 22,
+    backgroundColor: LIGHT_BLUE,
+    justifyContent: 'center',
+    alignItems: 'center',
   },
-  noButton: {
-    backgroundColor: '#FEE2E2',
-  },
-  unsureButton: {
-    backgroundColor: '#FEF3C7',
-  },
-  responseButtonIcon: {
-    fontSize: 32,
-    marginRight: 16,
-  },
-  responseButtonText: {
-    fontSize: 18,
-    fontWeight: '600',
-    color: '#111827',
-  },
-  voiceSection: {
-    alignItems: 'center',
-    marginTop: 20,
-  },
-  resultCard: {
-    backgroundColor: 'white',
-    margin: 16,
-    padding: 24,
-    borderRadius: 12,
-    alignItems: 'center',
-  },
-  resultTitle: {
-    fontSize: 24,
-    fontWeight: '600',
-    color: '#111827',
-    marginBottom: 16,
-  },
-  severityBadge: {
-    paddingHorizontal: 12,
-    paddingVertical: 6,
-    borderRadius: 16,
-    marginBottom: 16,
-  },
-  severityText: {
-    fontSize: 14,
-    fontWeight: '600',
-  },
-  recommendationText: {
-    fontSize: 16,
-    color: '#374151',
-    textAlign: 'center',
-    marginBottom: 24,
-    lineHeight: 24,
-  },
-  actionButton: {
-    backgroundColor: '#22C55E',
-    paddingHorizontal: 24,
-    paddingVertical: 12,
-    borderRadius: 8,
-    marginBottom: 12,
-  },
-  actionButtonText: {
-    fontSize: 16,
-    fontWeight: '600',
-    color: 'white',
-  },
-  secondaryButton: {
-    paddingHorizontal: 24,
-    paddingVertical: 12,
-  },
-  secondaryButtonText: {
-    fontSize: 16,
-    color: '#3B82F6',
-    textDecorationLine: 'underline',
-  }
 });