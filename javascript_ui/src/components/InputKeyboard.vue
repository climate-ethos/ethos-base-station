<template>
  <!-- Type="text" has to be used so cursor position can be obtained -->
  <!-- Passing emitModelValue to the directive allows the text value to be lazily updated on blur() -->
  <q-input
    v-scroll-to-input
    v-bind-on-screen-keyboard="{ reactiveValue, type, emitModelValue }"
    :model-value="reactiveValue.value"
    :label="label"
    :hint="hint"
    :error="error"
    :error-message="errorMessage"
    type="text"
    class="q-mb-sm"
    outlined
  />
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, ref } from 'vue';
import { scrollToInput } from 'src/directives/scrollToInput';
import { bindOnScreenKeyboard } from 'src/directives/bindOnScreenKeyboard';

export default defineComponent({
  name: 'InputKeyboard',
  directives: { scrollToInput, bindOnScreenKeyboard },
  props: {
    /**
     * Model value of component
     */
    modelValue: {
      type: [String, Number],
    },
    /**
     * The main label text
     */
    label: String,
    /**
     * A hint to accompany the input
     */
    hint: String,
    /**
     * A function that will check whether the input to the component
     * is valid
     * @returns true if input is valid, otherwise a string with an error message
     */
    customRule: {
      type: Function,
      required: true,
    },
    /**
     * Whether the input to the component is a number or text
     */
    type: {
      type: String as PropType<'number' | 'text'>,
      default: 'text',
    },
  },
  setup(props, { emit }) {
    const error = ref(false);
    const errorMessage = ref('');

    const toString = (val: string | number | undefined) => {
      if (val && typeof val === 'number') {
        // Is a number
        return val.toString();
      } else if (val && typeof val === 'string') {
        // Is a string
        return val;
      } else {
        // Is undefined
        return '';
      }
    };

    // This is defined as a reactive object to enable passing by reference
    const reactiveValue = reactive({
      value: toString(props.modelValue) as string,
    });

    /**
     * Function which will check if the data type is valid and then
     * emit 'update:modelValue' to indicate that the data has changed
     */
    const emitModelValue = () => {
      let emitValue;
      // Cast value to correct type
      if (props.type === 'number') {
        // Convert to number
        emitValue = parseInt(reactiveValue.value, 10);
      } else {
        // Already a string
        emitValue = reactiveValue.value;
      }
      // Check if valid
      const validCheck: true | string = props.customRule(emitValue);
      if (validCheck === true) {
        // Is valid, clear error
        error.value = false;
        errorMessage.value = '';
        // Emit new value to parent
        emit('update:modelValue', emitValue);
      } else if (typeof validCheck === 'string') {
        // Not valid, throw error
        error.value = true;
        errorMessage.value = validCheck;
      } else {
        // Something went wrong
        console.error('validCheck is not a valid type:', typeof validCheck);
      }
    };

    return {
      error,
      errorMessage,
      reactiveValue,
      emitModelValue,
    };
  },
});
</script>
