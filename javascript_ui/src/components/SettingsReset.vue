<!-- src/components/SettingsReset.vue -->
<template>
  <div class="text-h6 q-mb-md">Reset Data</div>
  <!-- Inputs below -->
  <div class="q-mb-sm text">
    Press below to delete all data, and reset the app to factory settings
  </div>
  <q-btn color="negative" @click="() => (isShowWarning = true)">
    Press here to reset
  </q-btn>
  <!-- Warning modal with confirmation -->
  <q-dialog v-model="isShowWarning">
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Confirm Reset</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section>
        <div class="text">
          Are you sure you want to delete all data and reset everything? This
          cannot be undone
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn label="No go back" color="primary" v-close-popup />
        <q-btn
          label="Yes delete everything"
          color="negative"
          @click="resetData"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { useDataSensorStore } from 'src/stores/dataSensor';
import { useDataUserStore } from 'src/stores/dataUser';
import { useVolumeStore } from 'src/stores/volume';
import { useRouter } from 'vue-router';
import { defineComponent, ref } from 'vue';
import { useDataPreferencesStore } from 'src/stores/dataPreferences';
import { useDatabaseStore } from 'src/stores/database';
import { useDataAlertsStore } from 'src/stores/dataAlerts';
import { useWeatherStore } from 'src/stores/weather';
import { useDataPhoneNumberStore } from 'src/stores/dataPhoneNumberStore';

export default defineComponent({
  setup() {
    const isShowWarning = ref(false);
    const router = useRouter();
    const dataAlertsStore = useDataAlertsStore();
    const dataUserStore = useDataUserStore();
    const dataSensorStore = useDataSensorStore();
    const dataPhoneNumberStore = useDataPhoneNumberStore();
    const dataPreferencesStore = useDataPreferencesStore();
    const volumeStore = useVolumeStore();
    const databaseStore = useDatabaseStore();
    const weatherStore = useWeatherStore();
    const resetData = async () => {
      // Clear pinia stores
      volumeStore.$reset();
      weatherStore.$reset();
      dataAlertsStore.$reset();
      dataUserStore.$reset();
      dataSensorStore.$reset();
      dataPhoneNumberStore.$reset();
      dataPreferencesStore.$reset();
      dataSensorStore.setup();
      // Destroy database and clear data
      await databaseStore.destroyDatabase();
      databaseStore.initializeDatabase();
      // Go back to home
      router.push('/');
    };
    return { isShowWarning, resetData };
  },
  components: {},
});
</script>
