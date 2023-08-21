<template>
  <q-icon v-if="isOnline" name="wifi" color="primary" size="xl" />
  <q-icon v-else name="wifi_off" color="negative" size="xl" />
</template>

<script>
import { defineComponent, onMounted, onUnmounted, ref } from 'vue';

export default defineComponent({
  setup() {
    const isOnline = ref(false);

    const onOnline = () => (isOnline.value = true);
    const onOffline = () => (isOnline.value = false);

    onMounted(() => {
      isOnline.value = navigator.onLine;
      window.addEventListener('offline', onOffline);
      window.addEventListener('online', onOnline);
    });

    onUnmounted(() => {
      window.removeEventListener('offline', onOffline);
      window.removeEventListener('online', onOnline);
    });

    return {
      isOnline,
    };
  },
});
</script>
