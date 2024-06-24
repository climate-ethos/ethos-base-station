<template>
  <div @click="showDemoAlert">
    <q-chip color="transparent" text-color="primary" class="text-bold">
      {{ timeString }}
    </q-chip>
  </div>
</template>

<script lang="ts">
import { useDateTimeStore } from 'src/stores/dateTime';
import { useDataAlertsStore } from 'src/stores/dataAlerts';
import { useDataSensorStore } from 'src/stores/dataSensor';
import { playAudio } from 'src/helpers/audioAlertDispatcher';
import { RiskLevel } from 'src/typings/data-types';
import { computed } from 'vue';
import { useDataPreferencesStore } from 'src/stores/dataPreferences';
export default {
  setup() {
    const dateTimeStore = useDateTimeStore();
    const dataAlertsStore = useDataAlertsStore();
    const dataSensorStore = useDataSensorStore();
    const dataPreferencesStore = useDataPreferencesStore();
    const timeString = computed(() =>
      dateTimeStore.currentDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })
    );

    const showDemoAlert = () => {
      console.log('Showing alert in 5 seconds');
      setTimeout(() => {
        dataSensorStore.showDemoAlert();
        dataAlertsStore.alertRiskLevel = RiskLevel.MEDIUM;
        playAudio(
          dataPreferencesStore.audioType,
          RiskLevel.MEDIUM,
          dataSensorStore.allSensorData[1]
        );
      }, 5000);
    };

    return { timeString, showDemoAlert };
  },
};
</script>
