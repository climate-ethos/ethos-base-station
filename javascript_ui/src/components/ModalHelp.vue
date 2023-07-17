<template>
  <q-dialog full-width full-height v-model="showModal">
    <BaseModalScroll>
      <template #header>
        <div class="row items-center">
          <div>Help</div>
          <q-space />
          <q-btn icon="close" color="primary" v-close-popup>Close</q-btn>
        </div>
      </template>
      <template #main>
        <p>
          Welcome to the Ethos app help page. This guide will walk you through
          the different components and functionalities of the Ethos app. The app
          is designed to display real-time data from connected weather sensors,
          including temperature, humidity, and a weather forecast.
        </p>

        <h4>Support</h4>
        <contact-card />

        <h4>Dashboard Components</h4>
        <p>
          The Weather Station Dashboard consists of the following components:
        </p>
        <ol>
          <li>
            <strong>Sensor Cards</strong>
          </li>
          <li>
            <strong>Weather Forecast Card</strong>
          </li>
        </ol>
        <h5>Sensor Card</h5>
        <p>
          Each sensor card is color coded according to the risk level posed to
          you. There are three colours, each corresponding to a risk level:
        </p>
        <ul>
          <li>
            <strong class="text-positive">Low Risk</strong>: Our algorithm
            estimates that your core temperature will be in a normal range by
            staying in this room.
          </li>
          <li>
            <strong class="text-warning">Medium Risk</strong>: Our algorithm
            estimates that your core temperature will be above 37.6°C by staying
            in this room.
          </li>
          <li>
            <strong class="text-negative">High Risk</strong>: Our algorithm
            estimates that your core temperature will be above 38°C by staying
            in this room and it may not be safe.
          </li>
        </ul>
        <p>
          Each sensor card on the dashboard displays the following information:
        </p>
        <ul>
          <li>
            <strong>Sensor Name</strong>: The location of where the sensor is
            positioned inside the house.
          </li>
          <li>
            <strong>Offline Status</strong>: If a sensor is offline, the card
            will display an "(Offline)" message next to the sensor name.
          </li>
          <li>
            <strong>Temperature</strong>: The current temperature recorded by
            the sensor, in Celsius.
          </li>
          <li>
            <strong>Humidity</strong>: The current humidity recorded by the
            sensor, as a percentage of relative humidity (RH).
          </li>
          <li>
            <strong>Last Seen</strong>: The last time the sensor was seen
            online. If the sensor has never been seen online, the card will
            display "Never".
          </li>
        </ul>
        <h5>Weather Forecast Card</h5>
        <p>The Weather Forecast Card displays the following information:</p>
        <ul>
          <li>
            <strong>Weather Icon</strong>: An icon representing the current
            weather conditions, based on the data provided by the connected
            weather station.
          </li>
          <li>
            <strong>Weather Description</strong>: A brief text description of
            the current weather conditions.
          </li>
          <li>
            <strong>Weather Station Name</strong>: The name of the weather
            station providing the forecast data. If the weather station name is
            available, it will be displayed along with the text "Weather
            Station".
          </li>
          <li>
            <strong>Temperature</strong>: The current temperature at the weather
            station, in Celsius.
          </li>
          <li>
            <strong>Humidity</strong>: The current humidity at the weather
            station, as a percentage of relative humidity (RH).
          </li>
          <li>
            <strong>Offline Status</strong>: If the weather station is offline,
            the card will display an error message with the reason for the
            offline status.
          </li>
          <li>
            <strong>View Detailed Forecast Button</strong>: A button that allows
            you to view a detailed forecast.
          </li>
        </ul>
        <h4>Getting Started</h4>
        <p>
          To start using the Weather Station Dashboard, make sure that your
          weather sensors and weather station are connected and sending data to
          the application. The dashboard will automatically display the data
          received from the sensors and the weather station.
        </p>
        <h4>Troubleshooting</h4>
        <p>
          If you experience issues with the Weather Station Dashboard, please
          consider the following troubleshooting steps:
        </p>
        <ul>
          <li>
            Verify that your weather sensors are connected and sending data to
            the application.
          </li>
          <li>Ensure that your internet connection is stable.</li>
        </ul>
      </template>
    </BaseModalScroll>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, toRefs, computed } from 'vue';
import ContactCard from './ContactCard.vue';
import BaseModalScroll from './BaseModalScroll.vue';

export default defineComponent({
  name: 'ModalNoConnection',
  components: { ContactCard, BaseModalScroll },
  emits: ['update:modelValue'],
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
  },
  setup(props, { emit }) {
    const { modelValue } = toRefs(props);

    const showModal = computed({
      get() {
        return modelValue.value;
      },
      set(newValue) {
        emit('update:modelValue', newValue);
      },
    });

    return {
      showModal,
    };
  },
});
</script>

<style scoped>
h4,
h5 {
  margin-bottom: 10px;
}

li {
  margin-bottom: 5px;
}
</style>
