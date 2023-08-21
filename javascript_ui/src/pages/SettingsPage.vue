<template>
  <div>
    <InputPasscode v-if="!isShowSettings" @success="isShowSettings = true" />
    <div v-if="isShowSettings">
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
                  <SettingsUserData />
                </div>
              </base-scroll-area>
            </q-tab-panel>

            <q-tab-panel name="sensors" class="q-pa-none">
              <base-scroll-area>
                <div class="q-ma-lg">
                  <SettingsSensors />
                </div>
              </base-scroll-area>
            </q-tab-panel>

            <q-tab-panel name="preferences" class="q-pa-none">
              <base-scroll-area>
                <div class="q-ma-lg">
                  <SettingsPreferences />
                </div>
              </base-scroll-area>
            </q-tab-panel>

            <q-tab-panel name="reset" class="q-pa-none">
              <base-scroll-area>
                <div class="q-ma-lg">
                  <SettingsReset />
                </div>
              </base-scroll-area>
            </q-tab-panel>

            <q-tab-panel name="quit" class="q-pa-none">
              <base-scroll-area>
                <div class="q-ma-lg">
                  <SettingsQuit />
                </div>
              </base-scroll-area>
            </q-tab-panel>
          </q-tab-panels>
        </template>
      </q-splitter>
    </div>
  </div>
</template>

<script lang="ts">
import InputPasscode from 'src/components/InputPasscode.vue';
import SettingsReset from 'src/components/SettingsReset.vue';
import SettingsSensors from 'src/components/SettingsSensors.vue';
import SettingsPreferences from 'src/components/SettingsPreferences.vue';
import SettingsUserData from 'src/components/SettingsUserData.vue';
import SettingsQuit from 'src/components/SettingsQuit.vue';
import BaseScrollArea from 'src/components/BaseScrollArea.vue';

import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'IndexPage',
  components: {
    InputPasscode,
    SettingsReset,
    SettingsSensors,
    SettingsPreferences,
    SettingsUserData,
    SettingsQuit,
    BaseScrollArea,
  },
  setup() {
    let isShowSettings = ref(false);

    return {
      isShowSettings,
      tab: ref('user-data'),
      splitterModel: ref(20),
    };
  },
});
</script>

<style lang="scss" scoped></style>
