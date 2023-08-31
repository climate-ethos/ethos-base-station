import { defineStore } from 'pinia';

export const useDateTimeStore = defineStore({
  id: 'dateTime',

  state: () => ({
    currentDate: new Date(),
  }),

  actions: {
    updateCurrentDate() {
      console.log('updating date...');
      this.currentDate = new Date();
    },

    startInterval() {
      setInterval(() => {
        this.updateCurrentDate();
      }, 60000); // Update every minute
    },
  },
});
