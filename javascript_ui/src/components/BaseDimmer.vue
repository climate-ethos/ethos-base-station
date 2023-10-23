<!-- Component which displays a black overlay to mimic sleeping -->
<template>
  <div v-if="shouldShowDimmer" class="dimmer" @click.stop="wakeScreen"></div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';

export default {
  name: 'DimmerComponent',
  setup() {
    const lastActivity = ref(new Date());
    const shouldShowDimmer = ref(false);

    const resetActivityTimer = () => {
      lastActivity.value = new Date();
    };

    const wakeScreen = () => {
      shouldShowDimmer.value = false;
      resetActivityTimer();
    };

    const checkForInactivity = () => {
      const now = new Date();
      const hours = now.getHours();
      const fiveMinutes = 5 * 60 * 1000;

      if (now.getTime() - lastActivity.value.getTime() >= fiveMinutes) {
        if (hours >= 21 || hours < 5) {
          // Sleep screen
          shouldShowDimmer.value = true;
          return;
        }
      }
      // Otherwise hide dimmer
      shouldShowDimmer.value = false;
    };

    onMounted(() => {
      window.addEventListener('mousemove', resetActivityTimer);
      window.addEventListener('keydown', resetActivityTimer);

      // Check to see if screen should be dimmed every minute
      const intervalId = setInterval(checkForInactivity, 60000);

      // Cleanup on unmount
      onBeforeUnmount(() => {
        window.removeEventListener('mousemove', resetActivityTimer);
        window.removeEventListener('keydown', resetActivityTimer);
        clearInterval(intervalId);
      });
    });

    return {
      shouldShowDimmer,
      wakeScreen,
    };
  },
};
</script>

<style scoped>
.dimmer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: black;
  opacity: 1;
  z-index: 9999;
}
</style>
