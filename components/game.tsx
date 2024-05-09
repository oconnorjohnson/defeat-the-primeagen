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
        enemiesKilledWithLaser: number = 0;
        enemiesKilledText!: Phaser.GameObjects.Text;
        constructor() {
          super({ key: "MainScene" });
          this.score = 0;
          this.hitEnemy = this.hitEnemy;
        }
        player!: Phaser.Physics.Arcade.Sprite;
        cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
        enemies!: Phaser.Physics.Arcade.Group;
        friendlies!: Phaser.Physics.Arcade.Group;
        enemySpawnEvent!: Phaser.Time.TimerEvent;
        friendlySpawnEvent!: Phaser.Time.TimerEvent;
        totalFriendliesPassed: number = 0;
        friendliesCollected: number = 0;
        enemiesHit: number = 0;
        acceptanceRateText!: Phaser.GameObjects.Text;
        enemiesHitText!: Phaser.GameObjects.Text;
        lasers!: Phaser.Physics.Arcade.Group;
        preload() {
          this.load.image("player", "/player.png");
          this.load.image("enemy", "/bad.png");
          this.load.image("friendly", "/good.png");
          this.load.image("laser", "/laser.png");
        }
        create() {
          this.cameras.main.setBackgroundColor("#b0c4de");
          const playerStartX = this.scale.width / 2;
          const playerStartY = this.scale.height - 50;
          this.player = this.physics.add.sprite(
            playerStartX,
            playerStartY,
            "player"
          );
          this.player.setCollideWorldBounds(true);
          this.physics.world.setBounds(
            0,
            0,
            this.scale.width,
            this.scale.height,
            false,
            false,
            true,
            true
          );
          this.enemies = this.physics.add.group({
            key: "enemy",
            repeat: 0,
            setXY: { x: 50, y: 50, stepX: 70 },
          });
          this.lasers = this.physics.add.group({
            classType: Phaser.Physics.Arcade.Image,
            maxSize: -1,
            runChildUpdate: true,
          });
          this.enemies.children.iterate((enemy) => {
            if (enemy instanceof Phaser.Physics.Arcade.Sprite) {
              // Assuming you've already set the size as above
              enemy.body!.setOffset(
                (enemy.width - (enemy.width - 10)) / 2,
                (enemy.height - (enemy.height - 10)) / 2
              );
            }
            return true;
          });
          this.lasers.children.iterate((laser) => {
            if (
              laser instanceof Phaser.Physics.Arcade.Image &&
              laser.body instanceof Phaser.Physics.Arcade.Body
            ) {
              laser.body.allowGravity = false;
            }
            return true;
          });

          this.physics.add.collider(
            this.player,
            this.enemies,
            (player, enemy) => {
              if (enemy instanceof Phaser.Physics.Arcade.Sprite) {
                enemy.setActive(false).setVisible(false);
                enemy.body!.stop();
                enemy.body!.enable = false;
                this.enemiesHit += 1;
                this.enemies.remove(enemy, true, true);
                this.hitEnemy(player, enemy);
              }
            }
          );

          this.physics.add.collider(
            this.lasers,
            this.enemies,
            (laser, enemy) => {
              if (
                laser instanceof Phaser.Physics.Arcade.Image &&
                enemy instanceof Phaser.Physics.Arcade.Sprite
              ) {
                laser.setActive(false).setVisible(false);
                enemy.setActive(false).setVisible(false);
                laser.setActive(false).setVisible(false);
                enemy.setActive(false).setVisible(false);
                enemy.body!.enable = false;
                this.score += 1;
                this.scoreText.setText(`Score: ${this.score}`);
                this.enemiesKilledWithLaser += 1;
                this.enemiesKilledText.setText(
                  `Enemies killed: ${this.enemiesKilledWithLaser}`
                );
              }
            }
          );
          this.cursors = this.input.keyboard!.createCursorKeys();
          this.player.setImmovable(true);

          this.friendlies = this.physics.add.group({
            key: "friendly",
            repeat: 0,
            setXY: { x: 100, y: 100, stepX: 70 },
          });
          this.setupColliders();
          this.enemySpawnEvent = this.time.addEvent({
            delay: 1000,
            callback: this.spawnEnemy,
            callbackScope: this,
            loop: true,
          });
          this.friendlySpawnEvent = this.time.addEvent({
            delay: 1500,
            callback: this.spawnFriendly,
            callbackScope: this,
            loop: true,
          });
          this.scoreText = this.add.text(16, 16, "Score: 0", {
            fontSize: "32px",
            color: "000000",
          });
          this.enemiesKilledText = this.add.text(16, 112, "Enemies killed: 0", {
            fontSize: "32px",
            color: "#ff0000",
          });
          this.acceptanceRateText = this.add.text(16, 50, "Hit Rate: 0%", {
            fontSize: "32px",
            color: "#000000",
          });
          this.enemiesHitText = this.add.text(16, 80, "Enemy Collisions: 0/3", {
            fontSize: "32px",
            color: "#ff0000",
          });
        }
        updateAcceptanceRate() {
          if (this.totalFriendliesPassed > 0) {
            const acceptanceRate =
              (this.friendliesCollected / this.totalFriendliesPassed) * 100;
            this.acceptanceRateText.setText(
              `Hit Rate: ${acceptanceRate.toFixed(2)}%`
            );
          }
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

          if (
            this.input.keyboard!.checkDown(
              this.input.keyboard!.addKey(
                Phaser.Input.Keyboard.KeyCodes.BACKSPACE
              )
            )
          ) {
            this.shootLaser();
          }

          this.friendlies.children.each((friendly: any) => {
            if (friendly.y > this.scale.height && friendly.active) {
              friendly.setActive(false).setVisible(false);
              this.score -= 1;
              this.scoreText.setText(`Score: ${this.score}`);
              this.totalFriendliesPassed++;
              this.updateAcceptanceRate();
            }
            return true;
          });
          this.lasers.children.each((laser) => {
            if (laser instanceof Phaser.Physics.Arcade.Image) {
              if (laser.y < 0) {
                laser.setActive(false).setVisible(false);
              }
            }
            return true;
          });
          if (this.player.x < 0) {
            this.player.setX(this.scale.width);
          } else if (this.player.x > this.scale.width) {
            this.player.setX(0);
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
          // this.physics.add.collider(
          //   this.player,
          //   this.enemies,
          //   (object1, object2) => {
          //     const player =
          //       object1 instanceof Phaser.Physics.Arcade.Sprite
          //         ? object1
          //         : object2;
          //     const enemy =
          //       object1 instanceof Phaser.Physics.Arcade.Sprite
          //         ? object2
          //         : object1;

          //     if (
          //       enemy instanceof Phaser.Physics.Arcade.Sprite &&
          //       enemy.active
          //     ) {
          //       if (enemy.body) {
          //         enemy.setActive(false).setVisible(false);
          //         enemy.body.enable = false;
          //       }
          //     }
          //   }
          // );
        }
        hitPlayer(
          player: Phaser.Physics.Arcade.Sprite,
          enemy: Phaser.Physics.Arcade.Sprite
        ) {
          this.score -= 1;
          this.scoreText.setText(`Score: ${this.score}`);
          if (enemy.body && enemy.active) {
            enemy.setActive(false).setVisible(false);
            enemy.body.enable = false;
          }
        }
        shootLaser() {
          let laser = this.lasers.getFirstDead(false);

          if (laser) {
            laser.setPosition(this.player.x, this.player.y - 20);
            laser.setActive(true);
            laser.setVisible(true);
            laser.body.allowGravity = false;
            laser.setVelocityY(-800);
          } else {
            laser = this.lasers.create(
              this.player.x,
              this.player.y - 20,
              "laser"
            );
            if (laser) {
              laser.body.allowGravity = false;
              laser.setVelocityY(-800);
            }
          }
        }
        laserHitEnemy(
          object1:
            | Phaser.Types.Physics.Arcade.GameObjectWithBody
            | Phaser.Tilemaps.Tile,
          object2:
            | Phaser.Types.Physics.Arcade.GameObjectWithBody
            | Phaser.Tilemaps.Tile
        ) {
          const laser =
            object1 instanceof Phaser.Physics.Arcade.Image
              ? object1
              : object2 instanceof Phaser.Physics.Arcade.Image
              ? object2
              : null;
          const enemy =
            object1 instanceof Phaser.Physics.Arcade.Sprite
              ? object1
              : object2 instanceof Phaser.Physics.Arcade.Sprite
              ? object2
              : null;

          if (laser && enemy) {
            laser.setActive(false).setVisible(false);
            enemy.setActive(false).setVisible(false);
            enemy.body!.enable = false;
          }
        }
        spawnEnemy() {
          let enemy = this.enemies.getFirstDead(false);
          if (!enemy) {
            // Create a new enemy if no inactive ones are available
            enemy = this.enemies.create(
              Phaser.Math.Between(0, this.scale.width),
              -50,
              "enemy"
            );
          } else {
            // Properly reinitialize the enemy
            enemy.setPosition(Phaser.Math.Between(0, this.scale.width), -50);
            enemy.setActive(true).setVisible(true);
            enemy.body.enable = true;
          }
          enemy.setVelocity(0, 50);
        }

        spawnFriendly() {
          const xPosition = Phaser.Math.Between(0, this.scale.width);
          const newFriendly = this.friendlies.create(
            xPosition,
            -50,
            "friendly"
          );
          newFriendly.setVelocity(0, 200);
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
            this.friendliesCollected++;
            this.totalFriendliesPassed++;
            this.updateAcceptanceRate();
          }
        }
        clearEnemyStates() {
          this.enemies.children.iterate(
            (enemy: Phaser.GameObjects.GameObject) => {
              if (enemy instanceof Phaser.Physics.Arcade.Sprite) {
                enemy.setData("isHit", false);
                enemy.setData("inDebounce", false);
                enemy.setActive(true).setVisible(true);
                // adjust hit box on enemies to subtract 10 pixels from the width and height
                enemy.body!.setSize(enemy.width - 10, enemy.height - 10, true);
              }
              return true;
            }
          );
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
            if (!enemy.getData("isHit")) {
              enemy.setData("isHit", true);
              enemy.setData("inDebounce", true);

              console.log(`Enemy Hit: ${this.enemiesHit}`); // Debugging output
              this.enemiesHitText.setText(`Hits: ${this.enemiesHit}/3`);

              enemy.setActive(false).setVisible(false);

              this.time.delayedCall(1000, () => {
                enemy.setData("isHit", false);
                enemy.setActive(true).setVisible(true);
              });

              // Check if the game should end after updating enemiesHit
              if (this.enemiesHit >= 3) {
                console.log("Game Over should trigger now."); // Debugging output
                this.physics.pause();
                player.setTint(0xff0000);
                const gameOverText = this.add
                  .text(
                    this.scale.width / 2,
                    this.scale.height / 2,
                    "Game Over",
                    {
                      fontSize: "40px",
                      color: "#000000",
                    }
                  )
                  .setOrigin(0.5);

                const restartButton = this.add
                  .text(
                    this.scale.width / 2,
                    this.scale.height / 2 + 50,
                    "Restart Game",
                    {
                      fontSize: "32px",
                      color: "#00ff00",
                      backgroundColor: "#000000",
                      padding: { left: 10, right: 10, top: 5, bottom: 5 },
                    }
                  )
                  .setOrigin(0.5)
                  .setInteractive()
                  .on("pointerdown", () => {
                    this.clearEnemyStates();
                    this.enemiesHit = 0;
                    this.scene.restart();
                  });
              }
            }
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
