<template>
  <q-card class="bg-dark no-shadow">
    <q-card-section class="q-pa-none">
      <div class="chartBox">
        <LineChart v-if="loaded" :data="chartData" :options="chartOptions" />
      </div>
    </q-card-section>
    <q-card-section>
      <span class="row justify-between">
        <div
          v-for="(item, idx) in dailyMinMaxTemps"
          :key="item.dayOfWeek"
          @click="activeIndex = idx"
        >
          <q-card
            class="no-shadow q-py-md q-px-lg text"
            :class="[{ 'bg-grey-9': idx == activeIndex }, 'bg-dark']"
          >
            <div class="column">
              <div class="row text-white justify-center">
                {{ item.dayOfWeek }}
              </div>
              <div class="row">
                <div class="q-mr-sm">{{ Math.round(item.minTemp) }}°</div>
                <div class="text-grey">{{ Math.round(item.maxTemp) }}°</div>
              </div>
            </div>
          </q-card>
        </div>
      </span>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { ref, onMounted, computed, defineComponent } from 'vue';
import {
  Chart as ChartJS,
  Filler,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Line as LineChart } from 'vue-chartjs';
import { useForecastStore } from 'src/stores/forecast';
import { ChartOptions } from 'chart.js';
ChartJS.register(
  Filler,
  ChartDataLabels,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default defineComponent({
  name: 'LineGraph',
  components: { LineChart },
  setup() {
    const loaded = ref(false);
    const activeIndex = ref(0); // first day is always selected
    const forecastStore = useForecastStore();

    // Getting the day of the week
    const forecastTempsWithDay = computed(() => {
      if (!forecastStore.forecastTemps) return [];
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      // Append day of week name onto forecast data
      return forecastStore.forecastTemps.map((forecast) => ({
        ...forecast,
        dayOfWeek: dayNames[forecast.date.getDay()],
      }));
    });

    // Getting min and max temperature for the day
    const dailyMinMaxTemps = computed(() => {
      // Create object which groups array by day of week
      const groupedByDay: Record<
        string,
        Array<{ date: Date; temperature: number; dayOfWeek: string }>
      > = {};
      for (const forecast of forecastTempsWithDay.value) {
        if (groupedByDay[forecast.dayOfWeek]) {
          groupedByDay[forecast.dayOfWeek].push(forecast);
        } else {
          groupedByDay[forecast.dayOfWeek] = [forecast];
        }
      }

      // Find min and max temp from grouped object
      return Object.keys(groupedByDay).map((dayOfWeek) => {
        const temperatures = groupedByDay[dayOfWeek].map((f) => f.temperature);
        return {
          dayOfWeek,
          minTemp: Math.min(...temperatures),
          maxTemp: Math.max(...temperatures),
        };
      });
    });

    // Get the min index (where the chart should start displaying from)
    const chartMin = computed(() => {
      const activeDay = dailyMinMaxTemps.value[activeIndex.value].dayOfWeek;
      return forecastTempsWithDay.value.findIndex(
        (item) => item.dayOfWeek === activeDay
      );
    });

    const dateToAmPm = (date: Date) => {
      const ampmHour = date.getHours() % 12 || 12;
      const period = date.getHours() >= 12 ? 'pm' : 'am';
      return '' + ampmHour + period;
    };

    const chartData = computed(() => {
      // Check if weather data is available yet
      if (!forecastStore.forecastTemps) {
        return {
          labels: [],
          datasets: [],
        };
      }
      // Keys are the time e.g. '11pm'
      let keys = forecastStore.forecastTemps.map((forecastPoint) => {
        return dateToAmPm(forecastPoint.date);
      });
      // Values are the temperatures
      let values = forecastStore.forecastTemps.map((forecastPoint) => {
        return forecastPoint.temperature;
      });
      return {
        labels: keys,
        datasets: [
          {
            borderColor: 'rgb(242,206,52,1)',
            backgroundColor: 'white',
            data: values,
            lineTension: 0.3, // smoothens the line
            radius: 0, // removes dots at data points
            borderWidth: 2.5, // line width
            fill: {
              // fill the area underneath the line chart
              target: 'origin',
              above: 'rgb(80,71,42,1)',
              // below: 'rgb(0, 0, 255)',
            },
          },
        ],
      };
    });

    const chartOptions = computed((): ChartOptions<'line'> => {
      // Find max and min temperature
      let minTemperature = 10;
      let maxTemperature = 45;
      if (forecastStore.forecastTemps) {
        let temperatures = forecastStore.forecastTemps.map(
          (tempObj) => tempObj.temperature
        );
        minTemperature = Math.min(...temperatures);
        maxTemperature = Math.max(...temperatures);
      }
      return {
        animation: {
          duration: 1000, // general animation time
        },
        plugins: {
          legend: { display: false },
          datalabels: {
            color: 'white',
            font: { size: 28 },
            // anchor: 'end',
            formatter: Math.round, // format labels
            align: 'end', // move datalabels on top of the line
            offset: 1, // how far datalabels are from anchor point
          },
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            min: chartMin.value,
            max: chartMin.value + 7, // first 8 data points for day
            ticks: {
              color: 'white',
              font: { size: 28 },
            },
            grid: {
              display: false,
            },
          },
          y: {
            display: false,
            min: minTemperature - 5,
            max: maxTemperature + 5,
            ticks: {
              stepSize: 20, // step size on y axis. found 20 to look best.
            },
          },
        },
      };
    });
    onMounted(async () => {
      loaded.value = true;
    });

    return {
      dailyMinMaxTemps,
      chartMin,
      loaded,
      chartData,
      chartOptions,
      activeIndex,
    };
  },
});
</script>
<style>
.chartBox {
  height: 40vh;
}
</style>
