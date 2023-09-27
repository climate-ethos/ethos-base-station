<template>
  <q-card class="full-height bg-dark text-white">
    <q-card-section horizontal class="full-height">
      <q-card-section>
        <div class="text-center">
          <q-icon :name="iconName" size="100px" />
          <div class="fontsize-16 text-capitalize">
            {{ weatherStore.weatherDescription }}
          </div>
        </div>
      </q-card-section>

      <q-separator vertical dark />

      <div class="full-width">
        <q-card-section class="q-pa-sm">
          <div class="fontsize-22 text-bold">
            <span v-if="weatherStore.stationName">
              {{ weatherStore.stationName }} -
            </span>
            <span>Weather Station</span>
          </div>
        </q-card-section>

        <q-separator dark />

        <q-card-section class="q-pa-sm fontsize-26">
          <div class="row">
            <div class="col">
              <div>
                Temperature: {{ weatherStore.currentTemp?.toFixed(1) }}°C
              </div>
              <div>Humidity: {{ weatherStore.currentHumidity }}% RH</div>
              <q-btn
                @click="displayDetailedForecast"
                class="q-mt-sm fontsize-14"
                color="secondary"
                >View Detailed Forecast</q-btn
              >
              <modal-detailed-forecast
                v-if="weatherStore.isShowDetailedForecast"
              />
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
import { useWeatherStore } from 'stores/weather';
import ModalDetailedForecast from './ModalDetailedForecast.vue';

export default defineComponent({
  name: 'CardForecast',
  components: { ModalDetailedForecast },
  setup() {
    const weatherStore = useWeatherStore();
    let iconName = computed(() => {
      switch (weatherStore.weatherIconId) {
        case '01d':
        case '01n':
          return 'ion-sunny';
        case '02d':
        case '02n':
          return 'ion-partly-sunny';
        case '03d':
        case '03n':
        case '04d':
        case '04n':
          return 'ion-cloud';
        case '09d':
        case '09n':
        case '10d':
        case '10n':
          return 'ion-rainy';
        case '11d':
        case '11n':
          return 'ion-thunderstorm';
        case '13d':
        case '13n':
          return 'ion-snow';
        case '50d':
        case '50n':
          return 'foggy';
        default:
          return '';
      }
    });
    const displayDetailedForecast = () => {
      weatherStore.isShowDetailedForecast = true;
    };
    return { weatherStore, iconName, displayDetailedForecast };
  },
});
</script>
