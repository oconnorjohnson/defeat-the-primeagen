import Phaser from "phaser";

export class EnemyManager {
  scene: Phaser.Scene;
  enemies: Phaser.Physics.Arcade.Group;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.enemies = this.scene.physics.add.group();
  }

  spawnEnemy() {
    // Logic to spawn an enemy
  }

  updateEnemies() {
    // Logic to update enemies during the game loop
  }
}
