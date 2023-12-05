<template>
  <q-dialog
    full-width
    full-height
    persistent
    v-model="surveyStore.isShowSurveyModal"
    @hide="onHide"
  >
    <BaseModalScroll>
      <template #header>
        <div class="row items-center">
          <div>Survey</div>
          <q-space />
          <q-btn icon="close" color="primary" v-close-popup>Close</q-btn>
        </div>
      </template>
      <template #main>
        <p class="fontsize-20">
          It appears you have had {{ surveyStore.alertsInLastTimePeriod }} heat
          alert/s recently. We'd appreciate if you could fill out this short
          survey (4 questions).
        </p>

        <!-- Survey Questions -->
        <div class="q-mt-lg text-bold fontsize-20">
          Were you home today when any of the Ethos heat alerts came through?
          <span>
            (survey sent on the: {{ surveyStore.surveyDisplayDateString }})
          </span>
        </div>
        <q-option-group
          :options="wasHomeOptions"
          type="radio"
          class="q-mb-xl fontsize-20"
          v-model="surveyStore.surveyAnswers.wasHome"
        />

        <!-- Only show other questions if they were home -->
        <template v-if="surveyStore.surveyAnswers.wasHome === true">
          <div class="q-mt-lg text-bold fontsize-20">
            What cooling strategies did you use (if any)?
          </div>
          <q-option-group
            :options="coolingStrategiesUsedOptions"
            type="checkbox"
            class="q-mb-xl fontsize-20"
            v-model="surveyStore.surveyAnswers.coolingStrategiesUsed"
          />

          <!-- Only ask how effective if they did cool themselves -->
          <template
            v-if="surveyStore.surveyAnswers.coolingStrategiesUsed.length > 0"
          >
            <div class="q-mt-lg text-bold fontsize-20">
              How effective do you feel the cooling strategies used were?
            </div>
            <q-option-group
              :options="howEffectiveOptions"
              type="radio"
              class="q-mb-xl fontsize-20"
              v-model="surveyStore.surveyAnswers.howEffective"
            />
          </template>
        </template>

        <q-btn
          label="finish"
          color="primary"
          size="xl"
          class="q-mt-xl full-width"
          v-close-popup
          :disabled="!isSurveyComplete"
        />
      </template>
    </BaseModalScroll>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import BaseModalScroll from './BaseModalScroll.vue';
import { useSurveyStore } from 'src/stores/survey';
import { coolingStrategies } from 'src/helpers/coolingStrategies';

export default defineComponent({
  name: 'ModalSurvey',
  components: { BaseModalScroll },
  setup() {
    const surveyStore = useSurveyStore();

    const onHide = () => {
      // Post data to store when survey closed
      surveyStore.postSurveyAnswers();
    };

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

    // Whether the survey is complete
    const isSurveyComplete = computed(() => {
      if (surveyStore.surveyAnswers.wasHome === undefined) {
        return false; // "Were you home today?" question not answered.
      } else if (surveyStore.surveyAnswers.wasHome === true) {
        if (
          surveyStore.surveyAnswers.coolingStrategiesUsed.length > 0 &&
          surveyStore.surveyAnswers.howEffective === undefined
        ) {
          return false; // User cooled themselves but didn't indicate how effective
        }
      }
      return true; // All questions answered.
    });

    return {
      surveyStore,
      onHide,
      wasHomeOptions,
      coolingStrategiesUsedOptions,
      howEffectiveOptions,
      isSurveyComplete,
    };
  },
});
</script>

<style lang="scss">
// This is needed to patch the existing .q-checkbox__label class properties to allow a larger fontsize
.fontsize-20 .q-checkbox__label {
  @extend .fontsize-20;
}
</style>
