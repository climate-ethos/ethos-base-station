<template>
  <q-card class="full-height bg-dark text-white">
    <q-card-section horizontal class="full-height">
      <q-card-section>
        <div>
          <q-icon name="sunny" size="100px" class="q-pa-sm" />
          <div class="fontsize-16 text-capitalize text-center">Sunny</div>
        </div>
      </q-card-section>

      <q-separator vertical dark />

      <div class="full-width">
        <q-card-section class="q-pa-sm">
          <div class="fontsize-22 text-bold">
            <span> Ipswich - </span>
            <span>Weather Station</span>
          </div>
        </q-card-section>

        <q-separator dark />

        <q-card-section class="q-pa-sm fontsize-26">
          <div class="row">
            <div class="col">
              <div>Temperature: 36.3°C</div>
              <div>Humidity: 55.7% RH</div>
              <q-btn class="q-mt-sm fontsize-16" color="secondary"
                >View Detailed Forecast</q-btn
              >
            </div>
            <!-- <div class="col"> -->
            <!-- <div>Min: {{ forecastStore.minTemp?.toFixed(1) }}°C</div> -->
            <!-- <div>Max: {{ forecastStore.maxTemp?.toFixed(1) }}°C</div> -->
            <!-- </div> -->
          </div>
        </q-card-section>
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useForecastStore } from 'stores/forecast';

export default defineComponent({
  name: 'DisplayForecast',
  setup() {
    const forecastStore = useForecastStore();

    let iconUrl = computed(() => {
      if (forecastStore.weatherIconId) {
        return `https://openweathermap.org/img/w/${forecastStore.weatherIconId}.png`;
      }
      return '';
    });

    return { forecastStore, iconUrl };
  },
});
</script>
