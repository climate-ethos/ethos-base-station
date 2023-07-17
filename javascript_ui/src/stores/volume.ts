import { defineStore } from 'pinia';

// Stores the maximum value of the volume slider
export const maxVolume = 5;

export const useVolumeStore = defineStore('volume', {
  persist: true,

  state: () => ({
    volumeValue: 5,
  }),

  getters: {
    volumePercent(state) {
      return state.volumeValue / maxVolume;
    },
  },

  actions: {
    increaseVolume() {
      if (this.volumeValue < maxVolume) {
        this.volumeValue++;
      }
    },
    decreaseVolume() {
      if (this.volumeValue > 0) {
        this.volumeValue--;
      }
    },
  },
});
