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
    // When survey is shown
    surveyDisplayDateString: null as null | string,
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
    checkAndDisplaySurvey() {
      const currentDate = new Date();
      const currentHour = currentDate.getHours();
      if (currentHour === 19 && this.alertsSinceLastSurvey > 0) {
        console.log('Showing survey...');
        // Update when string for when survey sent
        this.surveyDisplayDateString = currentDate.toLocaleDateString();
        /**
         * Note: Not sure why set timeout is needed here but otherwise
         * string does not display on survey
         */
        setTimeout(() => {
          this.surveyDisplayDateString = currentDate.toLocaleDateString();
        }, 10);
        // Store number of alerts
        const alertsInLastTimePeriod = this.alertsSinceLastSurvey;
        // Reset store (including count)
        this.$reset();
        // Set the number of alerts in last time period
        this.alertsInLastTimePeriod = alertsInLastTimePeriod;
        // Show modal
        this.isShowSurveyModal = true;
      }
    },
    setup() {
      this.checkAndDisplaySurvey();
      // Check every 5 minutes for surveys
      setInterval(this.checkAndDisplaySurvey, 5 * 60 * 1000);
    },
  },
});
