import { defineStore } from 'pinia';
import { SurveyDatabaseStructure } from 'src/typings/database-types';
import { useDatabaseStore } from './database';

export const useSurveyStore = defineStore('survey', {
  persist: true,
  state: () => ({
    // Track how many alerts to see if we need to show survey
    alertsSinceLastSurvey: 0,
    // Keep the number of alerts in last time period to display to user
    alertsInLastTimePeriod: 0,
    // Whether to show the survey modal
    isShowSurveyModal: false,
    // User answers to survey
    surveyAnswers: {
      wasHome: undefined,
      coolingStrategiesUsed: [],
      howEffective: undefined,
    } as SurveyDatabaseStructure,
  }),
  actions: {
    incrementAlertCount() {
      this.alertsSinceLastSurvey++;
    },
    postSurveyAnswers() {
      const databaseStore = useDatabaseStore();
      databaseStore.postDocument('survey', this.surveyAnswers);
    },
    setup() {
      const checkAndDisplaySurvey = () => {
        const currentHour = new Date().getHours();
        if (currentHour === 19 && this.alertsSinceLastSurvey > 0) {
          console.log('Showing survey...');
          // Store number of alerts
          const alertsInLastTimePeriod = this.alertsSinceLastSurvey;
          // Reset store (including count)
          this.$reset();
          // Set the number of alerts in last time period
          this.alertsInLastTimePeriod = alertsInLastTimePeriod;
          // Show modal
          this.isShowSurveyModal = true;
        }
      };

      // Check every 5 minutes for surveys
      checkAndDisplaySurvey();
      setInterval(checkAndDisplaySurvey, 5 * 60 * 1000);
    },
  },
});
