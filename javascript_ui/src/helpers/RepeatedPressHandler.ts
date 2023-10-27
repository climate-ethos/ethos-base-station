// PressHandler.ts

/**
 * Class to handle multiple button presses within a short duration.
 * e.g. This is used for handling pressing Ethos logo 7 times to show settings
 */
class RepeatedPressHandler {
  private pressedCount: number;
  private readonly threshold: number;
  private timeout: NodeJS.Timeout | null;
  private readonly actionFn: () => void;

  /**
   * Create a new press handler.
   *
   * @param {number} threshold - Number of presses required to trigger the action.
   * @param {() => void} actionFn - Function to execute when threshold is reached.
   */
  constructor(threshold: number, actionFn: () => void) {
    this.pressedCount = 0;
    this.threshold = threshold;
    this.timeout = null;
    this.actionFn = actionFn;
  }

  /**
   * Handle a button press. This method should be called every time the associated button is pressed.
   */
  handlePress(): void {
    // Increment pressed count
    this.pressedCount++;

    // Check if the threshold has been met
    if (this.pressedCount >= this.threshold) {
      this.pressedCount = 0;
      this.actionFn();
      return;
    }

    // Clear the timeout (if it exists)
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    // Set another timeout that resets count when it expires
    this.timeout = setTimeout(() => {
      this.pressedCount = 0;
    }, 3000);
  }
}

export default RepeatedPressHandler;
