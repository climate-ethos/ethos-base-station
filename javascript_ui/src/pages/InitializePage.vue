<template>
  <div class="q-pa-md">
    <q-stepper
      v-model="step"
      ref="stepper"
      header-class="bg-grey-2"
      class="fontsize-14"
      @transition="keyboardStore.unbindKeyboard()"
      animated
      header-nav
    >
      <q-step :name="1" title="Setup Wizard" icon="settings" :done="step > 1">
        <base-scroll-area height="75vh">
          <div class="q-ma-md">
            Looks like there may be some undefined data. This page will walk you
            through setting everything up.
            <div class="q-my-sm">
              If you do not intend to be here please contact the Ethos team:
            </div>
            <ContactCard />
          </div>
        </base-scroll-area>
      </q-step>

      <q-step :name="2" title="Setup User Data" icon="person" :done="step > 2">
        <base-scroll-area height="75vh">
          <div class="q-ma-md">
            <SettingsMenuUserData />
          </div>
        </base-scroll-area>
      </q-step>

      <q-step
        :name="3"
        title="Setup Sensor Data"
        icon="device_thermostat"
        :done="step > 3"
        :header-nav="step >= 2 && isNextStepAvailable"
      >
        <base-scroll-area height="75vh">
          <div class="q-ma-md">
            <SettingsMenuSensors />
          </div>
        </base-scroll-area>
      </q-step>

      <q-step
        :name="4"
        title="Preferences"
        icon="assignment"
        :done="step > 4"
        :header-nav="step >= 3 && isNextStepAvailable"
      >
        <base-scroll-area height="75vh">
          <div class="q-ma-md">
            <SettingsMenuPreferences />
          </div>
        </base-scroll-area>
      </q-step>

      <template v-slot:navigation>
        <q-stepper-navigation class="bg-grey-2">
          <div class="row items-center q-pb-none q-pt-md">
            <q-btn
              v-if="step > 1"
              flat
              color="primary"
              @click="() => stepper?.previous()"
              label="Back"
              class="q-ml-md fontsize-14"
            />
            <q-space />
            <q-btn
              @click="nextStep"
              color="primary"
              :disable="!isNextStepAvailable"
              :label="step === 4 ? 'Finish' : 'Continue'"
              class="fontsize-14"
            />
          </div>
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </div>
</template>

<script lang="ts">
import { defineComponent, Ref, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import ContactCard from 'src/components/ContactCard.vue';
import SettingsMenuUserData from 'src/components/SettingsMenuUserData.vue';
import SettingsMenuSensors from 'src/components/SettingsMenuSensors.vue';
import SettingsMenuPreferences from 'src/components/SettingsMenuPreferences.vue';
import { useDataUserStore } from 'src/stores/dataUser';
import { useDataSensorStore } from 'src/stores/dataSensor';
import { useKeyboardStore } from 'src/stores/keyboard';
import { QStepper } from 'quasar';
import BaseScrollArea from 'src/components/BaseScrollArea.vue';

export default defineComponent({
  components: {
    ContactCard,
    SettingsMenuUserData,
    SettingsMenuSensors,
    SettingsMenuPreferences,
    BaseScrollArea,
  },
  setup() {
    const step: Ref<number> = ref(1);
    const stepper: Ref<QStepper | null> = ref(null);

    const router = useRouter();
    const dataUserStore = useDataUserStore();
    const dataSensorStore = useDataSensorStore();
    const keyboardStore = useKeyboardStore();

    const isNextStepAvailable = computed<boolean>(() => {
      // Info Page
      if (step.value === 1) {
        return true;
      }
      // User Data
      else if (step.value === 2 && !dataUserStore.containsUndefined) {
        return true;
      }
      // Sensor Data
      else if (step.value === 3 && !dataSensorStore.containsUndefined) {
        return true;
      }
      // Preferences
      else if (step.value === 4) {
        return true;
      }
      return false;
    });

    const nextStep = () => {
      if (step.value === 4) {
        // Finish and move back to home
        router.push('/');
      } else {
        // Move to next step of setup
        stepper.value?.next();
      }
    };

    return {
      step,
      stepper,
      isNextStepAvailable,
      keyboardStore,
      nextStep,
    };
  },
});
</script>

<style>
/* Remove padding for q-stepper inner */
.q-stepper__step-inner {
  padding: 0px !important;
}
</style>
