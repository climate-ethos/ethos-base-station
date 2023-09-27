<!-- Detailed modal -->
<template>
  <q-dialog
    v-model="weatherStore.isShowDetailedForecast"
    full-width
    :persistent="true"
  >
    <q-card class="bg-dark q-pb-none text-white">
      <q-card-section>
        <div class="row justify-between">
          <div class="text-bold fontsize-20">
            <span v-if="weatherStore.stationName"
              >Detailed Forecast - {{ weatherStore.stationName }}</span
            >
          </div>
          <q-btn icon="close" color="primary" v-close-popup>close</q-btn>
        </div>
      </q-card-section>
      <q-separator dark />
      <q-card-section class="q-pt-s">
        <div class="text-h3">{{ weatherStore.currentTemp?.toFixed(1) }}°C</div>
        <div class="fontsize-18">
          Humidity: {{ weatherStore.currentHumidity }}% RH
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <LineGraph />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { useWeatherStore } from 'stores/weather';
import LineGraph from './LineGraph.vue';

export default defineComponent({
  name: 'ModalDetailedForecast',
  components: { LineGraph },
  setup() {
    const weatherStore = useWeatherStore();
    return {
      weatherStore,
    };
  },
});
</script>
