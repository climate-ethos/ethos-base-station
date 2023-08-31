import { SensorData, RiskLevel } from 'src/typings/data-types';

/**
 * Deserialize a given string representation of sensor data.
 * @param {string} sensorDataString - A JSON string representing sensor data.
 * @returns {Object} Parsed state of sensor data.
 */
export const deserializeSensorData = (sensorDataString: string) => {
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

/**
 * Determine if a sensor is an outdoor sensor based on its name.
 * @param {SensorData} sensor - The sensor data object.
 * @returns {boolean} True if the sensor is an outdoor sensor, false otherwise.
 */
export const isOutdoorSensor = (sensor: SensorData) => {
  return sensor.name?.toLowerCase().includes('out');
};

/**
 * Determine if a sensor is offline based on its last seen time.
 * Offline in this case is defined as data received over 30 minutes ago.
 * @param {SensorData} sensor - The sensor data object.
 * @param {number} currentTime - Current time in milliseconds.
 * @returns {boolean} True if the sensor is offline, false otherwise.
 */
export const isOfflineSensor = (sensor: SensorData, currentTime: number) => {
  const lastSeen = sensor.lastSeen?.getTime();
  if (!lastSeen) {
    return true;
  }
  const timeDifference = Math.abs(lastSeen - currentTime);
  const thirtyMinutes = 1800000; // in ms
  return timeDifference > thirtyMinutes;
};

/**
 * Find the index of the first outdoor sensor in an array of sensors.
 * @param {Array<SensorData>} sensorData - Array of sensor data objects.
 * @returns {number} Index of the first outdoor sensor. Returns -1 if not found.
 */
export const findOutdoorSensorIndex = (sensorData: Array<SensorData>) => {
  const outsideIndex = sensorData.findIndex((el) => {
    if (isOutdoorSensor(el)) {
      return true;
    }
    return false;
  });
  return outsideIndex;
};

/**
 * Determine the risk level based on the given core temperature.
 * @param {number | undefined} coreTemperature - The core temperature value.
 * @returns {RiskLevel | undefined} Returns the risk level or undefined if the input is invalid or unknown error occurs.
 */
export const getRiskLevel = (coreTemperature: number | undefined) => {
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
