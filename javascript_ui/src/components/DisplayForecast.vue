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
              <div>
                Temperature: {{ forecastStore.currentTemp?.toFixed(1) }}°C
              </div>
              <div>Humidity: {{ forecastStore.currentHumidity }}% RH</div>
              <q-btn
                @click="displayDetailedForecast"
                class="q-mt-sm fontsize-14"
                color="secondary"
                >View Detailed Forecast</q-btn
              >
              <modal-detailed-forecast
                v-if="forecastStore.isShowDetailedForecast"
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
import { useForecastStore } from 'stores/forecast';
import ModalDetailedForecast from './ModalDetailedForecast.vue';

export default defineComponent({
  name: 'DisplayForecast',
  components: { ModalDetailedForecast },
  setup() {
    const forecastStore = useForecastStore();
    let iconUrl = computed(() => {
      if (forecastStore.weatherIconId) {
        return `https://openweathermap.org/img/w/${forecastStore.weatherIconId}.png`;
      }
      return '';
    });
    const displayDetailedForecast = () => {
      forecastStore.isShowDetailedForecast = true;
    };
    return { forecastStore, iconUrl, displayDetailedForecast };
  },
});
</script>
