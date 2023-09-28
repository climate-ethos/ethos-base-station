import { AudioType, RiskLevel, SensorData } from 'src/typings/data-types';
import { useVolumeStore } from 'src/stores/volume';

let currentAudio: HTMLAudioElement | null = null;

type ResponsiveVoiceOptions = {
  rate?: number;
  pitch?: number;
  volume?: number;
  onend?: () => void;
  onerror?: (error: unknown) => void;
  onpause?: () => void;
  onresume?: () => void;
};

interface ResponsiveVoice {
  speak: (
    text: string,
    voice?: string,
    options?: ResponsiveVoiceOptions
  ) => void;
  cancel: () => void;
}

// Declare responsiveVoice which is defined in index.html
declare const responsiveVoice: ResponsiveVoice | undefined;

// Manual resolver to allow resolving promise when tts is canceled
let resolveTextToSpeech: (() => void) | null = null;

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
    resolveTextToSpeech = resolve;
    try {
      if (!responsiveVoice) {
        const error = 'ResponsiveVoice not defined';
        console.error(error);
        throw new Error(error);
      }
      responsiveVoice.speak(text, 'UK English Female', {
        rate: 0.9,
        volume: volumeStore.volumePercent,
        onend: () => {
          resolveTextToSpeech = null;
          resolve();
        },
        onerror: (error) => {
          resolveTextToSpeech = null;
          console.error('Error in playTextToSpeech:', error);
          reject(error);
        },
      });
    } catch (error) {
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
  // Manually resolve promise
  if (resolveTextToSpeech) {
    resolveTextToSpeech();
    resolveTextToSpeech = null;
  }
  // Cancel any ongoing text-to-speech
  if (responsiveVoice) {
    responsiveVoice.cancel();
  }
};

export const playAudio = async (
  audioType: AudioType,
  riskLevel: RiskLevel,
  sensorData?: SensorData
): Promise<void> => {
  stopAudio(); // Stop any currently playing audio before starting new one
  switch (audioType) {
    case AudioType.TONE:
      return await playAudioTone(riskLevel);
    case AudioType.TTS:
      const alertText = generateTextToSpeech(riskLevel, sensorData);
      try {
        // Attempt to play text-to-speech
        await playTextToSpeech(alertText);
        return;
      } catch {
        // If an error is thrown, catch it and play an audio tone instead
        // This should allow alerts to work, even offline
        await playAudioTone(riskLevel);
        return;
      }
    default:
      console.error('Unable to find correct audio type');
      throw new Error('Unable to find correct audio type');
  }
};
