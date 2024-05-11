import Phaser from "phaser";

export class StateManager {
  private scene: Phaser.Scene;
  private isPaused: boolean = false;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  togglePause() {
    this.isPaused = !this.isPaused;
    // Pause or resume the game
  }

  checkGameOver() {
    // Check if the game should end
  }
}
