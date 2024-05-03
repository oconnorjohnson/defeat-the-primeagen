"use client";
import { useEffect, useRef } from "react";
import Phaser from "phaser";

class MainScene extends Phaser.Scene {
  player!: Phaser.Physics.Arcade.Sprite;

  constructor() {
    super({ key: "MainScene" });
  }

  preload() {
    this.load.image("ship", "assets/ship.png");
  }

  create() {
    this.player = this.physics.add.sprite(400, 300, "ship");
    this.player.setCollideWorldBounds(true);
  }

  update() {
    // Player movement logic here
  }
}
const GameComponent = () => {
  const gameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gameRef.current) {
      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        physics: {
          default: "arcade",
          arcade: {
            gravity: { y: 0, x: 0 }, // No gravity in space
            debug: false,
          },
        },
        scene: [MainScene], // Use the extended scene with the player property
      };

      const game = new Phaser.Game(config);
      return () => {
        game.destroy(true);
      };
    }
  }, []);

  return <div ref={gameRef} />;
};

export default GameComponent;
