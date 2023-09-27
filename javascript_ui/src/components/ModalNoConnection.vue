<template>
  <q-dialog v-model="isDisconnected" :persistent="true" full-width>
    <q-card class="bg-negative text-white text-h6 q-pa-md">
      <q-card-section>
        <div>
          Error, unable to connect to temperature sensors (socket issue). This
          indicates that the app has crashed and will need to be relaunched.
        </div>
      </q-card-section>
      <q-card-section>
        <CardContact />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

import CardContact from './CardContact.vue';

export default defineComponent({
  name: 'ModalNoConnection',
  components: { CardContact },
  setup() {
    return {
      isDisconnected: computed(() => false),
    };
  },
});
</script>
