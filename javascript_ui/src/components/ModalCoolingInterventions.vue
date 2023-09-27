<template>
  <q-dialog v-model="showModal" full-width full-height persistent>
    <CoolingInterventionList
      v-show="displayInfo === null"
      @show-info="showInfo"
    />
    <CoolingInterventionInfo
      v-if="displayInfo !== null"
      :strategy="displayInfo"
      @back="displayInfo = null"
      @close="
        displayInfo = null;
        showModal = false;
      "
    />
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, toRefs, computed } from 'vue';
import CoolingInterventionList from './CoolingInterventionList.vue';
import CoolingInterventionInfo from './CoolingInterventionInfo.vue';
import { CoolingStrategy } from 'src/typings/data-types';

export default defineComponent({
  name: 'ModalCoolingInterventions',
  components: {
    CoolingInterventionList,
    CoolingInterventionInfo,
  },
  emits: ['update:modelValue'],
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
  },
  setup(props, { emit }) {
    const { modelValue } = toRefs(props);
    const displayInfo: Ref<null | CoolingStrategy> = ref(null);
    const showModal = computed({
      get() {
        return modelValue.value;
      },
      set(newValue) {
        emit('update:modelValue', newValue);
      },
    });

    function showInfo(item: CoolingStrategy) {
      displayInfo.value = item;
    }

    return {
      showModal,
      displayInfo,
      showInfo,
    };
  },
});
</script>
