<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { useDataSensorStore } from 'stores/dataSensor';
import { useForecastStore } from 'stores/forecast';
import { useDataPreferencesStore } from './stores/dataPreferences';

export default defineComponent({
  name: 'App',
  // Setup store connections here
  setup() {
    const dataSensorStore = useDataSensorStore();
    dataSensorStore.setup();

    const dataPreferencesStore = useDataPreferencesStore();
    dataPreferencesStore.updateCoolingStrategyOptions();

    const forecastStore = useForecastStore();
    forecastStore.setup();

    // Add touch/click feedback to app
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
