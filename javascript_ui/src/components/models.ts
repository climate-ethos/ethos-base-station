// Define sensor data interface
export interface SocketSensorData {
  id?: string;
  temperature?: string;
  humidity?: string;
}

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
  sex: undefined | 'male' | 'female' | 'other';
}

export interface CoolingStrategy {
  name: string;
  shortName: string;
  icon: string;
  effectiveness: number;
  group:
    | 'Water immersion'
    | 'Other water'
    | 'Clothing related'
    | 'Air ventilation'
    | 'Activity based'
    | '';
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
