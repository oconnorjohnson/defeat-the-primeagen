"use client";
import { useEffect, useRef, useState } from "react";

type PhaserType = typeof import("phaser");

class MainScene extends Phaser.Scene {
  player!: Phaser.Physics.Arcade.Sprite;
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  enemies!: Phaser.Physics.Arcade.Group;
  friendlies!: Phaser.Physics.Arcade.Group;

  preload() {
    this.load.image("player", "assets/player.png");
    this.load.image("enemy", "assets/enemy.png");
    this.load.image("friendly", "assets/friendly.png");
  }

  create() {
    this.cameras.main.setBackgroundColor("#000000");

    // Create player
    this.player = this.physics.add.sprite(400, 550, "player");
    this.player.setCollideWorldBounds(true);

    // Create groups for enemies and friendlies
    this.enemies = this.physics.add.group({
      key: "enemy",
      repeat: 5,
      setXY: { x: 12, y: 10, stepX: 70 },
    });

    this.friendlies = this.physics.add.group({
      key: "friendly",
      repeat: 5,
      setXY: { x: 12, y: 10, stepX: 70 },
    });

    // Colliders and overlaps
    this.physics.add.overlap(
      this.player,
      this.friendlies,
      (player, friendly) => {
        if (
          player instanceof Phaser.Physics.Arcade.Sprite &&
          friendly instanceof Phaser.Physics.Arcade.Sprite
        ) {
          this.collectFriendly(player, friendly);
        }
      },
      undefined,
      this
    );
    this.physics.add.collider(
      this.player,
      this.enemies,
      (player, enemy) => {
        if (
          player instanceof Phaser.Physics.Arcade.Sprite &&
          enemy instanceof Phaser.Physics.Arcade.Sprite
        ) {
          this.hitEnemy(player, enemy);
        }
      },
      undefined,
      this
    );
  }

  collectFriendly(
    player: Phaser.Physics.Arcade.Sprite,
    friendly: Phaser.Physics.Arcade.Sprite
  ) {
    friendly.disableBody(true, true);
  }

  hitEnemy(
    player: Phaser.Physics.Arcade.Sprite,
    enemy: Phaser.Physics.Arcade.Sprite
  ) {
    this.physics.pause();
    player.setTint(0xff0000);
  }
}

const GameComponent = () => {
  const gameRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [Phaser, setPhaser] = useState<PhaserType | null>(null);

  useEffect(() => {
    import("phaser").then((module) => {
      setPhaser(module);
    });
  }, []);

  useEffect(() => {
    if (Phaser && gameRef.current) {
      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: dimensions.width,
        height: dimensions.height,
        physics: {
          default: "arcade",
          arcade: {
            gravity: { y: 200, x: 0 },
            debug: false,
          },
        },
        scene: [new Phaser.Scene()],
      };

      const game = new Phaser.Game(config);
      return () => {
        game.destroy(true);
      };
    }
  }, [Phaser, dimensions]);

  return <div ref={gameRef} />;
};

export default GameComponent;
