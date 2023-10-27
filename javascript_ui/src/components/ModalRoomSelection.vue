<!-- ModalRoomSelection.vue -->
<template>
  <q-dialog
    v-model="dataAlertsStore.isShowRoomSelectModal"
    full-width
    persistent
  >
    <q-card class="q-pa-xl">
      <q-card-section>
        <div class="fontsize-20 q-mb-md">
          Please select the room you are currently in or closest to:
        </div>
        <div class="room-grid">
          <!-- Define a 2x2 grid layout -->
          <q-btn
            v-for="room in availableRooms.slice(0, 4)"
            :key="room"
            :label="room"
            @click="selectRoom(room ? room : '')"
            :color="room === selectedRoom ? 'primary' : 'secondary'"
            class="fontsize-16 room-button"
          />
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          label="Confirm"
          class="fontsize-16 q-mr-lg"
          color="primary"
          :disabled="!selectedRoom"
          @click="confirmSelection"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useDataSensorStore } from 'stores/dataSensor';
import { useDataAlertsStore } from 'src/stores/dataAlerts';

export default defineComponent({
  name: 'ModalRoomSelection',
  setup() {
    const dataSensorStore = useDataSensorStore();
    const dataAlertsStore = useDataAlertsStore();

    const selectedRoom = ref<string | null>(null);

    const availableRooms = dataSensorStore.allSensorData.map(
      (sensorData) => sensorData.location
    );

    const selectRoom = (room: string) => {
      selectedRoom.value = room;
    };

    const confirmSelection = () => {
      if (selectedRoom.value) {
        dataAlertsStore.userLocatedAt = selectedRoom.value;
        console.log(`User is in room: ${selectedRoom.value}`);
      }
      dataAlertsStore.isShowRoomSelectModal = false; // Close the modal after confirmation
    };

    return {
      dataAlertsStore,
      availableRooms,
      selectedRoom,
      selectRoom,
      confirmSelection,
    };
  },
});
</script>

<style lang="scss" scoped>
.room-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.room-button {
  width: 100%;
}
</style>
