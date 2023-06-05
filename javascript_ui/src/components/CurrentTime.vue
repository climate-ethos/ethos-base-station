<template>
  <div @click="showDemoAlert">
    <q-chip color="grey" class="fontsize-20" text-color="white">
      {{ currentTime }}
    </q-chip>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import { useDataSensorStore } from 'src/stores/dataSensor';

export default {
  setup() {
    const dataSensorStore = useDataSensorStore();
    const currentTime = ref('');

    const getCurrentTime = () => {
      const now = new Date();
      currentTime.value = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    };

    const showDemoAlert = () => {
      console.log('Showing alert');
      dataSensorStore.alertSensor = dataSensorStore.allSensorData[1];
    };

    onMounted(() => {
      getCurrentTime();
      setInterval(getCurrentTime, 60000);
    });

    return {
      currentTime,
      showDemoAlert,
    };
  },
};
</script>
