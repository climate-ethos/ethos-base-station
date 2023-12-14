<!-- The structure of the survey is given below -->
<!--
  1. (if ethos alert) Were you home on the day of the survey when any of the Ethos heat alerts came through? (Options: Yes/No)
  2. (if ethos alert) Were you aware of any alerts from the Ethos System? (Options: Yes/No)
  3. (if bom alert) Were you aware of any alerts from The Bureau of Meteorology for the date of the survey? (Options: Yes/No)
  4. (if bom alert and yes) How did you hear about The Bureau of Meteorology alert (select all that apply). (Newspaper, TV, Radio, Online news, BOM Website, BOM application, Social media, Word of mouth (e.g. friends or family), The Ethos Survey, Other)
  5. Were you home on the day of the survey to implement cooling strategies?
  6. (if home) What cooling strategies did you use (if any)? (Users can tick all that apply.)
  7. (if used cooling strategies) How effective do you feel the cooling strategies used were? (This will be based on a Likert scale.)
-->
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
          <q-btn
            icon="close"
            color="primary"
            v-close-popup
            :disable="disableCloseButton"
            >Close</q-btn
          >
        </div>
      </template>
      <template #main>
        <!-- HEADER TEXT -->
        <p class="fontsize-20">
          <!-- If Ethos heat alert survey -->
          <span v-if="surveyStore.alertsInLastTimePeriod > 0">
            It appears you have had
            {{ surveyStore.alertsInLastTimePeriod }} heat alert/s recently.
          </span>
          <!-- If BOM alert survey -->
          <span v-if="surveyStore.isShowBomQuestions">
            The Bureau of Meteorology (BOM) issued a Severe or Extreme heatwave
            alert for South East Queensland today.
          </span>
          We'd appreciate if you could fill out this short survey (survey sent
          on the: {{ surveyStore.surveyDisplayDateString }}).
        </p>

        <!-- SURVEY QUESTIONS -->
        <!-- Question 1 -->
        <template v-if="surveyStore.alertsInLastTimePeriod > 0">
          <div class="q-mt-lg text-bold fontsize-20">
            Were you home on the day of the survey when any of the Ethos heat
            alerts came through?
            <span>
              (survey sent on the: {{ surveyStore.surveyDisplayDateString }})
            </span>
          </div>
          <q-option-group
            :options="yesOrNoOptions"
            type="radio"
            class="q-mb-xl fontsize-20"
            v-model="surveyStore.surveyAnswers.wasHomeForEthosAlert"
          />
        </template>

        <!-- Question 2 -->
        <template
          v-if="
            surveyStore.alertsInLastTimePeriod > 0 &&
            surveyStore.surveyAnswers.wasHomeForEthosAlert
          "
        >
          <div class="q-mt-lg text-bold fontsize-20">
            Were you aware of any alerts from the Ethos System?
          </div>
          <q-option-group
            :options="yesOrNoOptions"
            type="radio"
            class="q-mb-xl fontsize-20"
            v-model="surveyStore.surveyAnswers.awareOfEthosAlert"
          />
        </template>

        <!-- Question 3 -->
        <template v-if="surveyStore.isShowBomQuestions">
          <div class="q-mt-lg text-bold fontsize-20">
            Were you aware of any heatwave alerts from The Bureau of Metrology
            (BOM) for the date of the survey?
            <span>
              (survey sent on the: {{ surveyStore.surveyDisplayDateString }})
            </span>
          </div>
          <q-option-group
            :options="yesOrNoOptions"
            type="radio"
            class="q-mb-xl fontsize-20"
            v-model="surveyStore.surveyAnswers.awareOfBomAlert"
          />
        </template>

        <!-- Question 4 -->
        <template
          v-if="
            surveyStore.isShowBomQuestions &&
            surveyStore.surveyAnswers.awareOfBomAlert
          "
        >
          <div class="q-mt-lg text-bold fontsize-20">
            How did you hear about the BOM heatwave alert? (select all that
            apply)
          </div>
          <q-option-group
            :options="howAwareOfBomAlertOptions"
            type="checkbox"
            class="q-mb-xl fontsize-20"
            v-model="surveyStore.surveyAnswers.howAwareOfBomAlert"
          />
          <input-keyboard
            v-if="
              surveyStore.surveyAnswers.howAwareOfBomAlert.includes('other')
            "
            v-model="surveyStore.surveyAnswers.howAwareOfBomAlertOther"
            :custom-rule="() => true"
            type="text"
            label="How did you hear of BOM warning? Click here to enter more info..."
          />
        </template>

        <!-- Question 5 -->
        <div class="q-mt-lg text-bold fontsize-20">
          Were you home on the day of the survey to implement cooling
          strategies?
          <span>
            (survey sent on the: {{ surveyStore.surveyDisplayDateString }})
          </span>
        </div>
        <q-option-group
          :options="yesOrNoOptions"
          type="radio"
          class="q-mb-xl fontsize-20"
          v-model="surveyStore.surveyAnswers.wasHomeForCooling"
        />

        <!-- Question 6 -->
        <template v-if="surveyStore.surveyAnswers.wasHomeForCooling">
          <div class="q-mt-lg text-bold fontsize-20">
            What cooling strategies did you use (if any)?
          </div>
          <q-option-group
            :options="coolingStrategiesUsedOptions"
            type="checkbox"
            class="q-mb-xl fontsize-20"
            v-model="surveyStore.surveyAnswers.coolingStrategiesUsed"
          />
          <input-keyboard
            v-if="
              surveyStore.surveyAnswers.coolingStrategiesUsed.includes('other')
            "
            v-model="surveyStore.surveyAnswers.coolingStrategiesUsedOther"
            :custom-rule="() => true"
            type="text"
            label="What other cooling strategies did you use? Click here to enter more info..."
          />
        </template>

        <!-- Question 7 -->
        <template
          v-if="
            surveyStore.surveyAnswers.wasHomeForCooling &&
            surveyStore.surveyAnswers.coolingStrategiesUsed.length > 0
          "
        >
          <div
            v-for="(strategy, index) in surveyStore.surveyAnswers
              .coolingStrategiesUsed"
            :key="index"
            class="q-mt-lg"
          >
            <div class="text-bold fontsize-20">
              How effective do you feel the
              {{ coolingStrategies[strategy].name }} strategy was?
            </div>
            <q-option-group
              :options="howEffectiveOptions"
              type="radio"
              class="q-mb-xl fontsize-20"
              v-model="
                surveyStore.surveyAnswers.effectivenessOfStrategies[strategy]
              "
            />
          </div>
        </template>

        <q-btn
          label="finish"
          color="primary"
          size="xl"
          class="q-mt-xl full-width"
          v-close-popup
        />
      </template>
    </BaseModalScroll>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, watch, ref } from 'vue';
