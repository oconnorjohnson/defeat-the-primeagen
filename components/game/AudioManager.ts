import Phaser from "phaser";

export class AudioManager {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  playSound(soundKey: string) {
    // Play a sound effect
  }

  stopSound(soundKey: string) {
    // Stop a sound effect
  }
}
