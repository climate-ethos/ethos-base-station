<template>
  <q-card>
    <q-card-section ref="header" class="text-bold fontsize-20">
      <!-- Header slot -->
      <slot name="header"></slot>
    </q-card-section>
    <base-scroll-area :height="scrollAreaHeight">
      <q-card-section class="q-pt-none fontsize-14">
        <!-- Main slot here -->
        <slot name="main"></slot>
      </q-card-section>
    </base-scroll-area>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, ref, computed, Ref } from 'vue';
import BaseScrollArea from './BaseScrollArea.vue';
import { QCardSection } from 'quasar';

export default defineComponent({
  name: 'BaseModalScroll',
  components: {
    BaseScrollArea,
  },
  setup() {
    const header: Ref<null | QCardSection> = ref(null);
    const scrollAreaHeight = computed(() => {
      if (header.value) {
        // Subtract header's height from q-card height
        return (
          header.value.$el.parentElement.offsetHeight -
          header.value.$el.offsetHeight -
          1 + // Needed to stop overflow
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
