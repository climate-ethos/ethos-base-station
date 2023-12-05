<template>
  <BaseModalScroll>
    <template #header>
      <div class="row items-center">
        <div class="fontsize-20 text-bold q-ml-md">{{ strategy.name }}</div>
        <q-space />
        <q-btn
          class="fontsize-12 q-mr-lg"
          icon="arrow_back"
          color="primary"
          @click="$emit('back')"
        >
          back
        </q-btn>
        <q-btn
          icon="close"
          color="primary"
          class="fontsize-12"
          @click="$emit('close')"
        >
          Close
        </q-btn>
      </div>
    </template>
    <template #main>
      <CoolingInterventionInfoSection
        :headingText="`How to best use ${strategy.shortName}`"
        :strategyPoints="strategy.extraInfo.bestUse"
      />

      <CoolingInterventionInfoSection
        :headingText="`When ${strategy.shortName} should be used`"
        :strategyPoints="strategy.extraInfo.whenUse"
        color="positive"
        bullet-style="tick"
      />

      <CoolingInterventionInfoSection
        :headingText="`When ${strategy.shortName} should not be used`"
        :strategyPoints="strategy.extraInfo.whenNotUse"
        color="negative"
        bullet-style="cross"
      />
    </template>
  </BaseModalScroll>
</template>

<script lang="ts">
import { defineComponent, ref, computed, Ref } from 'vue';
import CoolingInterventionInfoSection from './CoolingInterventionInfoSection.vue';
import { QCardSection } from 'quasar';
import BaseModalScroll from './BaseModalScroll.vue';

export default defineComponent({
  name: 'CoolingInterventionInfo',
  props: {
    strategy: {
      type: Object,
      required: true,
    },
  },
  components: {
    CoolingInterventionInfoSection,
    BaseModalScroll,
  },
  setup() {
    const header: Ref<null | QCardSection> = ref(null);
    const scrollAreaHeight = computed(() => {
      if (header.value) {
        // Subtract header's height from q-card height
        return (
          header.value.$el.parentElement.offsetHeight -
          header.value.$el.offsetHeight +
          'px'
        );
      } else {
        // Default height if header's height can't be calculated
        return '70vh';
      }
    });

    return {
      header,
      scrollAreaHeight,
    };
  },
});
</script>
