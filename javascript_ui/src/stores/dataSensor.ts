import { defineStore } from 'pinia';
import {
  RiskLevel,
  SensorData,
  SocketSensorData,
} from 'src/typings/data-types';
import { playAudio } from 'src/helpers/audioAlertDispatcher';
import { useDataPreferencesStore } from 'src/stores/dataPreferences';
import { useSocketStore } from 'src/stores//socket';
import { useDatabaseStore } from './database';
import { useVolumeStore } from './volume';
import { useSurveyStore } from 'src/stores/survey';

const deserializeSensorData = (sensorDataString: string) => {
  // Parse the JSON string
  const state = JSON.parse(sensorDataString);
  state.allSensorData.forEach((dataSensor: SensorData) => {
    // Parse the date (previously lost with JSON.stringify())
    dataSensor.lastSeen = dataSensor.lastSeen
      ? new Date(dataSensor.lastSeen)
      : undefined;
  });
  // Return parsed state
  return state;
};

export const isOutdoorSensor = (sensor: SensorData) => {
  return sensor.name?.toLowerCase().includes('out');
};

const findOutdoorSensorIndex = (sensorData: Array<SensorData>) => {
  const outsideIndex = sensorData.findIndex((el) => {
    if (isOutdoorSensor(el)) {
      return true;
    }
    return false;
  });
  return outsideIndex;
};

// Return the riskLevel for a given core temperature
const getRiskLevel = (coreTemperature: number | undefined) => {
  if (!coreTemperature) {
    console.error(
      'Unable to calculate risk level (core temperature undefined)'
    );
    return undefined;
  } else if (coreTemperature >= 38) {
    return RiskLevel.HIGH;
  } else if (coreTemperature >= 37.7) {
    return RiskLevel.MEDIUM;
  } else if (coreTemperature < 37.7) {
    return RiskLevel.LOW;
  } else {
    console.error('Unable to calculate risk level (unknown error)');
    return undefined;
  }
};

export const useDataSensorStore = defineStore('dataSensor', {
  persist: {
    serializer: {
      deserialize: deserializeSensorData,
      serialize: JSON.stringify,
    },
  },

  state: () => ({
    alertSensor: null as SensorData | null,
    allSensorData: [
      {
        id: undefined,
        name: undefined,
        temperature: undefined,
        humidity: undefined,
        lastSeen: undefined,
        riskLevel: undefined,
      },
      {
        id: undefined,
        name: undefined,
        temperature: undefined,
        humidity: undefined,
        lastSeen: undefined,
        riskLevel: undefined,
      },
      {
        id: undefined,
        name: undefined,
        temperature: undefined,
        humidity: undefined,
        lastSeen: undefined,
        riskLevel: undefined,
      },
      {
        id: undefined,
        name: undefined,
        temperature: undefined,
        humidity: undefined,
        lastSeen: undefined,
        riskLevel: undefined,
      },
    ] as Array<SensorData>, // sensor data
  }),

  getters: {
    // Check whether either the name or id of ANY of the sensors are undefined
    containsUndefined: (state) => {
      for (const sensor of state.allSensorData) {
        // If no sensor ID or sensor name
        if (!sensor.id || !sensor.name) {
          return true;
        }
      }
      return false;
    },
    // Return outdoor sensor values
    getOutdoorSensor: (state) => {
      const outsideIndex = findOutdoorSensorIndex(state.allSensorData);
      return state.allSensorData[outsideIndex];
    },
    // Get deep copy of sensor data
    getDeepCopySensorData: (state) => {
      return deserializeSensorData(JSON.stringify(state)).allSensorData;
    },
    // Get sorted sensor data, where the outside sensor comes last in the list
    getSortedSensorData: (state) => {
      // Take a shallow copy of the array to prevent data mutation
      const copyOfSensorData = [...state.allSensorData];
      // Find index of the sensor that has 'out' in its name
      const outsideIndex = findOutdoorSensorIndex(copyOfSensorData);
      // If a sensor matches outside, push it to the end of the array
      if (outsideIndex >= 0) {
        copyOfSensorData.push(copyOfSensorData.splice(outsideIndex, 1)[0]);
      }
      return copyOfSensorData;
    },
  },

  actions: {
    setup() {
      // Load stores
      const databaseStore = useDatabaseStore();
      const volumeStore = useVolumeStore();
      // Setup socket store if it is not yet ready
      const socketStore = useSocketStore();
      if (!socketStore.isConnected) {
        socketStore.initialize();
      }

      // Callback to update sensor data when applicable
      socketStore.onSensorData(async (data: SocketSensorData) => {
        console.log('Received:');
        console.log(data);

        // Check data
        if (!(data.id && data.temperature && data.humidity)) {
          // Error: Some of the data is missing
          console.error('Invalid/missing socket data');
          console.log('ID:', data.id);
          console.log('Temperature:', data.temperature);
          console.log('Humidity:', data.humidity);
          return;
        }

        // Parse strings to numbers
        const id = parseInt(data.id);
        const temperature = parseFloat(data.temperature);
        const humidity = parseFloat(data.humidity);

        // Check numbers are correctly parsed
        if (isNaN(id) || isNaN(temperature) || isNaN(humidity)) {
          // Error:
          console.error('Error parsing strings to numbers');
          console.log('ID:', data.id);
          console.log('Temperature:', data.temperature);
          console.log('Humidity:', data.humidity);
          return;
        }

        // Check it exists in the array
        const i = this.allSensorData.findIndex(
          (dataSensor) => dataSensor.id == id
        );
        if (i < 0) {
          // Could not find index
          console.log('Wrong sensor id:', id);
          return;
        }

        // Update array values
        const sensorData = this.allSensorData[i];
        sensorData.temperature = temperature;
        sensorData.humidity = humidity;
        sensorData.lastSeen = new Date(Date.now());

        // Calculate core temperature
        const predictedCoreTemperature =
          await socketStore.calculatePredictedCoreTemperature(sensorData);

        // Calculate risk level
        const newRiskLevel = getRiskLevel(predictedCoreTemperature);
        const oldRiskLevel = sensorData.riskLevel;
        sensorData.riskLevel = newRiskLevel;

        // Send sensor data to database
        databaseStore.postDocument('sensor', {
          sensorId: sensorData.id,
          sensorLocation: sensorData.name,
          temperature: sensorData.temperature,
          humidity: sensorData.humidity,
        });

        // Display alert if risk level has gone up on indoor sensor
        if (
          oldRiskLevel &&
          newRiskLevel &&
          newRiskLevel > oldRiskLevel &&
          !isOutdoorSensor(sensorData)
        ) {
          // Add to alerts count
          const surveyStore = useSurveyStore();
          surveyStore.incrementAlertCount();
          // Display alert
          this.alertSensor = { ...sensorData }; // Shallow copy
          // Get audio type preferences
          const dataPreferencesStore = useDataPreferencesStore();
          // Send alert sound
          playAudio(
            dataPreferencesStore.audioType,
            newRiskLevel,
            this.alertSensor
          );
          // Send alert data to database
          databaseStore.postDocument('alert', {
            riskLevel: newRiskLevel,
            volumePercent: volumeStore.volumePercent,
            dismissMethod: null,
          });
        }
      });
    },
  },
});
