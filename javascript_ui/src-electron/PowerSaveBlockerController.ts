import { powerSaveBlocker } from 'electron';

export default class PowerSaveBlockerController {
  private powerSaveBlockerId: number | null = null;
  private intervalId: NodeJS.Timeout | null = null;

  start() {
    // Interval which checks every minute and updates the current sleep settings of device
    this.intervalId = setInterval(() => {
      const now = new Date();
      const hours = now.getHours();

      // Prevent device screen sleeping between 5am and 9pm
      if (hours >= 5 && hours <= 21) {
        if (this.powerSaveBlockerId === null) {
          this.powerSaveBlockerId = powerSaveBlocker.start(
            'prevent-display-sleep'
          );
        }
      } else {
        if (this.powerSaveBlockerId !== null) {
          powerSaveBlocker.stop(this.powerSaveBlockerId);
          this.powerSaveBlockerId = null;
        }
      }
    }, 60000);
  }

  stop() {
    // Clear the interval and stop power save blocker
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    if (this.powerSaveBlockerId !== null) {
      powerSaveBlocker.stop(this.powerSaveBlockerId);
    }
  }
}
