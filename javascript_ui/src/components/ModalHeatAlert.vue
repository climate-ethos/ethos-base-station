<!-- ModalHeatAlert.vue -->
<template>
  <q-dialog v-model="showModal" full-width persistent>
    <q-card :class="flashClass" class="q-pa-xl">
      <div class="bg-white">
        <q-card-section v-if="currentRoomsAtRiskLevel">
          <div class="fontsize-20">
            The <b>{{ currentRoomsAtRiskLevel }}</b> sensor/s has recorded
            temperature readings which indicate that your body temperature may
            be become
            {{
              dataAlertsStore.alertRiskLevel === RiskLevel.HIGH
                ? 'unsafely elevated'
                : 'elevated'
            }}
            if you remain in that area.
          </div>
          <div class="fontsize-20 q-mt-md">
            Your risk level is estimated to be:
            <span class="fontsize-20 text-bold">{{ riskLevelText }}</span>
          </div>
          <div
            class="fontsize-20 q-mt-md"
            v-if="dataAlertsStore.alertRiskLevel === RiskLevel.HIGH"
          >
            Please consider cooling the space with air conditioning or making
            your way to a cooler location if safe (e.g., shops, library).
          </div>
          <div v-if="coolestRoomString" class="fontsize-20 q-mt-md">
            The lowest risk area for you is currently:
            <span class="fontsize-20 text-bold">{{ coolestRoomString }}</span>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            :label="`I am not located at ${currentRoomsAtRiskLevel}`"
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
      </div>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, computed, watch } from 'vue';
import { RiskLevel } from 'src/typings/data-types';
import { AlertDatabaseStructure } from 'src/typings/database-types';
import { isOutdoorSensor } from 'src/helpers/dataSensor';
import { useDataSensorStore } from 'stores/dataSensor';
import { useVolumeStore } from 'src/stores/volume';
import { useDatabaseStore } from 'src/stores/database';
import { useDataAlertsStore } from 'src/stores/dataAlerts';

export default defineComponent({
  name: 'ModalHeatAlert',
  components: {},
  setup(props, { emit }) {
    const dataSensorStore = useDataSensorStore();
    const dataAlertsStore = useDataAlertsStore();
    const volumeStore = useVolumeStore();
    const databaseStore = useDatabaseStore();

    // The coolest room in the house for alert
    const coolestRoomString = computed(() => {
      const location = dataSensorStore.getCoolestSensor?.location;
      const riskLevel = dataSensorStore.getCoolestSensor?.riskLevel;
      const riskLevelText = getRiskLevelText(riskLevel);
      if (!location || !riskLevel) {
        return undefined;
      }
      return `${location} (risk level: ${riskLevelText})`;
    });

    // Whether to show the modal
    const showModal = computed(
      () => dataAlertsStore.alertRiskLevel > RiskLevel.LOW
    );

    // Function to get the current indoor rooms that are at a certain risk level
    const getCurrentRoomsAtRiskLevel = (riskLevel: RiskLevel) => {
      return dataSensorStore.allSensorData
        .filter((sensorData) => {
          return (
            !isOutdoorSensor(sensorData) && sensorData.riskLevel === riskLevel
          );
        })
        .map((sensorData) => sensorData.location);
    };

    // The room locations that currently match alert RiskLevel
    const currentRoomsAtRiskLevelArray = computed(() => {
      return getCurrentRoomsAtRiskLevel(dataAlertsStore.alertRiskLevel);
    });

    // Join array of room names with commas
    const currentRoomsAtRiskLevel = computed(() =>
      currentRoomsAtRiskLevelArray.value.join(', ')
    );

    /**
     * Watch the current rooms at risk level, and if there are none (e.g. upgraded or downgraded risk),
     * check through risk levels until rooms are found and update alert risk level.
     * Don't run this check if risk level is currently low.
     */
    watch(currentRoomsAtRiskLevelArray, (newValue) => {
      if (dataAlertsStore.alertRiskLevel === RiskLevel.LOW) {
        return;
      }
      if (newValue.length === 0) {
        const riskLevels = [RiskLevel.HIGH, RiskLevel.MEDIUM, RiskLevel.LOW];
        for (const risk of riskLevels) {
          const rooms = getCurrentRoomsAtRiskLevel(risk);
          if (rooms.length > 0) {
            dataAlertsStore.alertRiskLevel = risk; // Update the alert risk level
            break;
          }
        }
      }
    });

    // What color the flash should be
    const flashClass = computed(() => {
      switch (dataAlertsStore.alertRiskLevel) {
        case RiskLevel.MEDIUM:
          return 'flash-yellow';
        case RiskLevel.HIGH:
          return 'flash-red';
        default:
          return '';
      }
    });

    const getRiskLevelText = (riskLevel: RiskLevel | undefined) => {
      switch (riskLevel) {
        case RiskLevel.LOW:
          return 'LOW';
        case RiskLevel.MEDIUM:
          return 'MEDIUM';
        case RiskLevel.HIGH:
          return 'HIGH';
        default:
          return 'unknown';
      }
    };

    // Risk level text
    const riskLevelText = computed(() =>
      getRiskLevelText(dataAlertsStore.alertRiskLevel)
    );

    // Send data to database when modal dismissed
    const dismissModalAndSendToDatabase = (
      dismissMethod: AlertDatabaseStructure['dismissMethod']
    ) => {
      // Send alert data to database
      databaseStore.postDocument('alert', {
        riskLevel: dataAlertsStore.alertRiskLevel,
        volumePercent: volumeStore.volumePercent,
        dismissMethod: dismissMethod,
      });
      // Dismiss modal
      dataAlertsStore.alertRiskLevel = RiskLevel.LOW;
    };

    const notLocatedAt = () => {
      dismissModalAndSendToDatabase('not here');
      // Show a modal where the user can select what room they are in
      dataAlertsStore.isShowRoomSelectModal = true;
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
      RiskLevel,
      coolestRoomString,
      currentRoomsAtRiskLevel,
      dataAlertsStore,
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
    background-color: #fcd56a;
  }
  25%,
  75% {
    background-color: $warning;
  }
}

.flash-red {
  animation: flash-red 3s infinite;
}

@keyframes flash-red {
  0%,
  50%,
  100% {
    background-color: #db4a4a;
  }
  25%,
  75% {
    background-color: $negative;
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
