<template>
  <div style="position: relative">
    <!-- base-scroll-area ID is needed for automatic scrolling on keyboard bind -->
    <q-scroll-area
      :style="{ height: computedHeight, position: 'relative' }"
      class="base-scroll-area q-pr-md"
      :class="heightClass"
      :thumb-style="thumbStyle"
      :bar-style="barStyle"
      visible
      ref="scrollArea"
    >
      <slot></slot>
    </q-scroll-area>

    <q-avatar
      icon="arrow_downward"
      size="xl"
      color="primary"
      text-color="white"
      style="
        position: absolute;
        bottom: 10px;
        left: 50%;
        transform: translateX(-50%);
      "
      v-show="isContentBelow"
      @click="scrollToPercent(1)"
    />

    <q-avatar
      icon="arrow_upward"
      size="xl"
      color="primary"
      text-color="white"
      style="
        position: absolute;
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
      "
      v-show="isContentAbove"
      @click="scrollToPercent(0)"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, computed } from 'vue';
import { QScrollArea } from 'quasar';
import { useKeyboardStore } from 'src/stores/keyboard';
import { parseCssLengthValue } from 'src/helpers/css';

export default defineComponent({
  name: 'BaseScrollArea',
  components: {},
  props: {
    height: {
      type: String,
      required: false,
    },
  },
  setup(props) {
    const scrollArea: Ref<null | QScrollArea> = ref(null);
    const keyboardStore = useKeyboardStore();

    const computedHeight = computed(() => {
      if (!keyboardStore.isKeyboardBound) {
        return props.height;
      }

      const initialHeightInPx = parseCssLengthValue(props.height);
      // Sanity check
      if (!initialHeightInPx || !keyboardStore.keyboardHeight) {
        return props.height;
      }

      const newHeightInPx = initialHeightInPx - keyboardStore.keyboardHeight;

      return newHeightInPx + 'px';
    });

    const heightClass = computed(() => {
      if (props.height) {
        return '';
      }
      if (keyboardStore.isKeyboardBound) {
        return 'remaining-height-keyboard-open';
      }
      return 'remaining-height';
    });

    const isContentBelow = computed(() => {
      if (scrollArea.value) {
        const scrollInfo = scrollArea.value.getScroll();
        if (scrollInfo.verticalSize === scrollInfo.verticalContainerSize) {
          // There is no scrollable content
          return false;
        }
        return scrollInfo.verticalPercentage < 0.95;
      }
      return false;
    });

    const isContentAbove = computed(() => {
      if (scrollArea.value) {
        const scrollInfo = scrollArea.value.getScroll();
        if (scrollInfo.verticalSize === scrollInfo.verticalContainerSize) {
          // There is no scrollable content
          return false;
        }
        return scrollInfo.verticalPercentage > 0.05;
      }
      return false;
    });

    /**
     * Scroll to a certain point in the scroll area, over 200ms
     * @param percent A number between 0 and 1 which specifies how far to scroll
     */
    const scrollToPercent = (percent: number) => {
      scrollArea.value?.setScrollPercentage('vertical', percent, 200);
    };

    return {
      computedHeight,
      heightClass,
      scrollArea,
      isContentBelow,
      isContentAbove,
      scrollToPercent,
      thumbStyle: {
        right: '4px',
        borderRadius: '5px',
        backgroundColor: '#027be3',
        width: '16px',
        opacity: '0.75',
      },
      barStyle: {
        right: '2px',
        borderRadius: '9px',
        backgroundColor: '#027be3',
        width: '20px',
        opacity: '0.2',
      },
    };
  },
});
</script>

<style lang="scss" scoped></style>
