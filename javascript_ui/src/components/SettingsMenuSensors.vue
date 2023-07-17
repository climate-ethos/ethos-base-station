<template>
  <!-- For each sensor -->
  <div v-for="(sensor, index) in allSensorData" :key="index" class="q-mb-md">
    <div class="row q-mb-md">
      <!-- Display sensor number -->
      <div class="col-2 text-bold">Sensor {{ index + 1 }}</div>
      <!-- Things that can be edited -->
      <div class="col">
        <input-keyboard
          v-model="sensor.name"
          label="Location"
          :customRule="checkSensorName"
        />
        <input-keyboard
          outlined
          v-model.number="sensor.id"
          :customRule="checkSensorId"
          type="number"
          label="ID"
          hint="The ID number on the case"
        />
      </div>
    </div>
    <!-- Dividing line between sensors -->
    <q-separator />
  </div>
</template>

<script lang="ts">
import { useDataSensorStore } from 'src/stores/dataSensor';
import { defineComponent } from 'vue';
import InputKeyboard from './InputKeyboard.vue';

export default defineComponent({
  components: { InputKeyboard },
  setup() {
    const { allSensorData } = useDataSensorStore();

    const checkSensorName = (newName: string) => {
      if (newName?.length > 0) {
        return true;
      }
      return 'Please enter sensor location';
    };

    const checkSensorId = (newId: number) => {
      // Check if ID is valid
      if (newId > 0 && newId < 1000) {
        return true;
      }
      return 'Enter a valid ID (1-999)';
    };

    return {
      allSensorData,
      checkSensorName,
      checkSensorId,
    };
  },
});
</script>

<style scoped lang="scss"></style>
