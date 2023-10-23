// Sensor Data
export interface SocketSensorData {
  id: number;
  temperature: number;
  humidity: number;
  voltage: number;
  rssi: number;
}

export interface SensorData {
  id: number | undefined;
  location: string | undefined;
  temperature: number | undefined;
  humidity: number | undefined;
  voltage: number | undefined;
  rssi: number | undefined;
  lastSeen: Date | undefined;
  coreTemperature: number | undefined;
  riskLevel: RiskLevel | undefined;
}

export enum RiskLevel {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
}

// User data
export interface UserData {
  id: undefined | number;
  password: undefined | string;
  postcode: undefined | number;
  latitude: undefined | number;
  longitude: undefined | number;
  ageYears: undefined | number;
  heightCm: undefined | number;
  weightKg: undefined | number;
  sex: undefined | 'male' | 'female' | 'other';
}

// Preferences
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

export enum AudioType {
  TONE = 'tone',
  TTS = 'text-to-speech',
}
