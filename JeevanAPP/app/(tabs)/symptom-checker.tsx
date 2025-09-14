import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '@/components/common/Header';
import { IconButton } from '@/components/common/IconButton';
import { VoiceButton } from '@/components/common/VoiceButton';
import { useLanguage } from '@/contexts/LanguageContext';
import { COMMON_SYMPTOMS, SYMPTOM_QUESTIONS } from '@/constants/symptoms';
import { SymptomResponse } from '@/types';

export default function SymptomCheckerScreen() {
  const [currentSymptom, setCurrentSymptom] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<SymptomResponse[]>([]);
  const [showResults, setShowResults] = useState(false);

  const router = useRouter();
  const { t } = useLanguage();

  const handleSymptomSelect = (symptomId: string) => {
    setCurrentSymptom(symptomId);
    setCurrentQuestionIndex(0);
    setResponses([]);
    setShowResults(false);
  };

  const handleResponse = (response: 'yes' | 'no' | 'not_sure') => {
    if (!currentSymptom) return;

    const newResponse: SymptomResponse = {
      symptomId: currentSymptom,
      response
    };

    const updatedResponses = [...responses, newResponse];
    setResponses(updatedResponses);

    const questions = SYMPTOM_QUESTIONS[currentSymptom as keyof typeof SYMPTOM_QUESTIONS];
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const getRecommendation = () => {
    const yesCount = responses.filter(r => r.response === 'yes').length;
    const totalQuestions = responses.length;
    
    if (yesCount >= totalQuestions * 0.7) {
      return {
        severity: 'high',
        message: 'Based on your symptoms, we recommend consulting a doctor immediately.',
        action: 'Consult Doctor Now'
      };
    } else if (yesCount >= totalQuestions * 0.4) {
      return {
        severity: 'medium',
        message: 'Your symptoms suggest you should see a doctor for proper diagnosis.',
        action: 'Schedule Consultation'
      };
    } else {
      return {
        severity: 'low',
        message: 'Your symptoms appear mild. Monitor and consider consulting if they persist.',
        action: 'Get First Aid Tips'
      };
    }
  };

  const resetChecker = () => {
    setCurrentSymptom(null);
    setCurrentQuestionIndex(0);
    setResponses([]);
    setShowResults(false);
  };

  if (showResults) {
    const recommendation = getRecommendation();
    
    return (
      <View style={styles.container}>
        <Header 
          title={t('symptomChecker')} 
          showBack 
          onBack={resetChecker}
          showHome
          onHome={() => router.push('/')}
        />
        
        <ScrollView style={styles.content}>
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>{t('assessmentComplete')}</Text>
            <View style={[
              styles.severityBadge, 
              { backgroundColor: 
                recommendation.severity === 'high' ? '#FEE2E2' : 
                recommendation.severity === 'medium' ? '#FEF3C7' : '#ECFDF5' 
              }
            ]}>
              <Text style={[
                styles.severityText,
                { color: 
                  recommendation.severity === 'high' ? '#DC2626' : 
                  recommendation.severity === 'medium' ? '#D97706' : '#16A34A' 
                }
              ]}>
                {recommendation.severity === 'high' ? t('highPriority') :
                 recommendation.severity === 'medium' ? t('mediumPriority') : t('lowPriority')}
              </Text>
            </View>
            
            <Text style={styles.recommendationText}>
              {recommendation.message}
            </Text>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/doctors')}
            >
              <Text style={styles.actionButtonText}>
                {recommendation.severity === 'high' ? t('consultDoctorNow') :
                 recommendation.severity === 'medium' ? t('scheduleConsultation') : t('getFirstAidTips')}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={resetChecker}
            >
              <Text style={styles.secondaryButtonText}>
                {t('checkAnotherSymptom')}
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.voiceSection}>
            <VoiceButton text={recommendation.message} />
          </View>
        </ScrollView>
      </View>
    );
  }

  if (currentSymptom) {
    const questions = SYMPTOM_QUESTIONS[currentSymptom as keyof typeof SYMPTOM_QUESTIONS];
    const currentQuestion = questions[currentQuestionIndex];
    
    return (
      <View style={styles.container}>
        <Header 
          title={t('symptomChecker')} 
          showBack 
          onBack={() => setCurrentSymptom(null)}
          showHome
          onHome={() => router.push('/')}
        />
        
        <View style={styles.questionContainer}>
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              {t('question')} {currentQuestionIndex + 1} {t('of')} {questions.length}
            </Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }
                ]} 
              />
            </View>
          </View>
          
          <Text style={styles.question}>{currentQuestion}</Text>
          
          <View style={styles.responseButtons}>
            <TouchableOpacity 
              style={[styles.responseButton, styles.yesButton]}
              onPress={() => handleResponse('yes')}
            >
              <Text style={styles.responseButtonIcon}>✅</Text>
              <Text style={styles.responseButtonText}>{t('yes')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.responseButton, styles.noButton]}
              onPress={() => handleResponse('no')}
            >
              <Text style={styles.responseButtonIcon}>❌</Text>
              <Text style={styles.responseButtonText}>{t('no')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.responseButton, styles.unsureButton]}
              onPress={() => handleResponse('not_sure')}
            >
              <Text style={styles.responseButtonIcon}>❓</Text>
              <Text style={styles.responseButtonText}>{t('notSure')}</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.voiceSection}>
            <VoiceButton text={currentQuestion} />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header 
        title={t('symptomChecker')} 
        showHome
        onHome={() => router.push('/')}
      />
      
      <ScrollView style={styles.content}>
        <View style={styles.instruction}>
          <Text style={styles.instructionTitle}>{t('selectMainSymptom')}</Text>
          <Text style={styles.instructionText}>
            {t('chooseSymptom')}
          </Text>
          <VoiceButton text={t('selectMainSymptom')} />
        </View>
        
        <View style={styles.symptomList}>
          {COMMON_SYMPTOMS.map((symptom) => (
            <TouchableOpacity
              key={symptom.id}
              style={styles.symptomItem}
              onPress={() => handleSymptomSelect(symptom.id)}
            >
              <View style={[
                styles.symptomIconContainer,
                { backgroundColor: 
                  symptom.category === 'general' ? '#EF4444' :
                  symptom.category === 'respiratory' ? '#3B82F6' :
                  symptom.category === 'pain' ? '#F59E0B' :
                  symptom.category === 'digestive' ? '#22C55E' :
                  symptom.category === 'dermatological' ? '#8B5CF6' :
                  '#6B7280'
                }
              ]}>
                <Text style={styles.symptomIcon}>{symptom.icon}</Text>
              </View>
              <Text style={styles.symptomName}>{symptom.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
  },
  instruction: {
    padding: 20,
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  instructionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  symptomList: {
    padding: 16,
  },
  symptomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  symptomIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  symptomIcon: {
    fontSize: 28,
  },
  symptomName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  questionContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  progressContainer: {
    marginBottom: 40,
  },
  progressText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
    textAlign: 'center',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#22C55E',
    borderRadius: 4,
  },
  question: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 32,
  },
  responseButtons: {
    gap: 16,
  },
  responseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  yesButton: {
    backgroundColor: '#DCFCE7',
  },
  noButton: {
    backgroundColor: '#FEE2E2',
  },
  unsureButton: {
    backgroundColor: '#FEF3C7',
  },
  responseButtonIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  responseButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  voiceSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  resultCard: {
    backgroundColor: 'white',
    margin: 16,
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  severityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 16,
  },
  severityText: {
    fontSize: 14,
    fontWeight: '600',
  },
  recommendationText: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  actionButton: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  secondaryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  secondaryButtonText: {
    fontSize: 16,
    color: '#3B82F6',
    textDecorationLine: 'underline',
  }
});