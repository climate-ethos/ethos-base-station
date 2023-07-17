import { defineStore } from 'pinia';

import axios, { AxiosError } from 'axios';
import { useDataUserStore } from './dataUser';
import { watch } from 'vue';

export const useForecastStore = defineStore('forecast', {
  state: () => ({
    // Show or hide modal
    isShowDetailedForecast: false,
    // Error message (if any)
    errorMessage: 'Updating data...',
    // Basic weather info
    stationName: null as null | string,
    currentTemp: null as null | number,
    currentHumidity: null as null | number,
    weatherDescription: undefined as undefined | string,
    weatherIconId: null as null | string,
    // Map with forecast temps (date + temperature)
    forecastTemps: null as null | Array<{ date: Date; temperature: number }>,
    // Interval to poll API
    pollInterval: null as null | number,
  }),

  getters: {},

  actions: {
    setup() {
      // Initialize user data for lat/lon
      const dataUserStore = useDataUserStore();

      // Update forecast if lat or lon change
      watch(
        () => {
          return { lat: dataUserStore.latitude, lon: dataUserStore.longitude };
        },
        () => {
          console.log('Lat/lon updated, updating weather');
          updateWeather();
        }
      );

      /**
       * Read the user latitude and longitude (based off postcode)
       * and updates the weather forecast accordingly
       */
      const updateWeather = async () => {
        const latitude = dataUserStore.latitude;
        const longitude = dataUserStore.longitude;
        console.log('Updating weather...');
        if (!(latitude && longitude)) {
          this.errorMessage =
            'Unspecified latitude/longitude, is postcode specified in settings?';
          return;
        }
        this.getSimpleForecast(latitude, longitude);
        this.getDetailedForecast(latitude, longitude);
      };
      updateWeather();

      // Setup poll interval for every 10 min
      this.pollInterval = window.setInterval(updateWeather, 60000 * 20);
    },

    /**
     * Get simple weather forecast for current time
     */
    async getSimpleForecast(latitude: number, longitude: number) {
      try {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${process.env.OPENWEATHERMAPSAPIKEY}`;
        const result = await axios.get(url, {
          timeout: 4000,
          responseType: 'text',
          maxContentLength: 65536,
        });
        // console.log(result.data);
        // Update weather values
        const weatherObj = JSON.parse(result.data);
        // console.log(weatherObj);
        this.stationName = weatherObj.name;
        this.currentTemp = weatherObj.main.temp;
        this.currentHumidity = weatherObj.main.humidity;
        // this.minTemp = weatherObj.main.temp_min;
        // this.maxTemp = weatherObj.main.temp_max;
        this.weatherDescription = weatherObj.weather[0].description;
        this.weatherIconId = weatherObj.weather[0].icon;
        // Clear error message
        this.errorMessage = '';
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          this.errorMessage = error.message;
        } else {
          this.errorMessage = 'An unknown error occurred';
        }
      }
    },

    /**
     * Get the 5 day 3 hour forecast for future time points
     */
    async getDetailedForecast(latitude: number, longitude: number) {
      try {
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${process.env.OPENWEATHERMAPSAPIKEY}`;
        const result = await axios.get(url, {
          timeout: 4000,
          responseType: 'text',
          maxContentLength: 65536,
        });
        const weatherObj = JSON.parse(result.data);

        // clear forecastTemps and dayofweek forecast array
        this.forecastTemps = [];
        // console.log(weatherObj);
        for (const w of weatherObj.list) {
          // Multiply by 1000 to convert seconds to ms (unix to js time)
          this.forecastTemps.push({
            date: new Date(w.dt * 1000),
            temperature: w.main.temp,
          });
        }
        // Clear error message
        this.errorMessage = '';
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          this.errorMessage = error.message;
        } else {
          this.errorMessage = 'unable to fetch forecast api';
        }
        return this.errorMessage;
      }
    },
  },
});
