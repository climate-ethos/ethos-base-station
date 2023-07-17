import { defineStore } from 'pinia';
import { AudioType } from 'src/components/models';
import { coolingStrategies } from 'src/helpers/coolingStrategies';

export const useDataPreferencesStore = defineStore('dataPreferences', {
  persist: true,

  state: () => ({
    audioType: AudioType.TONE,
    coolingStrategyOptions: coolingStrategies.map((strategy) => {
      return {
        ...strategy,
        haveAccessTo: true,
        wouldUse: true,
        whyNotUse: [] as Array<string>,
        whyNotUseOther: '',
      };
    }),
  }),

  getters: {},

  actions: {},
});
