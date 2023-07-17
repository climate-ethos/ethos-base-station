import { AudioType, RiskLevel, SensorData } from 'src/components/models';
import { useVolumeStore } from 'src/stores/volume';

let currentAudio: HTMLAudioElement | null = null;
let currentUtterance: SpeechSynthesisUtterance | null = null;

const generateTextToSpeech = (
  riskLevel: RiskLevel,
  sensorData?: SensorData
) => {
  switch (riskLevel) {
    case RiskLevel.LOW:
      return 'There is a low priority alert';
    case RiskLevel.MEDIUM:
      return sensorData
        ? `The ${sensorData.name} is at an elevated temperature`
        : 'There is a medium priority alert';
    case RiskLevel.HIGH:
      return sensorData
        ? `The ${sensorData.name} is at a dangerous temperature`
        : 'There is a high priority alert';
  }
};

const playAudioTone = (riskLevel: RiskLevel): Promise<void> => {
  const volumeStore = useVolumeStore();
  return new Promise((resolve) => {
    let audio = new Audio('/medium-priority-alert.mp3');
    if (riskLevel === RiskLevel.HIGH) {
      audio = new Audio('/high-priority-alert.mp3');
    }
    audio.volume = volumeStore.volumePercent;
    audio.onended = () => {
      currentAudio = null;
      resolve();
    };
    currentAudio = audio;
    audio.play();
  });
};

export const playTextToSpeech = (text: string): Promise<void> => {
  const volumeStore = useVolumeStore();
  return new Promise((resolve) => {
    const utter = new SpeechSynthesisUtterance();
    utter.text = text;
    utter.volume = volumeStore.volumePercent;
    utter.rate = 0.9;
    utter.onend = () => {
      currentUtterance = null;
      resolve();
    };
    speechSynthesis.speak(utter);
    currentUtterance = utter;
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
      return Promise.reject();
  }
};
