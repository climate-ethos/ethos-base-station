<template>
  <q-dialog v-model="isShowFanModal">
    <BaseModalScroll style="width: 900px; max-width: 80vw">
      <template #header>
        <div class="row items-center">
          <div>Fan Use</div>
          <q-space />
          <q-btn icon="close" color="primary" v-close-popup> Close </q-btn>
        </div>
      </template>
      <template #main>
        <div class="text-bold">Increased Heat Stress:</div>
        <p class="text">
          Fans work primarily by aiding the body's natural cooling mechanisms -
          mainly, sweat evaporation. However, when the ambient air temperature
          exceeds the body's temperature, this mechanism can be
          counterproductive.
        </p>
        <p class="text">
          Instead of promoting cooling, a fan in such conditions will blow hot
          air across the body, which can increase your body temperature, a
          situation referred to as heat stress. This is analogous to a
          convection oven, where hot air circulates to cook food.
        </p>
        <p class="text">
          Heat stress can trigger a range of physiological responses as your
          body tries to maintain its normal temperature. These can include:
        </p>
        <ul class="text">
          <li>
            <b>Increased Heart Rate:</b> Your heart rate may increase as your
            body tries to pump more blood to your skin, attempting to lose heat
            to the surrounding environment.
          </li>
          <li>
            <b>Excessive Sweating:</b> Your body may start to sweat excessively
            in an attempt to cool off. However, if the sweat cannot evaporate,
            this will not effectively cool the body and can lead to dehydration.
          </li>
          <li>
            <b>Changes in Blood Pressure:</b> Heat stress can lead to changes in
            blood pressure as the body redirects blood flow to the skin, which
            can lead to dizziness or fainting.
          </li>
          <li>
            <b>Heat Exhaustion or Heat Stroke:</b> In severe cases, heat stress
            can lead to heat exhaustion or even heat stroke, both of which are
            serious medical conditions.
          </li>
        </ul>
      </template>
    </BaseModalScroll>
  </q-dialog>
</template>

<script>
import { defineComponent, inject } from 'vue';
import BaseModalScroll from './BaseModalScroll.vue';

export default defineComponent({
  name: 'ModelFanInfo',
  setup() {
    const isShowFanModal = inject('isShowFanModal');
    return { isShowFanModal };
  },
  components: { BaseModalScroll },
});
</script>
