import { defineStore } from 'pinia';
import {
  deserializeSensorData,
  isOfflineSensor,
  isOutdoorSensor,
  findOutdoorSensorIndex,
  getRiskLevel,
} from 'src/helpers/dataSensor';
import {
  SensorData,
  SocketSensorData,
  RiskLevel,
} from 'src/typings/data-types';
import { useSocketStore } from 'src/stores/socket';
import { useDatabaseStore } from 'src/stores/database';
import { useDataAlertsStore } from './dataAlerts';
export const useDataSensorStore = defineStore('dataSensor', {
  persist: {
    serializer: {
      deserialize: deserializeSensorData,
      serialize: JSON.stringify,
    },
  },

  state: () => ({
    allSensorData: [
      {
        id: undefined,
        location: 'Main bedroom',
        temperature: undefined,
        humidity: undefined,
        voltage: undefined,
        rssi: undefined,
        lastSeen: undefined,
        coreTemperatureDelta: undefined,
        riskLevel: undefined,
      },
      {
        id: undefined,
        location: 'Living room',
        temperature: undefined,
        humidity: undefined,
        voltage: undefined,
        rssi: undefined,
        lastSeen: undefined,
        coreTemperatureDelta: undefined,
        riskLevel: undefined,
      },
      {
        id: undefined,
        location: undefined,
        temperature: undefined,
        humidity: undefined,
        voltage: undefined,
        rssi: undefined,
        lastSeen: undefined,
        coreTemperatureDelta: undefined,
        riskLevel: undefined,
      },
      {
        id: undefined,
        location: 'Outside',
        temperature: undefined,
        humidity: undefined,
        voltage: undefined,
        rssi: undefined,
        lastSeen: undefined,
        coreTemperatureDelta: undefined,
        riskLevel: undefined,
      },
    ] as Array<SensorData>, // sensor data
  }),

  getters: {
    // Check whether either the name or id of ANY of the sensors are undefined
    containsUndefined: (state) => {
      for (const sensor of state.allSensorData) {
        // If no sensor ID or sensor name
        if (!sensor.id || !sensor.location) {
          return true;
        }
      }
      return false;
    },
    // Return the coolest sensor/room
    getCoolestSensor: (state) => {
      const currentTime = Date.now();
      // Filter out sensors that are either outdoors or not currently online
      const indoorOnlineSensors = state.allSensorData.filter((sensor) => {
        return (
          !isOutdoorSensor(sensor) && !isOfflineSensor(sensor, currentTime)
        );
      });

      // Return null if there are no valid indoor sensors
      if (indoorOnlineSensors.length === 0) {
        return null;
      }

      // Determine the coolest sensor by comparing the temperature property
      let coolestSensor = indoorOnlineSensors[0];
      for (const sensor of indoorOnlineSensors) {
        if (
          sensor.temperature &&
          coolestSensor.temperature &&
          sensor.temperature < coolestSensor.temperature
        ) {
          coolestSensor = sensor;
        }
      }

      return coolestSensor;
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
      // this.allSensorData[0] = {
      //   ...this.allSensorData[0],
      //   temperature: 33.1,
      //   humidity: 45.9,
      //   lastSeen: new Date(Date.now() - 34 * 1000),
      //   riskLevel: RiskLevel.LOW,
      //   coreTemperatureDelta: 0,
      //   voltage: 4.2,
      //   rssi: -70,
      // };
      // this.allSensorData[1] = {
      //   ...this.allSensorData[1],
      //   temperature: 35.4,
      //   humidity: 51.2,
      //   lastSeen: new Date(Date.now() - 520 * 1000),
      //   riskLevel: RiskLevel.MEDIUM,
      //   coreTemperatureDelta: 0.1,
      //   voltage: 4.2,
      //   rssi: -84,
      // };
      // this.allSensorData[2] = {
      //   ...this.allSensorData[2],
      //   temperature: 29.2,
      //   humidity: 49.7,
      //   lastSeen: new Date(Date.now() - 185 * 1000),
      //   riskLevel: RiskLevel.LOW,
      //   coreTemperatureDelta: 0,
      //   voltage: 4.2,
      //   rssi: -84,
      // };
      // this.allSensorData[3] = {
      //   ...this.allSensorData[3],
      //   temperature: 38.5,
      //   humidity: 56.3,
      //   lastSeen: new Date(Date.now() - 120 * 1000),
      //   riskLevel: RiskLevel.HIGH,
      //   coreTemperatureDelta: 0.2,
      //   voltage: 4.2,
      //   rssi: -104,
      // };

      // Load stores
      const databaseStore = useDatabaseStore();
      const dataAlertsStore = useDataAlertsStore();
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

        // Unpack data
        const { id, temperature, humidity, voltage, rssi } = data;

        // Check it exists in the array
        const i = this.allSensorData.findIndex(
          (dataSensor) => dataSensor.id == id
        );
        if (i < 0) {
          // Could not find index
          console.log('Wrong sensor id:', id);
          return;
        }

        // Update sensor data
        const sensorData = this.allSensorData[i];
        sensorData.temperature = temperature;
        sensorData.humidity = humidity;
        sensorData.voltage = voltage;
        sensorData.rssi = rssi;
        sensorData.lastSeen = new Date(Date.now());
        sensorData.coreTemperatureDelta =
          await socketStore.calculateChangeCoreTemperature(sensorData);
        const oldRiskLevel = sensorData.riskLevel; // Save old risk level
        sensorData.riskLevel = getRiskLevel(sensorData.coreTemperatureDelta);

        // Send sensor data to database
        databaseStore.postDocument('sensor', {
          sensorId: sensorData.id,
          sensorLocation: sensorData.location,
          temperature: sensorData.temperature,
          humidity: sensorData.humidity,
          voltage: sensorData.voltage,
          rssi: sensorData.rssi,
          coreTemperatureDelta: sensorData.coreTemperatureDelta,
        });

        // Check whether to send alert and alert if necessary
        dataAlertsStore.handleAlertLogic(sensorData, oldRiskLevel);
      });
    },
  },
});
