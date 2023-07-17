<template>
  <div class="text-h6 q-mb-md">Preferences</div>

  <!-- AUDIO OPTION -->
  <div class="text-bold">Which audio alert type would you like to receive?</div>
  <q-table
    :rows="audioOptions"
    :columns="audioColumns"
    row-key="label"
    @row-click="rowClick"
    hide-bottom
  >
    <template v-slot:body-cell-label="props">
      <q-td :props="props">
        <q-radio
          v-model="dataPreferencesStore.audioType"
          :val="props.row.value"
        />
        {{ props.row.label }}
      </q-td>
    </template>
    <template v-slot:body-cell-medium-priority="props">
      <q-td :props="props">
        <q-btn
          color="teal"
          :icon="isPlayingMedium[props.row.value  as AudioType] ? 'stop' : 'play_arrow'"
          @click.stop="playDemoAudio(props.row, RiskLevel.MEDIUM)"
        />
      </q-td>
    </template>
    <template v-slot:body-cell-high-priority="props">
      <q-td :props="props">
        <q-btn
          color="teal"
          :icon="isPlayingHigh[props.row.value  as AudioType] ? 'stop' : 'play_arrow'"
          @click.stop="playDemoAudio(props.row, RiskLevel.HIGH)"
        />
      </q-td>
    </template>
  </q-table>

  <!-- COOLING STRATEGIES OPTION -->
  <div class="q-mt-lg text-bold">
    Which cooling strategies do you have access to?
  </div>
  <q-table
    :rows="dataPreferencesStore.coolingStrategyOptions"
    :columns="coolingStrategyColumns"
    row-key="label"
    :pagination="{ rowsPerPage: 0 }"
    hide-bottom
  >
    <template v-slot:body-cell-haveAccessTo="props">
      <q-td :props="props">
        <q-toggle v-model="props.row.haveAccessTo" color="primary" size="xl" />
      </q-td>
    </template>

    <template v-slot:body-cell-wouldUse="props">
      <q-td :props="props">
        <q-toggle v-model="props.row.wouldUse" color="primary" size="xl" />
      </q-td>
    </template>
  </q-table>

  <!-- WHY NOT COOLING STRATEGY -->
  <div v-for="strategy in coolingStrategiesThatWontBeUsed" :key="strategy.name">
    <div class="q-mt-lg text-bold">
      Why wont you use {{ strategy.shortName }}
    </div>
    <q-option-group
      v-model="strategy.whyNotUse"
      size="xl"
      :options="whyWontUseOptions"
      color="green"
      type="checkbox"
    />
    <!-- If 'Other' is selected -->
    <input-keyboard
      v-if="strategy.whyNotUse.includes('Other')"
      v-model="strategy.whyNotUseOther"
      :custom-rule="() => true"
      type="text"
      label="Why other? Click here to enter more info..."
    />
  </div>
</template>

<script lang="ts">
import { QTableProps } from 'quasar';
import { playAudio, stopAudio } from 'src/helpers/audioAlertDispatcher';
import { useDataPreferencesStore } from 'src/stores/dataPreferences';
import InputKeyboard from './InputKeyboard.vue';
import { computed, defineComponent, reactive } from 'vue';
import { AudioType, RiskLevel } from './models';

interface TableOptions {
  label: string;
  value: AudioType;
}

export default defineComponent({
  components: { InputKeyboard },
  setup() {
    const dataPreferencesStore = useDataPreferencesStore();

    // AUDIO TONE OPTIONS
    const isPlayingMedium = reactive<Record<AudioType, boolean>>({
      [AudioType.TONE]: false,
      [AudioType.TTS]: false,
    });

    const isPlayingHigh = reactive<Record<AudioType, boolean>>({
      [AudioType.TONE]: false,
      [AudioType.TTS]: false,
    });

    let audioOptions: Array<TableOptions> = [
      {
        label: 'Tone alerts',
        value: AudioType.TONE,
      },
      {
        label: 'Text to speech alerts',
        value: AudioType.TTS,
      },
    ];

    let audioColumns: QTableProps['columns'] = [
      {
        name: 'label',
        label: 'Alert Type',
        field: 'label',
        required: true,
        align: 'left',
      },
      {
        name: 'medium-priority',
        label: 'Medium Priority',
        field: '',
        required: false,
        align: 'left',
      },
      {
        name: 'high-priority',
        label: 'High Priority',
        field: '',
        required: false,
        align: 'left',
      },
    ];

    const playDemoAudio = async (row: TableOptions, riskLevel: RiskLevel) => {
      if (riskLevel === RiskLevel.MEDIUM) {
        if (isPlayingMedium[row.value]) {
          stopAudio();
        } else {
          isPlayingMedium[row.value] = !isPlayingMedium[row.value];
          await playAudio(row.value, riskLevel);
          isPlayingMedium[row.value] = !isPlayingMedium[row.value];
        }
      } else if (riskLevel === RiskLevel.HIGH) {
        if (isPlayingHigh[row.value]) {
          stopAudio();
        } else {
          isPlayingHigh[row.value] = !isPlayingHigh[row.value];
          await playAudio(row.value, riskLevel);
          isPlayingHigh[row.value] = !isPlayingHigh[row.value];
        }
      }
    };

    const rowClick = (evt: Event, row: TableOptions) => {
      // Update group to be the value of the clicked row
      dataPreferencesStore.audioType = row.value;
    };

    const coolingStrategyColumns: QTableProps['columns'] = [
      {
        name: 'name',
        required: true,
        label: 'Strategy',
        align: 'left',
        field: 'name',
      },
      {
        name: 'haveAccessTo',
        required: true,
        label: 'Have Access To',
        align: 'center',
        field: 'haveAccessTo',
      },
      {
        name: 'wouldUse',
        required: true,
        label: 'Would Use',
        align: 'center',
        field: 'wouldUse',
      },
    ];

    const coolingStrategiesThatWontBeUsed = computed(() =>
      dataPreferencesStore.coolingStrategyOptions.filter(
        (strategy) => !strategy.wouldUse
      )
    );

    const whyWontUseOptions = [
      {
        label: 'Not practical - time consuming',
        value: 'Not practical - time consuming',
      },
      {
        label: 'Not practical - too much equipment needed',
        value: 'Not practical - too much equipment needed',
      },
      {
        label: 'Not practical - too much movement required',
        value: 'Not practical - too much movement required',
      },
      {
        label: 'Not practical - difficult for me to perform',
        value: 'Not practical - difficult for me to perform',
      },
      {
        label: 'Too uncomfortable to perform',
        value: 'Too uncomfortable to perform',
      },
      { label: 'Too unsafe', value: 'Too unsafe' },
      { label: 'Other', value: 'Other' },
    ];

    return {
      RiskLevel,
      dataPreferencesStore,
      audioOptions,
      audioColumns,
      playDemoAudio,
      rowClick,
      isPlayingMedium,
      isPlayingHigh,
      coolingStrategyColumns,
      coolingStrategiesThatWontBeUsed,
      whyWontUseOptions,
    };
  },
});
</script>
