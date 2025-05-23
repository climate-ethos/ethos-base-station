<template>
  <q-card class="full-height" :class="backgroundColor">
    <q-icon
      style="margin-top: 70px"
      class="absolute-right q-ma-sm"
      :name="emoticonStyle"
      color="white"
      size="150px"
    />

    <q-card-section class="q-pa-sm">
      <div class="fontsize-22 text-bold">
        {{ sensor.location ? sensor.location : 'Undefined' }}
        {{ sensor.id ? '' : '(ID Undefined)' }}
        <span v-if="sensorState.isOffline.value">(Offline)</span>
        <span v-if="isCalculating">(Calculating)</span>
      </div>
    </q-card-section>

    <q-separator />

    <q-card-section class="q-pa-sm">
      <div v-if="sensor.temperature" class="fontsize-36 text-bold">
        {{ sensor.temperature.toFixed(1) }}°C
      </div>
      <div v-if="sensor.humidity" class="fontsize-30 text-bold">
        {{ sensor.humidity.toFixed(1) }}% RH
      </div>
      <div>
        <span class="fontsize-14 text-italic">{{
          sensorState.formattedLastSeen.value
        }}</span>
        <q-icon
          class="q-mr-md float-right"
          size="md"
          :name="sensorState.signalStrengthIcon.value"
        />
      </div>
    </q-card-section>

    <!-- Fan use -->
    <div v-if="isDisplayFanWarning && !sensorState.isOffline.value">
      <q-separator />
      <q-card-section class="q-ml-sm q-pa-none row">
        <div class="fontsize-22 text-bold">DONT USE FAN</div>
        <q-btn
          icon="info"
          @click.stop="isShowFanModel = true"
          class="q-mr-md absolute-right"
          color="warning"
        />
      </q-card-section>
    </div>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, inject } from 'vue';
import { SensorData, RiskLevel } from 'src/typings/data-types';
import { shouldUseFan } from 'src/helpers/fanAndWindowUse';
import { useSensorState } from 'src/composables/useSensorState';

export default defineComponent({
  name: 'CardSensor',
  props: {
    sensor: {
      type: Object as PropType<SensorData>,
      required: true,
    },
  },
  setup(props) {
    const sensorState = useSensorState(props.sensor);
    const isShowFanModel = inject('isShowFanModal');

    // Whether we should display 'DON'T USE FAN' at bottom of component
    const isDisplayFanWarning = computed(
      () => shouldUseFan(props.sensor) === 'no'
    );

    // Whether the risk level is currently being calculated
    let isCalculating = computed(() => {
      if (props.sensor.temperature && !props.sensor.riskLevel) {
        return true;
      }
      return false;
    });

    // Check whether the sensor name or id is undefined
    let isUndefined = computed(() => {
      return !props.sensor.id || !props.sensor.location;
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
      } else if (sensorState.isOffline.value) {
        // Sensor is offline
        return 'bg-grey text-grey-8';
      } else if (isCalculating.value) {
        return 'bg-grey text-white';
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

    return {
      sensorState,
      isShowFanModel,
      isDisplayFanWarning,
      isUndefined,
      isCalculating,
      backgroundColor,
      emoticonStyle,
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
