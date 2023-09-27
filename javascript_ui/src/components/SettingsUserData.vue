<template>
  <div class="text-h6 q-mb-md">User Data</div>
  <!-- User ID -->
  <input-keyboard
    v-model.number="dataUserStore.id"
    :customRule="dataUserStore.checkId"
    type="number"
    label="User ID"
  />

  <!-- User DB password -->
  <input-keyboard
    v-model="dataUserStore.password"
    :customRule="dataUserStore.checkPassword"
    type="text"
    label="User Password"
  />

  <!-- Database connection status -->
  <div class="text q-mb-lg">
    Database connection status:
    <template v-if="databaseStore.replicationStatus === 'initial'">
      <q-spinner color="primary" size="lg" :thickness="10" />
    </template>
    <template
      v-else-if="
        databaseStore.replicationErrorMessage &&
        databaseStore.replicationErrorMessage.length > 0
      "
    >
      <q-icon name="cancel" color="negative" size="lg" />
    </template>
    <template v-else>
      <q-icon name="check_circle" color="positive" size="lg" />
    </template>
    <!-- Refresh button -->
    <q-btn
      label="refresh"
      class="q-ml-md"
      @click="databaseStore.initializeDatabase()"
      color="primary"
    />
    <!-- Error message -->
    <div
      class="text-bold"
      v-if="
        databaseStore.replicationErrorMessage &&
        databaseStore.replicationErrorMessage.length > 0
      "
    >
      Error: {{ databaseStore.replicationErrorMessage }}
    </div>
  </div>

  <!-- Postcode -->
  <input-keyboard
    v-model.number="dataUserStore.postcode"
    :customRule="dataUserStore.checkPostcode"
    :hint="`Lat: ${dataUserStore.latitude}, Lon: ${dataUserStore.longitude}`"
    type="number"
    label="Postcode"
  />

  <!-- Age -->
  <input-keyboard
    v-model.number="dataUserStore.ageYears"
    :customRule="dataUserStore.checkAge"
    type="number"
    label="Age (years)"
  />

  <!-- Height -->
  <input-keyboard
    v-model.number="dataUserStore.heightCm"
    :customRule="dataUserStore.checkHeight"
    type="number"
    label="Height (cm)"
  />

  <!-- Weight -->
  <input-keyboard
    v-model.number="dataUserStore.weightKg"
    :customRule="dataUserStore.checkWeight"
    type="number"
    label="Weight (kg)"
  />

  <!-- Sex -->
  <div class="q-mt-lg text-bold">What is your birth sex?</div>
  <q-option-group
    :options="sexOptions"
    type="radio"
    v-model="dataUserStore.sex"
  />
</template>

<script lang="ts">
import { useDataUserStore } from 'src/stores/dataUser';
import { useDatabaseStore } from 'src/stores/database';
import { computed, defineComponent } from 'vue';
import InputKeyboard from './InputKeyboard.vue';

export default defineComponent({
  components: {
    InputKeyboard,
  },
  setup() {
    const dataUserStore = useDataUserStore();
    const databaseStore = useDatabaseStore();

    const userId = computed(() => dataUserStore.id);

    const sexOptions = [
      { label: 'Female', value: 'female' },
      { label: 'Male', value: 'male' },
      { label: 'Intersex/Prefer not to say', value: 'other' },
    ];

    return {
      dataUserStore,
      databaseStore,
      userId,
      sexOptions,
    };
  },
});
</script>
