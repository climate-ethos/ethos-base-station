import { defineStore } from 'pinia';
import { useSurveyStore } from './survey';

// Ten minutes in milliseconds
const tenMinutes = 10 * 60000;

export const useSocketBomStore = defineStore('socketBom', {
  state: () => ({
    isPolling: false,
    pollingInterval: null as null | ReturnType<typeof setInterval>,
  }),

  actions: {
    /**
     * Mark the variable to show the BOM survey at 7pm that evening
     */
    showBomSurvey() {
      const surveyStore = useSurveyStore();
      surveyStore.isActiveBomAlert = true;
      console.log('BOM survey will be displayed at 7pm');
    },
    /**
     * Check whether we should show the bom survey
     */
    async checkForBomSurvey() {
      try {
        const response = await fetch(
          `https://${process.env.COUCH_DB_URL}:8080/displaySurvey`
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data.displaySurvey && data.displaySurvey === true) {
          this.showBomSurvey();
        }
      } catch (error) {
        console.error('Failed to fetch displaySurvey:', error);
      }
    },
    /**
     * Start polling the displaySurvey endpoint
     */
    startPolling() {
      console.log('Starting to poll displaySurvey endpoint...');

      this.pollingInterval = setInterval(this.checkForBomSurvey, tenMinutes); // Poll every 10 minutes
      this.checkForBomSurvey(); // Run once now

      this.isPolling = true;
    },

    /**
     * Stop polling the displaySurvey endpoint
     */
    stopPolling() {
      if (this.pollingInterval) {
        clearInterval(this.pollingInterval);
        this.pollingInterval = null;
        this.isPolling = false;
        console.log('Stopped polling displaySurvey endpoint');
      }
    },
  },
});
