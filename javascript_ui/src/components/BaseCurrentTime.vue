<template>
  <div @click="showDemoAlert">
    <q-chip color="transparent" text-color="primary" class="text-bold">
      {{ currentTime }}
    </q-chip>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import { useDataSensorStore } from 'src/stores/dataSensor';
import { useDataPreferencesStore } from 'src/stores/dataPreferences';
import { playAudio } from 'src/helpers/audioAlertDispatcher';
import { RiskLevel } from './models';

export default {
  setup() {
    const dataSensorStore = useDataSensorStore();
    const dataPreferencesStore = useDataPreferencesStore();
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
      playAudio(
        dataPreferencesStore.audioType,
        RiskLevel.MEDIUM,
        dataSensorStore.alertSensor
      );
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
