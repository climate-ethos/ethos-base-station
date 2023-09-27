import { AudioType, RiskLevel, SensorData } from 'src/typings/data-types';
import { useVolumeStore } from 'src/stores/volume';

let currentAudio: HTMLAudioElement | null = null;
let currentUtterance: SpeechSynthesisUtterance | null = null;

/**
 * Note: This function needs to be called at initialization as the
 * first time it is called the array of voice options will be empty
 * @returns Array with voice options available
 */
export const getSpeechSynthesisVoices = () => {
  window.speechSynthesis.onvoiceschanged = (e) => {
    console.log('Voices loaded:', e);
  };
  return window.speechSynthesis.getVoices();
};

const generateTextToSpeech = (
  riskLevel: RiskLevel,
  sensorData?: SensorData
) => {
  switch (riskLevel) {
    case RiskLevel.LOW:
      return 'There is a low priority alert';
    case RiskLevel.MEDIUM:
      return sensorData
        ? `Your system indicates a medium level heat alert at: ${sensorData.name}`
        : 'Your system indicates a medium level heat alert';
    case RiskLevel.HIGH:
      return sensorData
        ? `Your system indicates a high level heat alert at: ${sensorData.name}`
        : 'Your system indicates a high level heat alert';
  }
};

const playAudioTone = (riskLevel: RiskLevel): Promise<void> => {
  const volumeStore = useVolumeStore();
  return new Promise((resolve, reject) => {
    try {
      let audio = new Audio('medium-priority-alert.mp3');
      if (riskLevel === RiskLevel.HIGH) {
        audio = new Audio('high-priority-alert.mp3');
      }
      audio.volume = volumeStore.volumePercent;
      audio.onended = () => {
        currentAudio = null;
        resolve();
      };
      currentAudio = audio;
      audio.play().catch((error) => {
        currentAudio = null;
        console.error('Error playing audio:', error);
        reject(error);
      });
    } catch (error) {
      currentAudio = null;
      console.error(error);
      reject(error);
    }
  });
};

export const playTextToSpeech = (text: string): Promise<void> => {
  const volumeStore = useVolumeStore();
  return new Promise((resolve, reject) => {
    // Check for speech synthesis existence
    if (!('SpeechSynthesisUtterance' in window)) {
      const error = new Error(
        'SpeechSynthesisUtterance is not supported in this browser'
      );
      console.error(error);
      throw error;
    }
    // Try to generate speech
    try {
      const voices = getSpeechSynthesisVoices();
      const utter = new SpeechSynthesisUtterance();
      console.log(voices);
      if (voices && voices.length > 0) {
        // Select a local voice (in this case Karen with en-AU lang)
        utter.voice = voices[0];
      } else {
        console.warn('No voices found. Proceeding without setting voice.');
      }
      utter.text = text;
      utter.volume = volumeStore.volumePercent;
      utter.rate = 0.9;
      utter.onend = () => {
        currentUtterance = null;
        resolve();
      };
      utter.onerror = (errorEvent) => {
        currentUtterance = null;
        console.error('Error during speech synthesis:', errorEvent.error);
        reject(errorEvent.error);
      };
      currentUtterance = utter;
      speechSynthesis.speak(utter);
    } catch (error) {
      currentUtterance = null;
      console.error('Error in playTextToSpeech:', error);
      reject(error);
    }
  });
};

export const stopAudio = () => {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.dispatchEvent(new Event('ended'));
  }
  if (currentUtterance) {
    speechSynthesis.cancel();
  }
};

export const playAudio = (
  audioType: AudioType,
  riskLevel: RiskLevel,
  sensorData?: SensorData
): Promise<void> => {
  stopAudio(); // Stop any currently playing audio before starting new one
  switch (audioType) {
    case AudioType.TONE:
      return playAudioTone(riskLevel);
    case AudioType.TTS:
      const alertText = generateTextToSpeech(riskLevel, sensorData);
      return playTextToSpeech(alertText);
    default:
      console.error('Unable to find correct audio type');
      return Promise.reject(new Error('Unable to find correct audio type'));
  }
};
