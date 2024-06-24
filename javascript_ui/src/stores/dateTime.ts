import { defineStore } from 'pinia';

const dateString = 'January 15, 2024 12:13:00';

export const useDateTimeStore = defineStore({
  id: 'dateTime',

  state: () => ({
    currentDate: new Date(dateString),
  }),

  actions: {
    updateCurrentDate() {
      console.log('updating date...');
      this.currentDate = new Date(dateString);
    },

    startInterval() {
      setInterval(() => {
        this.updateCurrentDate();
      }, 60000); // Update every minute
    },
  },
});
