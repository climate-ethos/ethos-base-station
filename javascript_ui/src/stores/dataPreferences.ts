import { defineStore } from 'pinia';
import { AudioType } from 'src/components/models';
import { coolingStrategies } from 'src/helpers/coolingStrategies';

const defaultOptions = {
  haveAccessTo: true,
  wouldUse: true,
  whyNotUse: [] as Array<string>,
  whyNotUseOther: '',
};

export const useDataPreferencesStore = defineStore('dataPreferences', {
  persist: true,

  state: () => ({
    audioType: AudioType.TONE,
    isFollowUp: false,
    coolingStrategyOptions: Object.keys(coolingStrategies).map((key) => {
      return {
        key,
        ...defaultOptions,
      };
    }),
  }),

  getters: {},

  actions: {
    // Check if any new cooling strategy options are added / deleted
    updateCoolingStrategyOptions() {
      // Get the current strategy keys
      const currentKeys = this.coolingStrategyOptions.map(
        (option) => option.key
      );

      // Iterate through the keys in coolingStrategies and add new ones with default options
      const updatedOptions = Object.keys(coolingStrategies).map((key) => {
        // If key is new, add it with default options, otherwise copy existing
        if (!currentKeys.includes(key)) {
          return {
            key,
            ...defaultOptions,
          };
        } else {
          return (
            this.coolingStrategyOptions.find(
              (option) => option.key === key
            ) || {
              key,
              ...defaultOptions,
            }
          );
        }
      });

      // Replace the current options with the updated options
      this.coolingStrategyOptions = updatedOptions;
    },
  },
});
