"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useAtom } from "jotai";
import { gamePausedAtom } from "@/state/atoms";

const GameComponent = dynamic(
  () =>
    import("phaser").then((Phaser) => {
      class MainScene extends Phaser.Scene {
        score: number;
        scoreText!: Phaser.GameObjects.Text;
        constructor() {
          super({ key: "MainScene" });
          this.score = 0;
        }
        player!: Phaser.Physics.Arcade.Sprite;
        cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
        enemies!: Phaser.Physics.Arcade.Group;
        friendlies!: Phaser.Physics.Arcade.Group;
        preload() {
          this.load.image("player", "/player.png");
          this.load.image("enemy", "/bad.png");
          this.load.image("friendly", "/good.png");
          this.load.on("filecomplete", (key: string) => {
            console.log(`Asset loaded: ${key}`);
          });
          this.load.on("loaderror", (file: Phaser.Loader.File) => {
            console.error(`Error loading asset: ${file.key}`);
          });
        }
        create() {
          this.cameras.main.setBackgroundColor("#ffffff");
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
            repeat: 0,
            setXY: { x: 100, y: 100, stepX: 70 },
          });
          this.setupColliders();
          this.time.addEvent({
            delay: 1000,
            callback: this.spawnEnemy,
            callbackScope: this,
            loop: true,
          });
          this.time.addEvent({
            delay: 1500, // Time in milliseconds between each spawn
            callback: this.spawnFriendly,
            callbackScope: this,
            loop: true,
          });
          this.scoreText = this.add.text(16, 16, "Score: 0", {
            fontSize: "32px",
            color: "000000",
          });
        }
        update() {
          if (
            this.input.keyboard!.checkDown(
              this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.H)
            )
          ) {
            this.player.setVelocityX(-500);
          } else if (
            this.input.keyboard!.checkDown(
              this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.L)
            )
          ) {
            this.player.setVelocityX(500);
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
        spawnEnemy() {
          const xPosition = Phaser.Math.Between(0, this.scale.width);
          const newEnemy = this.enemies.create(xPosition, 0, "enemy");
          newEnemy.setVelocity(0, 200);
        }
        spawnFriendly() {
          const xPosition = Phaser.Math.Between(0, this.scale.width); // Random X position across the width
          const yPosition = Phaser.Math.Between(0, this.scale.height); // Random Y position across the height
          const newFriendly = this.friendlies.create(
            xPosition,
            yPosition,
            "friendly"
          );
          newFriendly.setVelocity(0, 200); // Optional: Set velocity if needed
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
            friendly.disableBody(true, true);
            this.score += 1;
            this.scoreText.setText(`Score: ${this.score}`);
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
        const [isGamePaused, setIsGamePaused] = useAtom(gamePausedAtom);
        useEffect(() => {
          if (game) return;
          const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            parent: gameRef.current || undefined,
            physics: {
              default: "arcade",
              arcade: { gravity: { y: 200, x: 0 } },
            },
            scene: [MainScene],
          };
          const newGame = new Phaser.Game(config);
          setGame(newGame);
          return () => {
            newGame.destroy(true);
          };
        }, []);
        useEffect(() => {
          const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === " ") {
              setIsGamePaused((prev) => !prev);
            }
          };
          window.addEventListener("keydown", handleKeyDown);
          return () => {
            window.removeEventListener("keydown", handleKeyDown);
          };
        }, []);
        useEffect(() => {
          if (!game) return;
          const scene = game.scene.getScene("MainScene");
          if (scene) {
            if (isGamePaused) {
              game.scene.pause("MainScene");
            } else {
              game.scene.resume("MainScene");
            }
          } else {
          }
        }, [isGamePaused, game]);
        useEffect(() => {
          const resizeGame = () => {
            if (gameRef.current && game) {
              const { width, height } = gameRef.current.getBoundingClientRect();
              game.scale.resize(width, height);
            }
          };
          window.addEventListener("resize", resizeGame);
          return () => {
            window.removeEventListener("resize", resizeGame);
          };
        }, [game]);
        return <div ref={gameRef} style={{ width: "100%", height: "100%" }} />;
      };
      return Game;
    }),
  { ssr: false }
);

export default GameComponent;
