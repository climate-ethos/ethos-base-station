<template>
  <div class="text-h6 q-mb-md">Quit Application</div>
  <!-- Inputs below -->
  <div class="q-mb-sm text">Press below to quit the app</div>
  <q-btn color="negative" label="Quit" @click="quitApp" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  methods: {
    quitApp() {
      if (process.env.MODE === 'electron' && window.myElectronAPI) {
        window.myElectronAPI.quit();
      } else {
        window.close();
      }
    },
  },
  components: {},
});
</script>

<style scoped>
.settings-menu-quit {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
