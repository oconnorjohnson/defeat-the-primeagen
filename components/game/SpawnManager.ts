import Phaser from "phaser";

export class SpawnManager {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  spawnEnemy() {
    // Logic to spawn an enemy
  }

  spawnPowerUp() {
    // Logic to spawn a power-up
  }
}
