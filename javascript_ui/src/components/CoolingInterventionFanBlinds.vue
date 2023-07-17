<template>
  <q-table :rows="sensorsWithIconData" :columns="columns" hide-bottom>
    <template v-slot:header-cell-blindUse="props">
      <q-th v-bind="props" :props="props">
        Close<br />Window/<br />Blinds?
      </q-th>
    </template>
    <template #body-cell-sensor="props">
      <q-td>{{ props.row.name }}</q-td>
    </template>
    <template #body-cell-fanUse="props">
      <q-td class="text-center">
        <q-avatar
          :icon="props.row.fanUse.icon"
          size="lg"
          :color="props.row.fanUse.color"
          text-color="white"
        />
      </q-td>
    </template>
    <template #body-cell-blindUse="props">
      <q-td class="text-center">
        <q-avatar
          v-if="!isOutdoorSensor(props.row)"
          :icon="props.row.blindUse.icon"
          size="lg"
          :color="props.row.blindUse.color"
          text-color="white"
        />
      </q-td>
    </template>
  </q-table>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { shouldUseFan } from 'src/helpers/fanAndWindowUse';
import { calculateWBGT } from 'src/helpers/riskLevel';
import { useDataSensorStore, isOutdoorSensor } from 'src/stores/dataSensor';
import { SensorData } from 'src/components/models';
import { QTableProps } from 'quasar';

export default defineComponent({
  setup() {
    const dataSensorStore = useDataSensorStore();

    const columns: QTableProps['columns'] = [
      {
        name: 'name',
        label: '',
        field: 'name',
        align: 'center',
      },
      {
        name: 'fanUse',
        label: 'Use a fan?',
        field: 'fanUse',
        align: 'center',
      },
      {
        name: 'blindUse',
        label: 'Close window/blinds?',
        field: 'blindUse',
        align: 'center',
      },
    ];

    // Function to calculate whether blinds/windows should be closed
    function shouldCloseWindow(
      sensor: SensorData
    ): 'yes' | 'maybe' | 'no' | undefined {
      // If looking at outdoor sensor, return undefined
      if (isOutdoorSensor(sensor)) {
        return undefined;
      }
      // Calculate indoor and outdoor WBGT
      const indoorWBGT = calculateWBGT(sensor);
      const outdoorWBGT = calculateWBGT(dataSensorStore.getOutdoorSensor);
      if (indoorWBGT && outdoorWBGT) {
        if (indoorWBGT < outdoorWBGT - 2) {
          // Indoor temp is less than outdoor temp
          return 'yes';
        } else if (indoorWBGT < outdoorWBGT + 2) {
          // Indoor temp and outdoor temp are similar
          return 'maybe';
        } else {
          // Indoor temp is higher than outdoor temp
          return 'no';
        }
      }
      return undefined;
    }

    function getIconColor(result: 'yes' | 'maybe' | 'no' | undefined) {
      let icon, color;
      switch (result) {
        case 'yes':
          icon = 'done';
          color = 'positive';
          break;
        case 'maybe':
          icon = 'question_mark';
          color = 'amber';
          break;
        case 'no':
          icon = 'close';
          color = 'negative';
          break;
        default:
          icon = 'device_unknown';
          color = 'grey';
      }
      return { icon, color };
    }

    const sensorsWithIconData = computed(() => {
      return dataSensorStore.allSensorData.map((sensor) => {
        // Calculate status, and display icon accordingly
        let fanUse = getIconColor(shouldUseFan(sensor));
        let blindUse = getIconColor(shouldCloseWindow(sensor));
        // Extend sensor with icon and color data for fan use and blind use
        return { ...sensor, fanUse, blindUse };
      });
    });

    return { sensorsWithIconData, columns, isOutdoorSensor };
  },
});
</script>
