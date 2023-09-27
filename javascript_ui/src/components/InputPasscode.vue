<template>
  <div class="justify-center items-center text-center" style="margin: 20px 10%">
    <b class="fontsize-14"
      >If you are a researcher, enter passcode to go to settings page, otherwise
      click the "GO BACK TO HOME " button</b
    >

    <div class="row">
      <q-input
        ref="passcodeInputRef"
        filled
        bottom-slots
        class="full-width"
        v-model="passcode"
        placeholder="passcode"
        type="password"
        counter
        maxlength="4"
        :error="isIncorrectPasscode"
        error-message="Incorrect passcode, try again"
      >
        <template v-slot:append>
          <q-btn
            round
            dense
            flat
            @click="backspacePasscode"
            icon="backspace"
            class="fontsize-18 q-mt-lg"
          />
        </template>
      </q-input>
    </div>

    <div
      class="row passcode-row"
      v-for="(row, index) in passcodeInputLayout"
      :key="index"
    >
      <div class="col q-pa-sm" v-for="key in row" :key="key">
        <q-btn
          v-if="key == 'delete'"
          class="full-width full-height fontsize-14"
          color="negative"
          :label="key"
          @click="backspacePasscode"
        ></q-btn>
        <q-btn
          v-else-if="key == 'submit'"
          class="full-width full-height fontsize-14"
          color="positive"
          :label="key"
          @click="checkPasscode"
        ></q-btn>
        <q-btn
          v-else
          class="full-width full-height fontsize-14"
          color="primary"
          @click="appendPasscode(key)"
          :label="key"
        ></q-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, nextTick } from 'vue';

export default defineComponent({
  name: 'InputPasscode',
  setup(props, { emit }) {
    const passcode = ref('');
    const passcodeInputRef: Ref<null | HTMLInputElement> = ref(null);

    const passcodeInputLayout = [
      ['1', '2', '3'],
      ['4', '5', '6'],
      ['7', '8', '9'],
      ['delete', '0', 'submit'],
    ];
    const isIncorrectPasscode = ref(false);

    const backspacePasscode = () => {
      // Remove last character of passcode
      passcode.value = passcode.value.slice(0, -1);

      // Set the focus back to the input
      nextTick(() => {
        if (passcodeInputRef.value) {
          passcodeInputRef.value.focus();
        }
      });
    };

    const appendPasscode = (char: string) => {
      // Append character to end of passcode
      passcode.value = passcode.value.concat(char);

      // Set the focus back to the input
      nextTick(() => {
        if (passcodeInputRef.value) {
          passcodeInputRef.value.focus();
        }
      });
    };

    const checkPasscode = () => {
      // Passcode is correct
      if (passcode.value == process.env.SETTINGS_PASSCODE) {
        isIncorrectPasscode.value = false;
        // Submit 'success' event to indicate passcode submitted successfully
        emit('success');
      }
      // Passcode is incorrect
      else {
        // Display error and clear passcode
        isIncorrectPasscode.value = true;
        passcode.value = '';
      }
    };

    return {
      passcode,
      passcodeInputRef,
      passcodeInputLayout,
      isIncorrectPasscode,
      backspacePasscode,
      appendPasscode,
      checkPasscode,
    };
  },
});
</script>

<style lang="scss" scoped>
.passcode-row {
  height: calc(#{$remaining-height} / 6);
}
</style>
