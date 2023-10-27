<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue';

import { useDataSensorStore } from 'stores/dataSensor';
import { useWeatherStore } from 'stores/weather';
import { useDataPreferencesStore } from './stores/dataPreferences';
import { useDatabaseStore } from './stores/database';
import { useSurveyStore } from './stores/survey';
import { useDateTimeStore } from './stores/dateTime';
import { useDataUserStore } from './stores/dataUser';

export default defineComponent({
  name: 'App',
  // Setup store connections here
  setup() {
    // Setup stores
    const dataSensorStore = useDataSensorStore();
    dataSensorStore.setup();

    const dataPreferencesStore = useDataPreferencesStore();
    dataPreferencesStore.updateCoolingStrategyOptions();

    const weatherStore = useWeatherStore();
    weatherStore.setup();
    const surveyStore = useSurveyStore();
    surveyStore.setup();

    // Start updating time
    const dateTimeStore = useDateTimeStore();
    dateTimeStore.startInterval();

    // Initialize database
    const databaseStore = useDatabaseStore();
    databaseStore.initializeDatabase();
    const dataUserStore = useDataUserStore();
    // Update database link when user id changes
    watch(
      () => [dataUserStore.id, dataUserStore.password],
      (newValues, oldValues) => {
        const [newId, newPassword] = newValues;
        let oldId = undefined;
        let oldPassword = undefined;
        if (oldValues) {
          [oldId, oldPassword] = oldValues;
        }

        if (!newId || !newPassword) {
          console.warn('Database user ID or Password not defined');
          return;
        }

        if (newId !== oldId || newPassword !== oldPassword) {
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
