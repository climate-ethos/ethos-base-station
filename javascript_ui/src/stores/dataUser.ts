import { defineStore } from 'pinia';
import { UserData } from 'src/typings/data-types';

export const useDataUserStore = defineStore('dataUser', {
  persist: true,

  state: (): UserData => ({
    postcode: undefined,
    latitude: undefined,
    longitude: undefined,
    ageYears: undefined,
    heightCm: undefined,
    weightKg: undefined,
    sex: undefined,
  }),

  getters: {
    containsUndefined(state) {
      // Inverse (!) has to be used to return boolean
      return (
        !state.postcode ||
        !state.latitude ||
        !state.longitude ||
        !state.ageYears ||
        !state.heightCm ||
        !state.weightKg ||
        !state.sex
      );
    },
  },

  actions: {},
});
