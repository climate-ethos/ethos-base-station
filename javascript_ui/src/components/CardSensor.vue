<template>
  <q-card class="full-height" :class="backgroundColor" @click="readSensorData">
    <q-icon
      style="margin-top: 70px"
      class="absolute-right q-ma-sm"
      :name="emoticonStyle"
      color="white"
      size="150px"
    />

    <q-card-section class="q-pa-sm">
      <div class="fontsize-22 text-bold">
        {{ sensor.name ? sensor.name : 'Undefined' }}
        {{ sensor.id ? '' : '(ID Undefined)' }}
        <span v-if="isOffline">(Offline)</span>
      </div>
    </q-card-section>

    <q-separator />

    <q-card-section class="q-pa-sm">
      <div class="fontsize-36 text-bold">{{ sensor.temperature }}°C</div>
      <div class="fontsize-30 text-bold">{{ sensor.humidity }}% RH</div>
      <div class="fontsize-14 text-italic">
        {{ formattedLastSeen }}
      </div>
    </q-card-section>

    <!-- Fan use -->
    <div v-if="isDisplayFanWarning && !isOffline">
      <q-separator />
      <q-card-section class="q-ml-sm q-pa-none row">
        <div class="fontsize-22 text-bold">DONT USE FAN</div>
        <q-btn
          icon="question_mark"
          @click="isShowFanModel = true"
          class="q-mr-md absolute-right"
          color="warning"
        />
      </q-card-section>
    </div>
  </q-card>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  ref,
  computed,
  onMounted,
  onUnmounted,
  inject,
} from 'vue';
import { SensorData, RiskLevel } from 'components/models';
import { playTextToSpeech } from 'src/helpers/audioAlertDispatcher';
import { shouldUseFan } from 'src/helpers/fanAndWindowUse';

export default defineComponent({
  name: 'CardSensor',
  props: {
    sensor: {
      type: Object as PropType<SensorData>,
      required: true,
    },
  },
  setup(props) {
    const isShowFanModel = inject('isShowFanModal');
    // The current time/date
    let currentTime = ref(Date.now());
    // An interval which handles updating the currentTime
    let updateCurrentTimeInterval: NodeJS.Timeout | undefined = undefined;

    // The function which updates the currentTime
    let updateCurrentTime = () => {
      currentTime.value = Date.now();
    };

    // Update currentTime every 5 seconds
    onMounted(() => {
      updateCurrentTimeInterval = setInterval(updateCurrentTime, 5000);
    });

    // Clear the interval when unmounted
    onUnmounted(() => {
      clearInterval(updateCurrentTimeInterval);
    });

    // Whether we should display 'DON'T USE FAN' at bottom of component
    const isDisplayFanWarning = computed(
      () => shouldUseFan(props.sensor) === 'no'
    );

    // Calculate whether the sensor is offline using currentTime and lastSeen
    let isOffline = computed(() => {
      return false;
    });

    // Check whether the sensor name or id is undefined
    let isUndefined = computed(() => {
      return !props.sensor.id || !props.sensor.name;
    });

    // Calculate what background color to use for the form card
    let backgroundColor = computed(() => {
      if (
        isUndefined.value ||
        !props.sensor.temperature ||
        !props.sensor.humidity
      ) {
        // Sensor is undefined
        return 'bg-grey-8 text-grey';
      } else if (isOffline.value) {
        // Sensor is offline
        return 'bg-grey text-grey-8';
      }
      // Check risk level
      switch (props.sensor.riskLevel) {
        case RiskLevel.LOW:
          // Low risk, background green
          return 'bg-positive text-white';
        case RiskLevel.MEDIUM:
          // Medium risk, background yellow
          return 'bg-warning text-white';
        case RiskLevel.HIGH:
          // High risk, background red
          return 'bg-flash text-white';
        case undefined:
          // Still calculating, grey for now
          return 'bg-grey';
        default:
          console.error('Unable to find correct background color');
          return 'bg-grey';
      }
    });

    let emoticonStyle = computed(() => {
      switch (props.sensor.riskLevel) {
        case RiskLevel.LOW:
          return 'sentiment_very_satisfied';
        case RiskLevel.MEDIUM:
          return 'sentiment_neutral';
        case RiskLevel.HIGH:
          return 'sentiment_very_dissatisfied';
        default:
          // No emoticon
          return '';
      }
    });

    let formattedLastSeen = computed(() => {
      const lastSeen = props.sensor.lastSeen;
      if (!lastSeen) {
        return 'Never';
      }

      let strTime = lastSeen.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });

      return strTime + ', ' + lastSeen.toLocaleDateString();
    });

    let readRiskLevel = () => {
      switch (props.sensor.riskLevel) {
        case RiskLevel.LOW:
          return 'low';
        case RiskLevel.MEDIUM:
          return 'medium';
        case RiskLevel.HIGH:
          return 'high';
        default:
          // No emoticon
          return '';
      }
    };

    const readSensorData = () => {
      const text = `The ${props.sensor.name} is ${
        props.sensor.temperature
      } degrees celsius, with a relative humidity of ${
        props.sensor.humidity
      }%. Your risk level in this room is ${readRiskLevel()}`;

      playTextToSpeech(text);
    };

    return {
      isShowFanModel,
      isDisplayFanWarning,
      isUndefined,
      isOffline,
      backgroundColor,
      formattedLastSeen,
      emoticonStyle,
      readSensorData,
    };
  },
});
</script>

<style lang="scss" scoped>
.bg-flash {
  animation: flash 2s infinite;
}

@keyframes flash {
  0%,
  50%,
  100% {
    background-color: $negative;
  }
  25%,
  75% {
    background-color: #710101;
  }
}
</style>
