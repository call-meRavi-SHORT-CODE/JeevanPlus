import { Symptom } from '@/types';

export const COMMON_SYMPTOMS: Symptom[] = [
  {
    id: 'fever',
    name: 'Fever',
    icon: '🌡️',
    category: 'general'
  },
  {
    id: 'cough',
    name: 'Cold & Cough',
    icon: '🤧',
    category: 'respiratory'
  },
  {
    id: 'bodyPain',
    name: 'Body Pain',
    icon: '💪',
    category: 'pain'
  },
  {
    id: 'headache',
    name: 'Headache',
    icon: '🤕',
    category: 'pain'
  },
  {
    id: 'diarrhea',
    name: 'Diarrhea',
    icon: '🚽',
    category: 'digestive'
  },
  {
    id: 'skinInfection',
    name: 'Skin Infection',
    icon: '🧴',
    category: 'dermatological'
  },
  {
    id: 'stomachPain',
    name: 'Stomach Pain',
    icon: '🤰',
    category: 'digestive'
  },
  {
    id: 'seasonalFlu',
    name: 'Seasonal Flu',
    icon: '🤒',
    category: 'respiratory'
  },
  {
    id: 'dengue',
    name: 'Dengue/Malaria',
    icon: '🦟',
    category: 'vector-borne'
  }
];

export const SYMPTOM_QUESTIONS = {
  fever: [
    'Do you have high temperature?',
    'Are you feeling hot?',
    'Do you have chills?'
  ],
  cough: [
    'Are you coughing?',
    'Do you have runny nose?',
    'Is your throat sore?'
  ],
  bodyPain: [
    'Do you feel pain in your body?',
    'Are your muscles aching?',
    'Do you feel weak?'
  ],
  headache: [
    'Does your head hurt?',
    'Do you feel dizzy?',
    'Is the pain severe?'
  ],
  diarrhea: [
    'Do you have loose motions?',
    'Are you going to toilet frequently?',
    'Do you feel dehydrated?'
  ],
  skinInfection: [
    'Do you have rashes on skin?',
    'Is your skin itching?',
    'Do you see any wounds?'
  ],
  stomachPain: [
    'Does your stomach hurt?',
    'Do you feel nauseous?',
    'Have you vomited?'
  ],
  seasonalFlu: [
    'Do you have flu symptoms?',
    'Are you sneezing frequently?',
    'Do you feel tired?'
  ],
  dengue: [
    'Do you have high fever?',
    'Do you see red spots on skin?',
    'Are you feeling very weak?'
  ]
};