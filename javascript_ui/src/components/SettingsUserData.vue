<template>
  <div class="text-h6 q-mb-md">User Data</div>
  <!-- Inputs below -->
  <input-keyboard
    v-model.number="dataUserStore.id"
    :customRule="checkId"
    type="number"
    label="User ID (number)"
  />

  <input-keyboard
    v-model.number="dataUserStore.postcode"
    :customRule="checkPostcode"
    :hint="`Lat: ${dataUserStore.latitude}, Lon: ${dataUserStore.longitude}`"
    type="number"
    label="Postcode"
  />

  <input-keyboard
    v-model.number="dataUserStore.ageYears"
    :customRule="checkAge"
    type="number"
    label="Age (years)"
  />

  <input-keyboard
    v-model.number="dataUserStore.heightCm"
    :customRule="checkHeight"
    type="number"
    label="Height (cm)"
  />

  <input-keyboard
    v-model.number="dataUserStore.weightKg"
    :customRule="checkWeight"
    type="number"
    label="Weight (kg)"
  />

  <div class="q-mt-lg text-bold">What is your birth sex?</div>
  <q-option-group
    :options="sexOptions"
    type="radio"
    v-model="dataUserStore.sex"
  />
</template>

<script lang="ts">
import { useDataUserStore } from 'src/stores/dataUser';
import { defineComponent } from 'vue';

import postcodeArrayString from 'assets/australian_postcodes.js';
import InputKeyboard from './InputKeyboard.vue';

export default defineComponent({
  components: {
    InputKeyboard,
  },
  setup() {
    const dataUserStore = useDataUserStore();

    const sexOptions = [
      { label: 'Female', value: 'female' },
      { label: 'Male', value: 'male' },
      { label: 'Intersex/Prefer not to say', value: 'other' },
    ];

    const checkPostcode = (postcode: number): boolean | string => {
      // Queensland postcodes range from 4000-5000
      if (postcode < 4000 || postcode >= 5000) {
        return 'Please enter a QLD postcode (4000-4999)';
      }
      // ❗ The below function causes side effects and sets the latitude/longitude
      const foundLatLon = findAndSetPostcodeLatLon(postcode);
      if (!foundLatLon) {
        return 'Postcode lat/lon not found';
      }
      // Everything looks ok
      return true;
    };

    /**
     * Lookup and set the latitude and longitude for a certain postcode
     * ❗ Side effect: will also change the lat/lon in the dataUserStore
     * @returns true if lat/lon are found, otherwise false
     */
    const findAndSetPostcodeLatLon = (postcode: number): boolean => {
      // Lookup postcode latitude and longitude
      const postcodeArray = JSON.parse(postcodeArrayString);
      let postcodeString = postcode.toString();
      // Loop through all postcodes and find correct one
      for (let area of postcodeArray) {
        // Postcode found
        if (area.postcode === postcodeString) {
          // Set postcode, latitude and longitude
          dataUserStore.latitude = area.lat;
          dataUserStore.longitude = area.long;
          return true;
        }
      }
      // No postcode found
      return false;
    };

    const checkId = (id: number) => {
      if (id && id > 0) {
        dataUserStore.id = id;
        return true;
      }
      return 'Please enter an ID';
    };

    const checkAge = (age: number) => {
      if (age > 0 && age < 200) {
        dataUserStore.ageYears = age;
        return true;
      }
      return 'Invalid age value (1-199 years)';
    };

    const checkHeight = (height: number) => {
      if (height > 0 && height < 400) {
        dataUserStore.heightCm = height;
        return true;
      }
      return 'Invalid height value (1-399cm)';
    };

    const checkWeight = (weight: number) => {
      if (weight > 0 && weight < 400) {
        dataUserStore.weightKg = weight;
        return true;
      }
      return 'Invalid weight value (1-399kg)';
    };

    return {
      dataUserStore,
      sexOptions,
      checkPostcode,
      checkId,
      checkAge,
      checkHeight,
      checkWeight,
    };
  },
});
</script>
