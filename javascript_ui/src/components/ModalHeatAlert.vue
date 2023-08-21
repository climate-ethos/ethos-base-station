<!-- ModalHeatAlert.vue -->
<template>
  <q-dialog v-model="showModal" full-width persistent>
    <q-card :class="flashClass">
      <q-card-section v-if="alertSensor">
        <div class="fontsize-30 text-bold">Heat Alert</div>
        <div class="fontsize-20">
          The <b>{{ alertSensor.name }}</b> has recorded temperature readings
          which indicate that your body may be beginning to overheat if you are
          located in that area.
        </div>
        <div class="fontsize-20 text-bold q-mt-md">
          Your risk level is estimated to be: {{ riskLevelText }}
        </div>
      </q-card-section>

      <q-card-actions align="right" class="q-mb-lg">
        <q-btn
          :label="`I am not located at ${alertSensor?.name}`"
          class="fontsize-15 q-mr-lg"
          color="warning"
          @click="notLocatedAt"
        />
        <q-btn
          label="Help me cool down"
          class="fontsize-15 q-mr-lg"
          color="primary"
          @click="coolDown"
        />
        <q-btn
          label="Dismiss"
          class="fontsize-15 q-mr-lg"
          color="negative"
          @click="dismiss"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useDataSensorStore } from 'stores/dataSensor';
import { RiskLevel } from 'src/typings/data-types';
import { AlertDatabaseStructure } from 'src/typings/database-types';
import { useVolumeStore } from 'src/stores/volume';
import { useDatabaseStore } from 'src/stores/database';

export default defineComponent({
  name: 'ModalHeatAlert',
  components: {},
  setup(props, { emit }) {
    const dataSensorStore = useDataSensorStore();
    const volumeStore = useVolumeStore();
    const databaseStore = useDatabaseStore();

    const alertSensor = computed(() => dataSensorStore.alertSensor);
    const showModal = computed(() => dataSensorStore.alertSensor !== null);

    const flashClass = computed(() => {
      switch (dataSensorStore.alertSensor?.riskLevel) {
        case RiskLevel.MEDIUM:
          return 'flash-yellow';
        case RiskLevel.HIGH:
          return 'flash-red';
        default:
          return '';
      }
    });

    const riskLevelText = computed(() => {
      switch (dataSensorStore.alertSensor?.riskLevel) {
        case RiskLevel.LOW:
          return 'LOW';
        case RiskLevel.MEDIUM:
          return 'MEDIUM';
        case RiskLevel.HIGH:
          return 'HIGH';
        default:
          return 'unknown';
      }
    });

    const dismissModalAndSendToDatabase = (
      dismissMethod: AlertDatabaseStructure['dismissMethod']
    ) => {
      // Send alert data to database
      databaseStore.postDocument('alert', {
        riskLevel: dataSensorStore.alertSensor?.riskLevel,
        volumePercent: volumeStore.volumePercent,
        dismissMethod: dismissMethod,
      });
      // Dismiss modal
      dataSensorStore.alertSensor = null;
    };

    const notLocatedAt = () => {
      dismissModalAndSendToDatabase('not here');
    };

    const coolDown = () => {
      dismissModalAndSendToDatabase('cooling strategies');
      // Open cooling modal
      emit('open-cooling-modal');
    };

    const dismiss = () => {
      dismissModalAndSendToDatabase('dismiss');
    };

    return {
      alertSensor,
      showModal,
      riskLevelText,
      flashClass,
      notLocatedAt,
      coolDown,
      dismiss,
    };
  },
});
</script>

<style lang="scss" scoped>
.flash-yellow {
  animation: flash-yellow 3s infinite;
}

@keyframes flash-yellow {
  0%,
  50%,
  100% {
    background-color: white;
  }
  25%,
  75% {
    background-color: #ffe291;
  }
}

.flash-red {
  animation: flash-red 3s infinite;
}

@keyframes flash-red {
  0%,
  50%,
  100% {
    background-color: white;
  }
  25%,
  75% {
    background-color: #b35959;
  }
}

@keyframes flash {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.1;
  }
  100% {
    opacity: 1;
  }
}
</style>