import BaseModalScroll from './BaseModalScroll.vue';
import { useSurveyStore } from 'src/stores/survey';
import { coolingStrategies } from 'src/helpers/coolingStrategies';
import InputKeyboard from 'src/components/InputKeyboard.vue';
import { useKeyboardStore } from 'src/stores/keyboard';

export default defineComponent({
  name: 'ModalSurvey',
  components: { BaseModalScroll, InputKeyboard },
  setup() {
    const surveyStore = useSurveyStore();
    const keyboardStore = useKeyboardStore();

    const onHide = () => {
      // Post data to store when survey closed
      surveyStore.postSurveyAnswers();
    };

    const yesOrNoOptions = [
      { label: 'Yes', value: true },
      { label: 'No', value: false },
    ];

    const coolingStrategiesUsedOptions = Object.keys(coolingStrategies)
      .map((key) => ({ label: coolingStrategies[key].name, value: key }))
      .concat([{ label: 'Other', value: 'other' }]);

    const howAwareOfBomAlertOptions = [
      { label: 'Newspaper', value: 'newspaper' },
      { label: 'TV', value: 'tv' },
      { label: 'Radio', value: 'radio' },
      { label: 'Online news', value: 'online news' },
      { label: 'Social media', value: 'social media' },
      {
        label: 'Word of mouth (e.g. friends or family)',
        value: 'word of mouth',
      },
      { label: 'The ethos system', value: 4 },
      { label: 'Other', value: 'other' },
    ];

    const howEffectiveOptions = [
      { label: 'Not effective at all', value: 1 },
      { label: 'Slightly effective', value: 2 },
      { label: 'Moderately effective', value: 3 },
      { label: 'Very effective', value: 4 },
      { label: 'Extremely effective', value: 5 },
    ];

    // This logic handles disabling the close button for 0.6s after the keyboard is closed
    const disableCloseButton = ref(false);
    let timeoutId: number | null = null; // Reference for the timeout
    watch(
      () => keyboardStore.isKeyboardBound,
      (newValue) => {
        if (newValue) {
          disableCloseButton.value = true;
          if (timeoutId) {
            clearTimeout(timeoutId); // Clear the existing timeout
          }
        } else {
          // When keyboard is unbound, start a new timer
          timeoutId = setTimeout(() => {
            disableCloseButton.value = false;
          }, 600) as unknown as number;
        }
      }
    );

    return {
      surveyStore,
      disableCloseButton,
      onHide,
      yesOrNoOptions,
      coolingStrategies,
      coolingStrategiesUsedOptions,
      howAwareOfBomAlertOptions,
      howEffectiveOptions,
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
