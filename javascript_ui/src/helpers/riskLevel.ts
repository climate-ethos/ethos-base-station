import { SensorData, RiskLevel } from 'src/components/models';

const calculateWBGT = (sensorData: SensorData) => {
  // Equation taken from:
  // https://physicscalc.com/physics/wet-bulb-calculator/
  const temperature = sensorData.temperature;
  const humidity = sensorData.humidity;
  if (!temperature || !humidity) {
    return undefined;
  }
  const wetBulbTemperature =
    temperature * Math.atan(0.151977 * Math.pow(humidity + 8.313659, 1 / 2)) +
    Math.atan(temperature + humidity) -
    Math.atan(humidity - 1.676331) +
    0.00391838 * Math.pow(humidity, 3 / 2) * Math.atan(0.023101 * humidity) -
    4.686035;
  return wetBulbTemperature;
};

// Return the risk level as 'high', 'medium', low' or '' (undefined)
const getRiskLevel = (sensorData: SensorData) => {
  const wetBulbTemperature = calculateWBGT(sensorData);
  // Check undefined
  if (!wetBulbTemperature) {
    console.log('Unable to find correct risk level (no WBGT defined)');
    return undefined;
  }
  if (wetBulbTemperature >= 30) {
    return RiskLevel.HIGH;
  } else if (wetBulbTemperature >= 25) {
    return RiskLevel.MEDIUM;
  } else if (wetBulbTemperature < 25) {
    return RiskLevel.LOW;
  } else {
    console.log('Unable to find correct risk level (unknown error)');
    return undefined;
  }
};

export { calculateWBGT, getRiskLevel };
