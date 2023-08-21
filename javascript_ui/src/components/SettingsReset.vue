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

export default defineComponent({
  setup() {
    const isShowWarning = ref(false);
    const router = useRouter();
    const dataUserStore = useDataUserStore();
    const dataSensorStore = useDataSensorStore();
    const dataPreferencesStore = useDataPreferencesStore();
    const volumeStore = useVolumeStore();
    const resetData = () => {
      volumeStore.$reset();
      dataUserStore.$reset();
      dataSensorStore.$reset();
      dataPreferencesStore.$reset();
      dataSensorStore.setup();
      router.push('/');
    };
    return { isShowWarning, resetData };
  },
  components: {},
});
</script>
