<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue';

import { getSpeechSynthesisVoices } from './helpers/audioAlertDispatcher';

import { useDataSensorStore } from 'stores/dataSensor';
import { useForecastStore } from 'stores/forecast';
import { useDataPreferencesStore } from './stores/dataPreferences';
import { useDatabaseStore } from './stores/database';
import { useSurveyStore } from './stores/survey';
import { useDateTimeStore } from './stores/dateTime';

export default defineComponent({
  name: 'App',
  // Setup store connections here
  setup() {
    // Note: This needs to be called to initialize the list of voices available
    getSpeechSynthesisVoices();

    // Setup stores
    const dataSensorStore = useDataSensorStore();
    dataSensorStore.setup();

    const dataPreferencesStore = useDataPreferencesStore();
    dataPreferencesStore.updateCoolingStrategyOptions();

    const forecastStore = useForecastStore();
    forecastStore.setup();
    const surveyStore = useSurveyStore();
    surveyStore.setup();

    // Start updating time
    const dateTimeStore = useDateTimeStore();
    dateTimeStore.startInterval();

    // Initialize database
    const databaseStore = useDatabaseStore();
    databaseStore.initializeDatabase();
    // Update database link when user id changes
    watch(
      () => process.env.USER_ID,
      (newId, oldId) => {
        if (newId && newId !== oldId) {
          databaseStore.initializeDatabase();
        }
      },
      { immediate: true }
    );

    /**
     * Add touch/click feedback to the screen.
     * Every time a user presses the screen, an animated circle will appear in that location.
     */
    document.addEventListener('click', function (event: MouseEvent) {
      const effect = document.createElement('div');
      effect.classList.add('click-effect');
      effect.style.top = `${event.clientY - 25}px`; // offset by half the height/width to center the effect
      effect.style.left = `${event.clientX - 25}px`;
      document.body.appendChild(effect);

      setTimeout(() => {
        document.body.removeChild(effect);
      }, 1000); // remove after 1 second
    });
  },
});
</script>
