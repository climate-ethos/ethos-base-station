import { SensorData } from 'src/typings/data-types';

export const shouldUseFan = (
  sensor: SensorData
): 'yes' | 'maybe' | 'no' | undefined => {
  if (sensor.humidity && sensor.temperature) {
    /* Based on table 1 from here:
     * https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(21)01209-5/fulltext
     */
    if (sensor.temperature < 37) {
      // Safe to use fan
      return 'yes';
    } else if (sensor.temperature < 38) {
      // Can maybe use fan
      return 'maybe';
    } else {
      // Should not use fan
      return 'no';
    }
  }
  return undefined;
};
