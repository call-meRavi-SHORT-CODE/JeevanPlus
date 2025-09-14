import * as Speech from 'expo-speech';

class VoiceService {
  private currentLanguage: 'punjabi' | 'hindi' | 'english' = 'punjabi';

  setLanguage(language: 'punjabi' | 'hindi' | 'english') {
    this.currentLanguage = language;
  }

  speak(text: string) {
    const options = {
      language: this.getLanguageCode(),
      pitch: 1.0,
      rate: 0.8
    };

    Speech.speak(text, options);
  }

  stop() {
    Speech.stop();
  }

  private getLanguageCode(): string {
    switch (this.currentLanguage) {
      case 'punjabi':
        return 'pa-IN';
      case 'hindi':
        return 'hi-IN';
      case 'english':
        return 'en-IN';
      default:
        return 'en-IN';
    }
  }

  // Mock speech-to-text - in real app, use react-native-voice or Google Speech API
  async startListening(): Promise<string> {
    return new Promise((resolve) => {
      // Mock voice input
      setTimeout(() => {
        resolve('Mock voice input');
      }, 2000);
    });
  }

  stopListening() {
    // Mock stop listening
  }
}

export default new VoiceService();