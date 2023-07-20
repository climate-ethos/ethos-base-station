<template>
  <q-page class="row">
    <div
      class="col-xs-6 col-sm-4 display-component"
      v-for="sensor in sortedSensorData"
      :key="sensor.id"
    >
      <CardSensor :sensor="sensor"></CardSensor>
    </div>
    <div v-if="true" class="col-xs-12 col-sm-8 display-component">
      <CardForecast />
    </div>
  </q-page>
</template>

<script lang="ts">
import CardSensor from 'components/CardSensor.vue';
import CardForecast from 'components/CardForecast.vue';

import { defineComponent } from 'vue';
import { useDataSensorStore } from 'src/stores/dataSensor';

export default defineComponent({
  name: 'IndexPage',
  components: { CardSensor, CardForecast },
  setup() {
    const sortedSensorData = useDataSensorStore().getSortedSensorData;
    return { sortedSensorData };
  },
});
</script>

<style lang="scss" scoped>
@media screen and (min-width: 600px) {
  .display-component {
    height: calc(#{$remaining-height} / 2);
    padding: 10px;
  }
}
@media screen and (max-width: 599px) {
  .display-component {
    height: calc(#{$remaining-height} / 3);
    padding: 10px;
  }
}
</style>
