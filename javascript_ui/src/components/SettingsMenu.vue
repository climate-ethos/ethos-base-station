<template>
  <div>
    <q-splitter v-model="splitterModel">
      <template v-slot:before>
        <q-tabs v-model="tab" vertical class="text-teal">
          <q-tab name="user-data" icon="person" label="User Data" />
          <q-tab name="sensors" icon="thermostat" label="Sensors" />
          <q-tab name="preferences" icon="assignment" label="Preferences" />
          <q-tab name="reset" icon="warning" label="Reset App" />
          <q-tab name="quit" icon="power_settings_new" label="Quit" />
        </q-tabs>
      </template>

      <template v-slot:after>
        <q-tab-panels
          class="full-height q-mr-sm"
          v-model="tab"
          animated
          vertical
          transition-prev="slide-down"
          transition-next="slide-up"
        >
          <q-tab-panel name="user-data" class="q-pa-none">
            <base-scroll-area>
              <div class="q-ma-lg">
                <SettingsMenuUserData />
              </div>
            </base-scroll-area>
          </q-tab-panel>

          <q-tab-panel name="sensors" class="q-pa-none">
            <base-scroll-area>
              <div class="q-ma-lg">
                <SettingsMenuSensors />
              </div>
            </base-scroll-area>
          </q-tab-panel>

          <q-tab-panel name="preferences" class="q-pa-none">
            <base-scroll-area>
              <div class="q-ma-lg">
                <SettingsMenuPreferences />
              </div>
            </base-scroll-area>
          </q-tab-panel>

          <q-tab-panel name="reset" class="q-pa-none">
            <base-scroll-area>
              <div class="q-ma-lg">
                <SettingsMenuReset />
              </div>
            </base-scroll-area>
          </q-tab-panel>

          <q-tab-panel name="quit" class="q-pa-none">
            <base-scroll-area>
              <div class="q-ma-lg">
                <SettingsMenuQuit />
              </div>
            </base-scroll-area>
          </q-tab-panel>
        </q-tab-panels>
      </template>
    </q-splitter>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import SettingsMenuReset from './SettingsMenuReset.vue';
import SettingsMenuSensors from './SettingsMenuSensors.vue';
import SettingsMenuPreferences from './SettingsMenuPreferences.vue';
import SettingsMenuUserData from './SettingsMenuUserData.vue';
import SettingsMenuQuit from './SettingsMenuQuit.vue';
import BaseScrollArea from './BaseScrollArea.vue';

export default defineComponent({
  components: {
    SettingsMenuUserData,
    SettingsMenuSensors,
    SettingsMenuPreferences,
    SettingsMenuReset,
    SettingsMenuQuit,
    BaseScrollArea,
  },
  setup() {
    return {
      tab: ref('user-data'),
      splitterModel: ref(20),
    };
  },
});
</script>

<style lang="scss" scoped></style>
