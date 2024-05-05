"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

type PhaserType = typeof import("phaser");

const GameComponent = dynamic(
  () =>
    import("phaser").then((Phaser) => {
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
          this.cameras.main.setBackgroundColor("#ffffff");

          // Set the player's initial position to the bottom center of the viewport
          const playerStartX = this.scale.width / 2;
          const playerStartY = this.scale.height - 50; // Adjust 50 or as needed to position player at the bottom
          this.player = this.physics.add.sprite(
            playerStartX,
            playerStartY,
            "player"
          );
          this.player.setCollideWorldBounds(true);

          // Allow player to move left and right only
          this.cursors = this.input.keyboard!.createCursorKeys();
          this.player.setImmovable(true); // Optional: Makes the player immovable when colliding with other objects

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
          this.setupColliders();
        }

        update() {
          if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
          } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
          } else {
            this.player.setVelocityX(0);
          }
        }

        setupColliders() {
          this.physics.add.overlap(
            this.player,
            this.friendlies,
            this.collectFriendly,
            undefined,
            this
          );
          this.physics.add.collider(
            this.player,
            this.enemies,
            this.hitEnemy,
            undefined,
            this
          );
        }

        collectFriendly(
          player: Phaser.GameObjects.GameObject,
          friendly: Phaser.GameObjects.GameObject
        ) {
          if (
            player instanceof Phaser.Physics.Arcade.Sprite &&
            friendly instanceof Phaser.Physics.Arcade.Sprite
          ) {
            friendly.disableBody(true, true);
          }
        }

        hitEnemy(
          player: Phaser.GameObjects.GameObject,
          enemy: Phaser.GameObjects.GameObject
        ) {
          if (
            player instanceof Phaser.Physics.Arcade.Sprite &&
            enemy instanceof Phaser.Physics.Arcade.Sprite
          ) {
            this.physics.pause();
            player.setTint(0xff0000);
          }
        }
      }

      const Game = () => {
        const gameRef = useRef<HTMLDivElement>(null);
        const [game, setGame] = useState<Phaser.Game | null>(null);
        useEffect(() => {
          const resizeGame = () => {
            if (gameRef.current && game) {
              const { width, height } = gameRef.current.getBoundingClientRect();
              game.scale.resize(width, height);
            }
          };

          const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: 800, // Default width, will be updated
            height: 600, // Default height, will be updated
            parent: gameRef.current,
            physics: {
              default: "arcade",
              arcade: {
                gravity: { y: 200 },
              },
            },
            scene: [MainScene],
          };

          const newGame = new Phaser.Game(config);
          setGame(newGame);

          // Add event listener to resize game when window resizes
          window.addEventListener("resize", resizeGame);

          // Initial resize to adjust game size
          resizeGame();

          return () => {
            newGame.destroy(true);
            window.removeEventListener("resize", resizeGame);
          };
        }, []);

        return <div ref={gameRef} style={{ width: "100%", height: "100%" }} />;
      };

      return Game;
    }),
  { ssr: false }
);

export default GameComponent;
