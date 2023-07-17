import { defineStore } from 'pinia';

export const useKeyboardStore = defineStore('keyboard', {
  state: () => ({
    // What input the keyboard is bound to (used to refocus input)
    keyboardBinding: undefined as undefined | HTMLInputElement,
    // The value the keyboard is bound to
    keyboardValue: undefined as undefined | { value: string },
    // Whether to use a text or numeric keyboard
    keyboardType: 'text' as 'text' | 'number',
    // Height of the keyboard in px
    keyboardHeight: undefined as undefined | number,
  }),

  getters: {
    isKeyboardBound(state) {
      return !!state.keyboardBinding;
    },
  },

  actions: {
    bindKeyboard(
      el: undefined | HTMLInputElement,
      value: { value: string },
      type: 'text' | 'number'
    ) {
      setTimeout(() => {
        console.log('Binding keyboard');
        this.keyboardBinding = el;
        this.keyboardValue = value;
        this.keyboardType = type;
      }, 50);
    },
    unbindKeyboard() {
      console.log('Unbinding keyboard');
      this.keyboardBinding = undefined;
      this.keyboardValue = undefined;
    },
  },
});
