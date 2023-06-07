export interface SensorData {
  name: string | undefined;
  id: number | undefined;
  temperature: number | undefined;
  humidity: number | undefined;
  lastSeen: Date | undefined;
  riskLevel: RiskLevel | undefined;
}

export interface UserData {
  id: undefined | number;
  postcode: undefined | number;
  latitude: undefined | number;
  longitude: undefined | number;
  ageYears: undefined | number;
  heightCm: undefined | number;
  weightKg: undefined | number;
}

export interface CoolingStrategy {
  name: string;
  shortName: string;
  icon: string;
  effectiveness: number;
  extraInfo: {
    bestUse: Array<string>;
    whenUse: Array<string>;
    whenNotUse: Array<string>;
  };
}

export enum RiskLevel {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
}

export enum AudioType {
  TONE = 'tone',
  TTS = 'text-to-speech',
}
