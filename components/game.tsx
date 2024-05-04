"use client";
import { useEffect, useRef, useState } from "react";

type PhaserType = typeof import("phaser");

class MainScene extends Phaser.Scene {
  player!: Phaser.Physics.Arcade.Sprite;

  constructor(phaser: PhaserType) {
    super({ key: "MainScene" });
    this.phaser = phaser; // store phaser ref
  }

  phaser: PhaserType; // add phaser property
  preload() {
    this.load.image("ship", "assets/ship.png");
  }

  create() {
    this.player = this.physics.add.sprite(400, 300, "ship");
    this.player.setCollideWorldBounds(true);
  }

  update() {
    // add play movement logic here
  }
}

const GameComponent = () => {
  const gameRef = useRef<HTMLDivElement>(null);
  const [phaser, setPhaser] = useState<PhaserType | null>(null);

  useEffect(() => {
    import("phaser").then((module) => {
      setPhaser(module);
    });
  }, []);

  useEffect(() => {
    if (phaser && gameRef.current) {
      const config: Phaser.Types.Core.GameConfig = {
        type: phaser.AUTO,
        width: 800,
        height: 600,
        physics: {
          default: "arcade",
          arcade: {
            gravity: { y: 200, x: 0 },
            debug: false,
          },
        },
        scene: [new MainScene(phaser)], // Pass Phaser to the scene
      };

      const game = new phaser.Game(config);
      return () => {
        game.destroy(true);
      };
    }
  }, [phaser]);

  return <div ref={gameRef} />;
};

export default GameComponent;
