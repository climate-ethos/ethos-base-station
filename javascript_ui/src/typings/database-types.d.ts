import { AudioType, RiskLevel } from 'src/typings/data-types';

export interface BaseDatabaseStructure {
  type: 'sensor' | 'weather' | 'preferences' | 'survey' | 'alert';
  time: Date;
  userId: string;
}

export interface SensorDatabaseStructure {
  sensorLocation: string | undefined;
  sensorId: number | undefined;
  temperature: number | undefined;
  humidity: number | undefined;
}

export interface WeatherDatabaseStructure {
  weatherLocation: string | null;
  temperature: number | null;
  humidity: number | null;
}

export interface PreferencesDatabaseStructure {
  audioType: AudioType;
  isFollowUp: boolean;
  coolingStrategyOptions: Array<{
    key: string;
    haveAccessTo: boolean;
    wouldUse: boolean;
    whyNotUse: Array<string>;
    whyNotUseOther: string;
  }>;
}

export interface SurveyDatabaseStructure {
  todo: null;
  // TODO: Fill in rest once questions finalized
}

export interface AlertDatabaseStructure {
  riskLevel: RiskLevel | undefined;
  volumePercent: number;
  dismissMethod: null | 'not here' | 'cooling strategies' | 'dismiss';
}
