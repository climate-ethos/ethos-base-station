import { defineStore } from 'pinia';
import { AudioType } from 'src/typings/data-types';
import { coolingStrategies } from 'src/helpers/coolingStrategies';
import { PreferencesDatabaseStructure } from 'src/typings/database-types';
import { useDatabaseStore } from 'src/stores/database';

const defaultOptions = {
  haveAccessTo: true,
  wouldUse: true,
  whyNotUse: [] as Array<string>,
  whyNotUseOther: '',
};

export const useDataPreferencesStore = defineStore('dataPreferences', {
  persist: true,

  state: (): PreferencesDatabaseStructure => ({
    audioType: AudioType.TONE,
    isFollowUp: false,
    coolingStrategyOptions: Object.keys(coolingStrategies).map((key) => {
      return {
        key,
        ...defaultOptions,
      };
    }),
  }),

  getters: {
    coolingStrategyRows: (state) => {
      // Append extra strategy info
      let coolingStrategyRows = state.coolingStrategyOptions.map((option) => {
        return { ...option, ...coolingStrategies[option.key] };
      });
      // Sort by group type
      coolingStrategyRows = coolingStrategyRows.sort((a, b) => {
        if (a.group < b.group) {
          return 1;
        } else if (a.group == b.group) {
          return 0;
        }
        return -1;
      });
      // Append new group info row each time row changes
      let comparator = '';
      for (let i = 0; i < coolingStrategyRows.length; i++) {
        const option = coolingStrategyRows[i];
        if (option.group != comparator) {
          comparator = option.group;
          coolingStrategyRows.splice(i, 0, {
            // Strategy
            name: comparator,
            shortName: '',
            icon: '',
            effectiveness: 0,
            group: '',
            extraInfo: {
              bestUse: [],
              whenUse: [],
              whenNotUse: [],
            },
            // Additional options
            key: '',
            ...defaultOptions,
          });
        }
      }
      return coolingStrategyRows;
    },
  },

  actions: {
    // Post the current preferences data to the database
    postToDatabase() {
      const databaseStore = useDatabaseStore();
      console.log('Saving preferences...', this.$state);
      databaseStore.postDocument('preferences', this.$state);
    },
    // Set a either 'haveAccessTo' or 'wouldUse' for a particular strategy
    setWouldUseOrHaveAccessTo(
      strategyKey: string,
      optionKey: 'haveAccessTo' | 'wouldUse',
      newValue: boolean
    ) {
      const strategy = this.coolingStrategyOptions.find(
        (strategy) => strategy.key === strategyKey
      );
      if (strategy) {
        strategy[optionKey] = newValue;
      }
    },
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
