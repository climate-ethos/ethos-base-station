import { Directive } from 'vue';
import { useKeyboardStore } from 'src/stores/keyboard';

export const bindOnScreenKeyboard: Directive = {
  mounted(el, binding) {
    // Get the native input element
    const inputEl = el.querySelector('input') as HTMLInputElement;

    const handleFocus = () => {
      useKeyboardStore().bindKeyboard(
        inputEl,
        binding.value.reactiveValue,
        binding.value.type
      );
    };
    const handleBlur = () => {
      useKeyboardStore().unbindKeyboard();
      // Emit data to parent when blurred
      if (binding.value.emitModelValue) {
        binding.value.emitModelValue();
      }
    };
    inputEl.addEventListener('focus', handleFocus);
    inputEl.addEventListener('blur', handleBlur);
  },
  beforeUnmount(el) {
    const inputEl = el.querySelector('input');
    inputEl.removeEventListener('focus', inputEl.handleFocus);
    inputEl.removeEventListener('blur', inputEl.handleBlur);
  },
};
