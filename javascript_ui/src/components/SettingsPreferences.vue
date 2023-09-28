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
    Which cooling strategies do you have access to and which would you use?
  </div>
  <q-table
    :rows="dataPreferencesStore.coolingStrategyRows"
    :columns="coolingStrategyColumns"
    row-key="label"
    :pagination="{ rowsPerPage: 0 }"
    hide-bottom
  >
    <template v-slot:body="props">
      <q-tr
        :props="props"
        :class="{
          'bg-grey text-white': !props.row.effectiveness,
        }"
      >
        <q-td :props="props" key="name">
          {{ props.row.name }}
        </q-td>
        <q-td :props="props" key="haveAccessTo">
          <q-toggle
            v-if="props.row.effectiveness"
            :model-value="props.row.haveAccessTo"
            @update:model-value="
              (val) =>
                dataPreferencesStore.setWouldUseOrHaveAccessTo(
                  props.row.key,
                  'haveAccessTo',
                  val
                )
            "
            :label="props.row.haveAccessTo ? 'Yes' : 'No'"
            color="primary"
            size="xl"
          />
        </q-td>
        <q-td :props="props" key="wouldUse">
          <q-toggle
            v-if="props.row.effectiveness"
            :model-value="props.row.wouldUse"
            @update:model-value="
              (val) =>
                dataPreferencesStore.setWouldUseOrHaveAccessTo(
                  props.row.key,
                  'wouldUse',
                  val
                )
            "
            :label="props.row.wouldUse ? 'Yes' : 'No'"
            color="primary"
            size="xl"
          />
        </q-td>
      </q-tr>
    </template>
  </q-table>

  <!-- WHY NOT COOLING STRATEGY -->
  <div v-for="strategy in coolingStrategiesThatWontBeUsed" :key="strategy.key">
    <div class="q-mt-lg text-bold">
      Reason/s why you wouldn't use
      {{ coolingStrategies[strategy.key].shortName }}
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

  <!-- MARK FOR FOLLOW UP -->
  <div class="q-mt-lg text-bold">
    Would you be interested in a follow up with a focus group discussion?
  </div>
  <q-toggle
    v-model="dataPreferencesStore.isFollowUp"
    :label="dataPreferencesStore.isFollowUp ? 'Yes' : 'No'"
    color="primary"
    size="xl"
  />
</template>

<script lang="ts">
import { QTableProps } from 'quasar';
import { playAudio, stopAudio } from 'src/helpers/audioAlertDispatcher';
import { coolingStrategies } from 'src/helpers/coolingStrategies';
import { useDataPreferencesStore } from 'src/stores/dataPreferences';
import InputKeyboard from './InputKeyboard.vue';
import { computed, defineComponent, onBeforeUnmount, reactive } from 'vue';
import { AudioType, RiskLevel } from 'src/typings/data-types';

interface TableOptions {
  label: string;
  value: AudioType;
}

export default defineComponent({
  components: { InputKeyboard },
  setup() {
    const dataPreferencesStore = useDataPreferencesStore();

    onBeforeUnmount(() => {
      dataPreferencesStore.postToDatabase();
    });

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
          isPlayingMedium[row.value] = true;
          await playAudio(row.value, riskLevel);
          isPlayingMedium[row.value] = false;
        }
      } else if (riskLevel === RiskLevel.HIGH) {
        if (isPlayingHigh[row.value]) {
          stopAudio();
        } else {
          isPlayingHigh[row.value] = true;
          await playAudio(row.value, riskLevel);
          isPlayingHigh[row.value] = false;
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
        label: 'Time consuming',
        value: 'Time consuming',
      },
      {
        label: 'Too much equipment needed',
        value: 'Too much equipment needed',
      },
      {
        label:
          'Too much movement required (dexterity, physical exertion, etc.)',
        value:
          'Too much movement required (dexterity, physical exertion, etc.)',
      },
      {
        label: 'Messy to perform (water dripping, risk of stains, etc.)',
        value: 'Messy to perform (water dripping, risk of stains, etc.)',
      },
      {
        label: 'Costs too much (electricity, maintenance, etc.)',
        value: 'Costs too much (electricity, maintenance, etc.)',
      },
      {
        label: 'Too noisy',
        value: 'Too noisy',
      },
      {
        label: 'Physically uncomfortable to perform (too cold, too wet, etc.)',
        value: 'Physically uncomfortable to perform (too cold, too wet, etc.)',
      },
      {
        label: 'Unsafe (risk of slips, falls, etc.)',
        value: 'Unsafe (risk of slips, falls, etc.)',
      },
      { label: 'Other', value: 'Other' },
    ];

    return {
      coolingStrategies,
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
