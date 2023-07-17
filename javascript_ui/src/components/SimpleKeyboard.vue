<template>
  <!-- Mousedown.prevent prevents loss of focus on original input element when clicked -->
  <div @mousedown.prevent class="simple-keyboard" ref="keyboardRef"></div>
</template>

<script lang="ts">
import Keyboard from 'simple-keyboard';
import 'simple-keyboard/build/css/index.css';
import { useKeyboardStore } from 'src/stores/keyboard';
import { Ref, ref, defineComponent, nextTick, onMounted, watch } from 'vue';

const textLayout = {
  default: [
    'q w e r t y u i o p',
    'a s d f g h j k l',
    '{shift} z x c v b n m {backspace}',
    '{numbers} {space} {enter}',
  ],
  shift: [
    'Q W E R T Y U I O P',
    'A S D F G H J K L',
    '{shift} Z X C V B N M {backspace}',
    '{numbers} {space} {enter}',
  ],
  numbers: ['1 2 3', '4 5 6', '7 8 9', '{abc} 0 {backspace}'],
  numbersFixed: ['1 2 3', '4 5 6', '7 8 9', '{enter} 0 {backspace}'],
};

export default defineComponent({
  name: 'SimpleKeyboard',
  setup() {
    const keyboardStore = useKeyboardStore();
    const keyboardRef: Ref<null | HTMLDivElement> = ref(null);
    let keyboard: null | Keyboard = null;

    onMounted(() => {
      // Initialize keyboard
      keyboard = new Keyboard('simple-keyboard', {
        onKeyPress: onKeyPress,
        layout: textLayout,
        display: {
          '{numbers}': '123',
          '{enter}': 'return',
          '{backspace}': '⌫',
          '{space}': ' ',
          '{shift}': '⇧',
          '{abc}': 'ABC',
        },
      });
      // Get height and set store
      if (keyboardRef.value) {
        const keyboardHeight = keyboardRef.value.offsetHeight;
        keyboardStore.keyboardHeight = keyboardHeight;
      }
    });

    // Watch for keyboard changing state between text and numerical input
    watch(keyboardStore, () => {
      if (keyboardStore.keyboardType === 'text') {
        keyboard?.setOptions({
          layoutName: 'default',
        });
      }
      if (keyboardStore.keyboardType === 'number') {
        keyboard?.setOptions({
          layoutName: 'numbersFixed',
        });
      }
    });

    // Dispatcher to handle key press from keyboard
    const onKeyPress = (button: string) => {
      // Sanity check
      if (!keyboardStore.keyboardBinding || !keyboardStore.keyboardValue) {
        console.error('Keyboard store contains undefined');
        return;
      }

      // Handle shift press
      if (button === '{shift}' || button === '{lock}') {
        toggleLayout('shift');
        return;
      }

      // Handle number mode
      if (button === '{numbers}' || button === '{abc}') {
        toggleLayout('numbers');
        return;
      }

      // Handle enter press
      if (button === '{enter}') {
        setTimeout(() => {
          // Blur instead of unbind to prevent continued focus
          keyboardStore.keyboardBinding?.blur();
        }, 100); // Timeout prevents click from focusing element below
        return;
      }

      // Get starting and ending cursor position
      const selectionStart = keyboardStore.keyboardBinding.selectionStart;
      const selectionEnd = keyboardStore.keyboardBinding.selectionEnd;

      if (selectionStart === null || selectionEnd === null) {
        console.error('No cursor position in input element');
        return;
      }

      // Is a normal character (e.g. 'a', 'f', ';', etc.)
      if (button.length === 1) {
        // Insert characters at position
        keyboardStore.keyboardValue.value = insertCharFromSelection(
          keyboardStore.keyboardValue.value,
          button,
          selectionStart,
          selectionEnd
        );
        // Restore cursor position
        restoreInputCursorToPosition(selectionStart + 1);
      }
      // Is space
      else if (button === '{space}') {
        // Insert characters at position
        keyboardStore.keyboardValue.value = insertCharFromSelection(
          keyboardStore.keyboardValue.value,
          ' ',
          selectionStart,
          selectionEnd
        );
        // Restore cursor position
        restoreInputCursorToPosition(selectionStart + 1);
      }
      // Is backspace
      else if (button === '{backspace}') {
        keyboardStore.keyboardValue.value = deleteCharFromSelection(
          keyboardStore.keyboardValue.value,
          selectionStart,
          selectionEnd
        );
        // Restore cursor position
        restoreInputCursorToPosition(selectionEnd - 1);
      }
    };

    /**
     * Toggle between keyboard layout types
     * @param type Whether to toggle between capitalised letters (shift) or numbers (numbers)
     */
    const toggleLayout = (type: 'shift' | 'numbers') => {
      let currentLayout = keyboard?.options.layoutName;
      let newLayout = 'default';
      // Determine new layout
      if (type === 'shift') {
        newLayout = currentLayout === 'default' ? 'shift' : 'default';
      } else if (type === 'numbers') {
        newLayout = currentLayout !== 'numbers' ? 'numbers' : 'default';
      }
      // Set
      keyboard?.setOptions({
        layoutName: newLayout,
      });
    };

    /**
     * Inserts char at cursor pos, replacing selection (if applicable)
     * @param str The original string
     * @param newChar The new character or string to insert
     * @param selectionStart A number that represents the starting position of the selection
     * @param selectionEnd A number that represents the ending position of the selection
     * @returns The mutated string
     */
    const insertCharFromSelection = (
      str: string,
      newChar: string,
      selectionStart: number,
      selectionEnd: number
    ) => {
      return str.slice(0, selectionStart) + newChar + str.slice(selectionEnd);
    };

    /**
     * If no chars are selected, delete the char before the cursor, otherwise replace the selection with ''
     * @param str The original string
     * @param selectionStart A number that represents the starting position of the selection
     * @param selectionEnd A number that represents the ending position of the selection
     * @returns The mutated string
     */
    const deleteCharFromSelection = (
      str: string,
      selectionStart: number,
      selectionEnd: number
    ) => {
      if (selectionStart === selectionEnd) {
        // Delete a single character
        return str.slice(0, selectionStart - 1) + str.slice(selectionEnd);
      }

      // Replace the selection with ''
      return str.slice(0, selectionStart) + str.slice(selectionEnd);
    };

    // Restore the input cursor position to the specified position
    const restoreInputCursorToPosition = (newStartPos: number) => {
      nextTick(() => {
        keyboardStore.keyboardBinding?.setSelectionRange(
          newStartPos,
          newStartPos
        );
      });
    };

    return { keyboard, keyboardRef };
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.hg-button {
  // Height of keyboard / 4 (for 4 rows) + padding room
  height: calc(#{$keyboard-height} * 0.24) !important;
  font-size: 24px;
}

.simple-keyboard {
  height: $keyboard-height;
  margin: 0 auto;
}

.simple-keyboard .hg-button-space {
  min-width: 150px;
  max-width: none;
}

.simple-keyboard.hg-theme-default .hg-button[data-skbtnuid^='numbers-'] {
  width: 33%;
  max-width: none;
}

.simple-keyboard.hg-theme-default .hg-button[data-skbtnuid^='numbersFixed-'] {
  width: 33%;
  max-width: none;
}

.simple-keyboard .hg-button-numbers {
  max-width: 100px;
}

.simple-keyboard .hg-button-enter {
  max-width: 100px;
}
</style>
