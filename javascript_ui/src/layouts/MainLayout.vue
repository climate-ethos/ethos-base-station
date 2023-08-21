<template>
  <q-layout view="lHh Lpr lFf" class="bg-blue-grey-2">
    <!-- Register Modals -->
    <ModalNoConnection />
    <ModalSurvey />
    <ModalVolume v-model="isShowVolumeModal" />
    <ModalHeatAlert @open-cooling-modal="isShowCoolingModal = true" />
    <ModalCoolingInterventions v-model="isShowCoolingModal" />
    <ModalHelp v-model="isShowHelpModal" />
    <ModalFanInfo v-model="isShowFanModal" />
    <!-- Main layout -->
    <q-header flat class="transparent" v-if="$route.path !== '/initialize'">
      <q-toolbar class="ethos-toolbar">
        <img
          v-if="$route.path !== '/settings'"
          src="ethos.svg"
          height="50"
          @click="showSettingsButton"
        />
        <q-btn
          v-if="$route.path !== '/' && $route.path !== '/initialize'"
          to="/"
          color="info"
          label="go back to home"
          icon="home"
          class="q-ml-md fontsize-16"
        />

        <BaseCurrentTime class="fontsize-20" />
        <BaseNetworkConnection />

        <q-toolbar-title></q-toolbar-title>

        <q-btn
          v-if="$route.path !== '/settings'"
          @click="isShowCoolingModal = true"
          class="q-mr-lg fontsize-16"
          color="info"
          label="cool down"
          icon="ac_unit"
        />
        <q-btn
          v-if="$route.path !== '/settings'"
          @click="isShowHelpModal = true"
          class="q-mr-lg fontsize-16"
          color="primary"
          label="app help"
          icon="question_mark"
        />
        <q-btn
          @click="isShowVolumeModal = true"
          class="fontsize-16"
          color="primary"
          label="volume"
          :icon="volumeIcon"
        />
        <q-btn
          v-if="isShowSettingsButton"
          @click="hideSettingsButton"
          class="q-ml-md fontsize-16"
          color="info"
          icon="settings"
          to="settings"
        />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer
      class="text-black"
      elevated
      :model-value="keyboardStore.isKeyboardBound"
    >
      <SimpleKeyboard />
    </q-footer>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref, computed, provide } from 'vue';

import { useKeyboardStore } from 'src/stores/keyboard';
import { useVolumeStore } from 'src/stores/volume';

import BaseNetworkConnection from 'src/components/BaseNetworkConnection.vue';
import BaseCurrentTime from 'components/BaseCurrentTime.vue';
import ModalNoConnection from 'components/ModalNoConnection.vue';
import ModalCoolingInterventions from 'components/ModalCoolingInterventions.vue';
import SimpleKeyboard from 'src/components/SimpleKeyboard.vue';
import ModalHelp from 'src/components/ModalHelp.vue';
import ModalHeatAlert from 'src/components/ModalHeatAlert.vue';
import ModalVolume from 'src/components/ModalVolume.vue';
import ModalFanInfo from 'src/components/ModalFanInfo.vue';
import ModalSurvey from 'src/components/ModalSurvey.vue';

export default defineComponent({
  name: 'MainLayout',
  components: {
    ModalNoConnection,
    ModalCoolingInterventions,
    ModalHelp,
    ModalHeatAlert,
    SimpleKeyboard,
    BaseCurrentTime,
    ModalVolume,
    ModalFanInfo,
    BaseNetworkConnection,
    ModalSurvey,
  },
  setup() {
    const keyboardStore = useKeyboardStore();
    const volumeStore = useVolumeStore();
    let isShowSettingsButton = ref(false);
    let isShowVolumeModal = ref(false);
    let isShowCoolingModal = ref(false);
    let isShowHelpModal = ref(false);
    let isShowFanModal = ref(false);
    // Provide to allow descendent ancestors to modify
    provide('isShowFanModal', isShowFanModal);

    let timeoutShowSettingsButton: null | number = null;
    let showSettingsPressedCount = 0;

    // Determine volume icon based on volume
    let volumeIcon = computed(() => {
      if (volumeStore.volumePercent === 0) {
        return 'volume_off';
      } else if (volumeStore.volumePercent <= 0.2) {
        return 'volume_mute';
      } else if (volumeStore.volumePercent <= 0.6) {
        return 'volume_down';
      } else {
        return 'volume_up';
      }
    });

    // Function to show settings button if activated multiple times in quick succession
    let showSettingsButton = () => {
      // Increment pressed count
      showSettingsPressedCount++;
      // Check if the threshold has been met to show the settings button
      if (showSettingsPressedCount >= 7) {
        showSettingsPressedCount = 0;
        isShowSettingsButton.value = true;
        return;
      }
      // Clear the timeout (if it exists)
      if (timeoutShowSettingsButton) {
        clearTimeout(timeoutShowSettingsButton);
      }
      // Set another timeout that resets logo pressed count when it expires
      timeoutShowSettingsButton = window.setTimeout(() => {
        showSettingsPressedCount = 0;
      }, 3000);
    };

    let hideSettingsButton = () => {
      isShowSettingsButton.value = false;
    };

    return {
      keyboardStore,
      volumeIcon,
      isShowSettingsButton,
      isShowVolumeModal,
      isShowCoolingModal,
      isShowHelpModal,
      isShowFanModal,
      showSettingsButton,
      hideSettingsButton,
    };
  },
});
</script>

<style lang="scss" scoped>
.ethos-toolbar {
  height: $toolbar-height;
}
</style>
