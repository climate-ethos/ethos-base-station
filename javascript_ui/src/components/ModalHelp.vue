<template>
  <q-dialog full-width full-height v-model="showModal">
    <BaseModalScroll>
      <template #header>
        <div class="row items-center">
          <div>Help</div>
          <q-space />
          <img src="griffith.svg" height="40" class="q-mr-lg" />
          <img src="ethos.svg" height="50" class="q-mr-lg" />
          <div class="q-mr-md text-subtitle1">v{{ version }}</div>
          <q-btn icon="close" color="primary" v-close-popup>Close</q-btn>
        </div>
      </template>
      <template #main>
        <p>
          Welcome to the Ethos app help page. This guide will walk you through
          the different components and functionalities of the Ethos app. The app
          is designed to display real-time data from connected temperature
          sensors & weather station.
        </p>

        <h4>Support</h4>
        <CardContact />

        <h4>Sleeping</h4>
        <p>
          The program will automatically sleep after inactivity between 9pm-5am
          overnight. Don't be alarmed if the screen turns off in this time. To
          wake the screen, touch anywhere.
        </p>

        <h4>Buttons</h4>
        <p>
          There are three touch buttons located at the top of the screen:
          <strong>cool down</strong>, <strong>app help</strong> and
          <strong>volume</strong>.
        </p>
        <ul>
          <li>
            <strong>Cool Down</strong>: Touch this button if you need to cool
            down and want to view a list of cooling strategies.
          </li>
          <li>
            <strong>App help</strong>: View help about the app. This is where
            you are now :)
          </li>
          <li>
            <strong>Volume</strong>: Use the - and + touch buttons to adjust
            volume (or mute) depending on preferences
          </li>
        </ul>

        <h4>Main Page Components</h4>
        <p>The Ethos app consists of the following components:</p>
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
          Each sensor card is colour coded according to the risk level posed to
          you. There are three colours, each corresponding to a risk level:
        </p>
        <ul>
          <li>
            <strong class="text-positive">Low Risk</strong>: Our algorithm
            estimates that your core temperature should be in a normal range by
            staying in this room.
          </li>
          <li>
            <strong class="text-warning">Medium Risk</strong>: Our algorithm
            estimates that your core temperature may be elevated by staying in
            this room.
          </li>
          <li>
            <strong class="text-negative">High Risk</strong>: Our algorithm
            estimates that your core temperature may be unsafely elevated by
            staying in this room and it may not be safe.
          </li>
        </ul>
        <p>Each sensor card in the app displays the following information:</p>
        <ul>
          <li>
            <strong>Sensor Location</strong>: The location of where the sensor
            is positioned inside (or outside) the house.
          </li>
          <li>
            <strong>Offline Status</strong>: If a sensor is offline, the card
            will display an "(Offline)" message next to the sensor name. Please
            contact us if you see a sensor has been offline for longer than an
            hour.
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
            <strong>Weather Station Name</strong>: The name of the closest
            weather station providing the forecast data. It may not be the same
            suburb as where you are now but should be relatively close by.
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
            you to view a detailed forecast. It will show the forecast for the
            rest of the day and next few days.
          </li>
        </ul>

        <h4>Troubleshooting</h4>
        <p>
          If you experience issues with the Weather Station Dashboard, please
          feel free to contact us.
        </p>
        <CardContact />
      </template>
    </BaseModalScroll>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, toRefs, computed } from 'vue';
import { version } from '../../package.json';
import CardContact from './CardContact.vue';
import BaseModalScroll from './BaseModalScroll.vue';

export default defineComponent({
  name: 'ModalHelp',
  components: { CardContact, BaseModalScroll },
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
      version,
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
