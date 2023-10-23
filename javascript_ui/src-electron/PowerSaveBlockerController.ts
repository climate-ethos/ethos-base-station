import { powerSaveBlocker } from 'electron';

export default class PowerSaveBlockerController {
  private powerSaveBlockerId: number | null = null;

  start() {
    if (this.powerSaveBlockerId === null) {
      this.powerSaveBlockerId = powerSaveBlocker.start('prevent-display-sleep');
    }
  }

  stop() {
    if (this.powerSaveBlockerId !== null) {
      powerSaveBlocker.stop(this.powerSaveBlockerId);
      this.powerSaveBlockerId = null;
    }
  }
}
