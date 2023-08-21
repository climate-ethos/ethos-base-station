<template>
  <q-dialog full-width full-height v-model="surveyStore.isShowSurveyModal">
    <BaseModalScroll>
      <template #header>
        <div class="row items-center">
          <div>Survey</div>
          <q-space />
          <q-btn icon="close" color="primary" v-close-popup>Close</q-btn>
        </div>
      </template>
      <template #main>
        <p>
          It appears you have had {{ surveyStore.alertsInLastTimePeriod }} heat
          alert/s recently. We'd appreciate if you could fill out this short
          survey (4 questions).
        </p>

        <!-- Survey Questions -->
        <div class="q-mt-lg text-bold">Were you home today?</div>
        <q-option-group
          :options="wasHomeOptions"
          type="radio"
          v-model="surveyStore.surveyAnswers.wasHome"
        />

        <div class="q-mt-lg text-bold">
          What cooling strategies did you use (if any)?
        </div>
        <q-option-group
          :options="coolingStrategiesUsedOptions"
          type="radio"
          v-model="surveyStore.surveyAnswers.coolingStrategiesUsed"
        />

        <div class="q-mt-lg text-bold">
          How effective do you feel the cooling strategies used were?
        </div>
        <q-option-group
          :options="howEffectiveOptions"
          type="radio"
          v-model="surveyStore.surveyAnswers.howEffective"
        />

        <q-btn
          label="finish"
          color="primary"
          size="xl"
          class="q-mt-lg full-width"
          v-close-popup
        />
      </template>
    </BaseModalScroll>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BaseModalScroll from './BaseModalScroll.vue';
import { useSurveyStore } from 'src/stores/survey';
import { coolingStrategies } from 'src/helpers/coolingStrategies';

export default defineComponent({
  name: 'ModalSurvey',
  components: { BaseModalScroll },
  setup() {
    const surveyStore = useSurveyStore();

    const wasHomeOptions = [
      { label: 'Yes', value: true },
      { label: 'No', value: false },
    ];

    const coolingStrategiesUsedOptions = Object.keys(coolingStrategies)
      .map((key) => ({ label: coolingStrategies[key].name, value: key }))
      .concat([{ label: 'Other', value: 'other' }]);

    const howEffectiveOptions = [
      { label: 'Not effective at all', value: 1 },
      { label: 'Slightly effective', value: 2 },
      { label: 'Moderately effective', value: 3 },
      { label: 'Very effective', value: 4 },
      { label: 'Extremely effective', value: 5 },
    ];

    return {
      surveyStore,
      wasHomeOptions,
      coolingStrategiesUsedOptions,
      howEffectiveOptions,
    };
  },
});
</script>

<style scoped></style>
