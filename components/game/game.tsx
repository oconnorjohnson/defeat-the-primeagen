"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useAtom } from "jotai";
import { gamePausedAtom } from "@/state/atoms";

const GameComponent = dynamic(
  () =>
    import("phaser").then((Phaser) => {
      class MainScene extends Phaser.Scene {
        gameIsActive: boolean = true;
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
        availableLasers: number = 10;
        laserResetTimer!: Phaser.Time.TimerEvent;
        laserResetBar!: Phaser.GameObjects.Graphics;
        playerTrail!: Phaser.GameObjects.Group;
        laserResetDuration: number = 30000;
        timeUntilNextReset: number = 30000;
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

          // Initialize the player trail group
          this.playerTrail = this.add.group({
            max: 0.1, // Maximum number of trail sprites
            classType: Phaser.GameObjects.Image,
          });

          // Create initial trail sprites
          for (let i = 0; i < 1; i++) {
            const trailSprite = this.add.image(
              this.player.x,
              this.player.y,
              "player"
            );
            trailSprite.setScale(1 - i * 0.01); // Slightly decreasing size
            trailSprite.setAlpha(1 - i * 0.1); // Decreasing opacity
            this.playerTrail.add(trailSprite);
          }
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
              enemy.body!.setOffset(
                (enemy.width - (enemy.width - 10)) / 2,
                (enemy.height - (enemy.height - 10)) / 2
              );
            }
            return true;
          });
          this.availableLasers = 10;
          this.laserResetTimer = this.time.addEvent({
            delay: 30000,
            callback: this.resetLasers,
            callbackScope: this,
            loop: true,
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
          this.laserResetBar = this.add.graphics();
          this.drawLaserResetBar();
          this.laserResetTimer = this.time.addEvent({
            delay: this.laserResetDuration,
            callback: () => {
              this.resetLasers();
              this.timeUntilNextReset = this.laserResetDuration;
            },
            callbackScope: this,
            loop: true,
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

                this.enemiesKilledWithLaser += 1;
                this.updateEnemiesKilled();
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
        }
        updateAcceptanceRate() {
          if (this.totalFriendliesPassed > 0) {
            const acceptanceRate =
              (this.friendliesCollected / this.totalFriendliesPassed) * 100;

            const hitRateElement = document.getElementById("hit-rate");
            if (hitRateElement) {
              hitRateElement.innerText = `Hit Rate: ${acceptanceRate.toFixed(
                2
              )}%`;
            }
          } else {
            const hitRateElement = document.getElementById("hit-rate");
            if (hitRateElement) {
              hitRateElement.innerText = "Hit Rate: 0%";
            }
          }
        }
        updateEnemyCollisions() {
          const enemyCollisionsElement =
            document.getElementById("enemy-collisions");
          if (enemyCollisionsElement) {
            enemyCollisionsElement.innerText = `Enemy Collisions: ${this.enemiesHit}/3`;
          }
        }
        stopLaserResetTimer() {
          if (this.laserResetTimer) {
            this.laserResetTimer.remove();
            this.laserResetTimer = this.time.addEvent({
              delay: this.laserResetDuration,
              callback: this.resetLasers,
              callbackScope: this,
              loop: true,
            });
          }
          this.gameIsActive = false;
          this.timeUntilNextReset = this.laserResetDuration;
          this.drawLaserResetBar();
        }
        update(time: number, delta: number) {
          const velocityPerSecond = 500; // pixels per second
          const deltaInSeconds = delta / 1000; // convert delta to seconds

          if (this.cursors.left.isDown) {
            this.player.setVelocityX(-velocityPerSecond * deltaInSeconds);
          } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(velocityPerSecond * deltaInSeconds);
          } else {
            this.player.setVelocityX(0);
          }
          if (
            this.cursors.left.isDown ||
            this.input.keyboard!.checkDown(
              this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.H)
            )
          ) {
            this.player.setVelocityX(-1000); // Increased static velocity
          } else if (
            this.cursors.right.isDown ||
            this.input.keyboard!.checkDown(
              this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.L)
            )
          ) {
            this.player.setVelocityX(1000); // Increased static velocity
          } else {
            this.player.setVelocityX(0);
          }

          if (
            this.input.keyboard!.checkDown(
              this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.F)
            ) ||
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
              this.updateScore();

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
          let lastPosition = { x: this.player.x, y: this.player.y };
          this.playerTrail.getChildren().forEach((trail, index) => {
            const currentTrail = trail as Phaser.GameObjects.Image;
            const tempPosition = { x: currentTrail.x, y: currentTrail.y };
            currentTrail.setPosition(lastPosition.x, lastPosition.y);
            lastPosition = tempPosition;
            currentTrail.setAlpha(1 - index * 0.1); // Update alpha based on position in the trail
          });
        }
        setupColliders() {
          this.physics.add.overlap(
            this.player,
            this.friendlies,
            this.collectFriendly,
            undefined,
            this
          );
        }
        hitPlayer(
          player: Phaser.Physics.Arcade.Sprite,
          enemy: Phaser.Physics.Arcade.Sprite
        ) {
          this.score -= 1;

          if (enemy.body && enemy.active) {
            enemy.setActive(false).setVisible(false);
            enemy.body.enable = false;
          }
        }
        drawLaserResetBar() {
          const laserResetBar = document.getElementById("laser-reset-bar");
          if (laserResetBar) {
            const barWidth =
              (this.timeUntilNextReset / this.laserResetDuration) * 100;
            laserResetBar.style.width = `${barWidth}%`;
            laserResetBar.style.backgroundColor = "#00ff00";
          }
        }
        updateScore() {
          const scoreElement = document.getElementById("score");
          if (scoreElement) {
            scoreElement.innerText = `Score: ${this.score}`;
          }
        }

        updateHitRate() {
          const hitRateElement = document.getElementById("hit-rate");
          if (hitRateElement)
            hitRateElement.innerText = `Hit Rate: ${(
              (this.friendliesCollected / this.totalFriendliesPassed) *
              100
            ).toFixed(2)}%`;
        }

        updateEnemiesKilled() {
          const enemiesKilledElement =
            document.getElementById("enemies-killed");
          if (enemiesKilledElement)
            enemiesKilledElement.innerText = `Enemies Killed: ${this.enemiesKilledWithLaser}`;
        }
        setupLaserResetTimer() {
          if (this.laserResetTimer) {
            this.laserResetTimer.remove();
          }
          this.laserResetTimer = this.time.addEvent({
            delay: this.laserResetDuration,
            callback: () => {
              this.resetLasers();
              this.drawLaserResetBar();
            },
            callbackScope: this,
            loop: true,
          });
        }
        shootLaser() {
          if (this.availableLasers > 0) {
            let laser = this.lasers.getFirstDead(false);
            if (!laser) {
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
            if (laser) {
              laser.setPosition(this.player.x, this.player.y - 20);
              laser.setActive(true);
              laser.setVisible(true);
              laser.body.allowGravity = false;
              laser.setVelocityY(-800);
              this.availableLasers--;
            }
          } else {
            // console.log("No lasers available to fire.");
          }
        }
        resetLasers() {
          this.availableLasers = 10;
          this.timeUntilNextReset = this.laserResetDuration;
          this.setupLaserResetTimer();
          this.drawLaserResetBar();
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
            this.updateScore();

            this.friendliesCollected++;
            this.totalFriendliesPassed++;
            this.updateHitRate();
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
              this.updateEnemyCollisions();
              enemy.setActive(false).setVisible(false);
              this.time.delayedCall(1000, () => {
                enemy.setData("isHit", false);
                enemy.setActive(true).setVisible(true);
              });
              if (this.enemiesHit >= 3) {
                this.physics.pause();
                this.stopLaserResetTimer();
                player.setTint(0xff0000);
                this.add
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
                this.add
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
                    this.gameIsActive = true;
                    this.clearEnemyStates();
                    this.enemiesHit = 0;
                    this.updateEnemyCollisions();
                    this.score = 0;
                    this.updateScore();
                    this.enemiesKilledWithLaser = 0;
                    this.friendliesCollected = 0;
                    this.totalFriendliesPassed = 0;
                    this.updateHitRate();
                    this.updateAcceptanceRate();
                    this.timeUntilNextReset = this.laserResetDuration;
                    this.setupLaserResetTimer();
                    this.drawLaserResetBar();
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
            width: 1400,
            height: 750,
            parent: gameRef.current || undefined,
            physics: {
              default: "arcade",
              arcade: { gravity: { y: 200, x: 0 } },
            },
            scene: [MainScene],
            fps: {
              target: 60,
              forceSetTimeOut: false,
            },
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
              const width = window.innerWidth;
              const height = window.innerHeight;
              game.scale.resize(width, height);
            }
          };

          window.addEventListener("resize", resizeGame);
          return () => {
            window.removeEventListener("resize", resizeGame);
          };
        }, [game]);
        return (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div
              id="game-ui"
              className="text-xl bg-white text-black font-bold"
              style={{ width: "200px", padding: "10px" }}
            >
              <h1 id="score">Score: 0</h1>
              <h1 id="hit-rate">Hit Rate: 0%</h1>
              <h1 id="enemies-killed">Enemies Killed: 0</h1>
              <h1 id="enemy-collisions">Enemy Collisions: 0/3</h1>
              <div
                id="laser-reset-bar"
                style={{
                  width: "100%",
                  height: "20px",
                  backgroundColor: "#ddd",
                }}
              ></div>
            </div>
            <div
              ref={gameRef}
              style={{ width: "1400px", height: "750px" }}
            ></div>
          </div>
        );
      };
      return Game;
    }),
  { ssr: false }
);

export default GameComponent;
