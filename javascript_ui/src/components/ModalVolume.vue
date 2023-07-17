<template>
  <q-dialog v-model="showModal">
    <q-card style="width: 800px; max-width: 90vw">
      <q-card-section class="row items-center">
        <div class="text-bold q-mr-xl">Volume Adjustment</div>
        <q-space />
        <q-btn icon="close" color="primary" v-close-popup>Close</q-btn>
      </q-card-section>
      <q-card-section class="row q-pa-lg">
        <div class="col-2">
          <q-btn
            class="float-left"
            color="info"
            icon="remove"
            @click="volumeStore.decreaseVolume"
          />
        </div>
        <div class="col">
          <q-slider
            v-model="volumeStore.volumeValue"
            class="fontsize-14"
            color="primary"
            markers
            marker-labels
            :min="0"
            :max="maxVolume"
          >
            <template v-slot:marker-label-group="{ markerList }">
              <div
                v-for="val in maxVolume - 1"
                :key="val"
                class="cursor-pointer"
                :class="markerList[val].classes"
                :style="markerList[val].style"
                @click="volumeStore.volumeValue = val"
              >
                {{ val }}
              </div>

              <q-icon
                v-for="val in [0, maxVolume]"
                :key="val"
                :class="markerList[val].classes"
                :style="markerList[val].style"
                size="lg"
                color="primary"
                :name="val === 0 ? 'volume_off' : 'volume_up'"
                @click="volumeStore.volumeValue = val"
              />
            </template>
          </q-slider>
        </div>
        <div class="col-2">
          <q-btn
            class="float-right"
            color="info"
            icon="add"
            @click="volumeStore.increaseVolume"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, toRefs, computed } from 'vue';
import { useVolumeStore, maxVolume } from 'src/stores/volume';

export default defineComponent({
  name: 'ModalVolume',
  emits: ['update:modelValue'],
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
  },
  setup(props, { emit }) {
    const { modelValue } = toRefs(props);
    const showModal = computed({
      get() {
        return modelValue.value;
      },
      set(newValue) {
        emit('update:modelValue', newValue);
      },
    });

    const volumeStore = useVolumeStore();

    return {
      showModal,
      maxVolume,
      volumeStore,
    };
  },
});
</script>

<style scoped></style>
