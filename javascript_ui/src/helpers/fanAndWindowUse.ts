import { SensorData } from 'src/components/models';

export const shouldUseFan = (
  sensor: SensorData
): 'yes' | 'maybe' | 'no' | undefined => {
  if (sensor.humidity && sensor.temperature) {
    /* Based on Figure 1 (healthy older people)
     * https://www.thelancet.com/journals/lanplh/article/PIIS2542-5196(21)00136-4/fulltext
     */
    const x = sensor.humidity;
    const fanThreshold =
      -3.24 * Math.pow(x, 4) * Math.pow(10, -7) +
      8.4 * Math.pow(x, 3) * Math.pow(10, -5) -
      7.86 * Math.pow(x, 2) * Math.pow(10, -3) +
      2.43 * Math.pow(x, 1) * Math.pow(10, -1) +
      37.93;

    if (sensor.temperature < fanThreshold - 1) {
      // Safe to use fan
      return 'yes';
    } else if (sensor.temperature < fanThreshold + 1) {
      // Can maybe use fan
      return 'maybe';
    } else {
      // Should not use fan
      return 'no';
    }
  }
  return undefined;
};
