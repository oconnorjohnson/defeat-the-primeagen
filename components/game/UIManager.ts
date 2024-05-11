import Phaser from "phaser";

export class UIManager {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  updateScore(score: number) {
    // Update score display logic
  }

  updateHealth(health: number) {
    // Update health bar logic
  }
}
