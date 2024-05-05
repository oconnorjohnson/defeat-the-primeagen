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
          this.load.image("player", "pu/player.png");
          this.load.image("enemy", "pu/bad.png");
          this.load.image("friendly", "pu/good.png");

          this.load.on("filecomplete", (key: string) => {
            console.log(`Asset loaded: ${key}`);
          });

          this.load.on("loaderror", (file: Phaser.Loader.File) => {
            console.error(`Error loading asset: ${file.key}`);
          });
        }

        create() {
          this.cameras.main.setBackgroundColor("#ffffff");

          const setupGame = () => {
            const playerStartX = this.scale.width / 2;
            const playerStartY = this.scale.height - 50;
            this.player = this.physics.add.sprite(
              playerStartX,
              playerStartY,
              "player"
            );
            this.player.setCollideWorldBounds(true);

            this.cursors = this.input.keyboard!.createCursorKeys();
            this.player.setImmovable(true);

            this.enemies = this.physics.add.group({
              key: "enemy",
              repeat: 0,
              setXY: { x: 50, y: 50, stepX: 70 },
            });

            this.friendlies = this.physics.add.group({
              key: "friendly",
              repeat: 5,
              setXY: { x: 100, y: 100, stepX: 70 },
            });

            this.setupColliders();
          };

          // Start game setup after all assets are loaded or if there's an error
          this.load.on("complete", setupGame);
          this.load.on("loaderror", setupGame);

          this.load.start();
        }

        update() {
          if (
            this.input.keyboard!.checkDown(
              this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.H)
            )
          ) {
            this.player.setVelocityX(-160);
          } else if (
            this.input.keyboard!.checkDown(
              this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.L)
            )
          ) {
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
          player:
            | Phaser.Types.Physics.Arcade.GameObjectWithBody
            | Phaser.Tilemaps.Tile,
          friendly:
            | Phaser.Types.Physics.Arcade.GameObjectWithBody
            | Phaser.Tilemaps.Tile
        ) {
          if (
            player instanceof Phaser.Physics.Arcade.Sprite &&
            friendly instanceof Phaser.Physics.Arcade.Sprite
          ) {
            // Now you can safely use body specific methods
            friendly.disableBody(true, true);
          }
        }

        hitEnemy(
          player:
            | Phaser.Types.Physics.Arcade.GameObjectWithBody
            | Phaser.Tilemaps.Tile,
          enemy:
            | Phaser.Types.Physics.Arcade.GameObjectWithBody
            | Phaser.Tilemaps.Tile
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
            parent: gameRef.current || undefined,
            physics: {
              default: "arcade",
              arcade: {
                gravity: { y: 200, x: 0 },
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
