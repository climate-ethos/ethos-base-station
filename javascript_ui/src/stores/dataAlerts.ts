import { defineStore } from 'pinia';

import { playAudio } from 'src/helpers/audioAlertDispatcher';
import { useDataPreferencesStore } from 'src/stores/dataPreferences';
import { useDatabaseStore } from 'src/stores/database';
import { useVolumeStore } from 'src/stores/volume';
import { useSurveyStore } from 'src/stores/survey';

import { RiskLevel, SensorData } from 'src/typings/data-types';
import { isOutdoorSensor } from 'src/helpers/dataSensor';

/**
 * Deserialize a given string representation of sensor data.
 * @param {string} alertsDataString - A JSON string representing alerts data.
 * @returns {Object} Parsed state of sensor data.
 */
export const deserializeAlertsData = (alertsDataString: string) => {
  // Parse the JSON string
  const state = JSON.parse(alertsDataString);
  // Convert all date strings in 'lastAlerts' to Date objects
  for (const level in state.lastAlerts) {
    if (state.lastAlerts[level]) {
      state.lastAlerts[level] = new Date(state.lastAlerts[level]);
    }
  }
  // Return parsed state
  return state;
};

export const useDataAlertsStore = defineStore('dataAlerts', {
  persist: {
    serializer: {
      deserialize: deserializeAlertsData,
      serialize: JSON.stringify,
    },
  },
  state: () => ({
    alertRiskLevel: RiskLevel.LOW,
    lastAlerts: {} as { [level in RiskLevel]?: Date },
    isShowRoomSelectModal: false,
    userLocatedAt: '',
  }),
  actions: {
    /**
     * Take in sensor measurement, and work out if an alert should be displayed
     * @param sensorData The sensor data of most recently received data
     * @returns void
     */
    handleAlertLogic(
      sensorData: SensorData,
      oldRiskLevel: RiskLevel | undefined
    ) {
      // Sanity check
      if (!sensorData.riskLevel) {
        return;
      }
      // If no previous risk level, assume it to be low
      oldRiskLevel = oldRiskLevel ? oldRiskLevel : RiskLevel.LOW;
      // Conditions where we don't need to send an alert
      if (
        sensorData.riskLevel === RiskLevel.LOW ||
        isOutdoorSensor(sensorData) ||
        oldRiskLevel >= sensorData.riskLevel
      ) {
        // No further action needed
        return;
      }
      // Check if alert is for the room a person is in
      if (sensorData.location === this.userLocatedAt) {
        // Send alert
        this.sendAlert(sensorData);
        return;
      }
      // Check if risk level is less than current alert
      if (sensorData.riskLevel < this.alertRiskLevel) {
        // No further action needed
        return;
      }
      // Check if alert of this RiskLevel has been sent in the past 30 minutes
      const lastAlert = this.lastAlerts[sensorData.riskLevel];
      const thirtyMinutes = 30 * 60 * 1000;
      if (
        lastAlert &&
        new Date().getTime() - lastAlert.getTime() < thirtyMinutes
      ) {
        // Don't display alert
        return;
      }
      // If we are here, we should display the alert
      this.sendAlert(sensorData);
    },
    /**
     *
     * @param sensorData The sensor data of most recently received data
     * @returns void
     */
    sendAlert(sensorData: SensorData) {
      const currentTime = new Date();
      // Load stores
      const databaseStore = useDatabaseStore();
      const volumeStore = useVolumeStore();
      const surveyStore = useSurveyStore();
      const dataPreferencesStore = useDataPreferencesStore();

      // Sanity check
      if (!sensorData.riskLevel) {
        return;
      }

      // Display alert
      surveyStore.incrementAlertCount();
      this.alertRiskLevel = sensorData.riskLevel;

      // Update last alert time
      this.lastAlerts[sensorData.riskLevel] = currentTime;
      if (sensorData.riskLevel === RiskLevel.HIGH) {
        // Also update medium alert last sent if high risk
        this.lastAlerts[RiskLevel.MEDIUM] = currentTime;
      }

      // Play audio
      playAudio(
        dataPreferencesStore.audioType,
        sensorData.riskLevel,
        sensorData
      );

      // Record alert in database
      databaseStore.postDocument('alert', {
        riskLevel: sensorData.riskLevel,
        volumePercent: volumeStore.volumePercent,
        dismissMethod: null,
      });
    },
  },
});
