import Phaser from "phaser";

export class InputManager {
  private scene: Phaser.Scene;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.cursors = this.scene.input.keyboard!.createCursorKeys();
  }

  updateInput() {
    // Check and process inputs
  }
}
