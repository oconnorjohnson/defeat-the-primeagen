"use client";
import { getUserStats, updateGameStats, /*getUserSession */ } from "@/lib/actions";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useAtom } from "jotai";
import { gamePausedAtom, gameStartedAtom } from "@/state/atoms";


// game component is a wrapper around phaser game, which dynamically loads the phaser library to interop with next ssr and client side rendering
// MainScene defines the game logic and state
// Create is a function that creates a new instance of the MainScene class
// Update is a function called on every frame of phaser's game loop
const GameComponent = dynamic(
  () =>
    import("phaser").then((Phaser) => {
      class MainScene extends Phaser.Scene {
        // mainscene class constructor
        constructor() {
          super({ key: "MainScene" });
          this.score = 0;
          this.hitEnemy = this.hitEnemy;
        }
        // game state variables
        gameIsActive: boolean = true;
        score: number;
        scoreText!: Phaser.GameObjects.Text;
        enemiesKilledWithLaser: number = 0;
        enemiesKilledText!: Phaser.GameObjects.Text;
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
        gameDurationTimer!: Phaser.Time.TimerEvent;
        gameStartTime!: number;
        gameEndTime!: number;
        lastLaserShotTime: number = 0;
        laserCooldown: number = 250; // ms
        // preload game assets
        preload() {
          this.load.image("player", "/player.png");
          this.load.image("enemy", "/bad.png");
          this.load.image("friendly", "/good.png");
          this.load.image("laser", "/laser.png");
        }
        //  initialize game elements
        initializeGameElements() {
          this.setupLaserResetTimer();
          this.drawLaserResetBar();
        }
        // create class method that runs on game start
        create() {
          this.initializeGameElements();
          this.cameras.main.setBackgroundColor("#b0c4de");
          this.gameStartTime = Date.now();
          this.gameDurationTimer = this.time.addEvent({
            delay: 1000,
            callback: () => {
              const currentTime = Date.now();
              const elapsedTime = currentTime - this.gameStartTime;
              this.updateTotalGameTime(elapsedTime);
            },
            callbackScope: this,
            loop: true,
          });
          const playerStartX = this.scale.width / 2;
          const playerStartY = this.scale.height - 50;
          this.player = this.physics.add.sprite(
            playerStartX,
            playerStartY,
            "player"
          );
          this.player.setCollideWorldBounds(true);
          // create a group for player trails
          this.playerTrail = this.add.group({
            max: 0.1,
            classType: Phaser.GameObjects.Image,
          });
          // iterate overal over the player adding a trail (simulate motion blur)
          for (let i = 0; i < 1; i++) {
            const trailSprite = this.add.image(
              this.player.x,
              this.player.y,
              "player"
            );
            trailSprite.setScale(1 - i * 0.01);
            trailSprite.setAlpha(1 - i * 0.1);
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
          // iterate over spawned enemies, adjust offset which gives us a smaller hitbox than enemy's visual size and centers said hitbox
          this.enemies.children.iterate((enemy) => {
            if (enemy instanceof Phaser.Physics.Arcade.Sprite) {
              enemy.body!.setOffset(
                (enemy.width - (enemy.width - 10)) / 2,
                (enemy.height - (enemy.height - 10)) / 2
              );
            }
            return true;
          });
          // give the kid 10 lasers to start
          this.availableLasers = 10;
          // and give him more every 30 seconds
          this.laserResetTimer = this.time.addEvent({
            delay: 30000,
            callback: this.resetLasers,
            callbackScope: this,
            loop: true,
          });
          // if we got a laser group, we better block gravity on that shit
          this.lasers.children.iterate((laser) => {
            if (
              laser instanceof Phaser.Physics.Arcade.Image &&
              laser.body instanceof Phaser.Physics.Arcade.Body
            ) {
              laser.body.allowGravity = false;
            }
            return true;
          });
          // give the kid a laser reset bar
          this.laserResetBar = this.add.graphics();
          // can't forget to draw that bih to the scene
          this.drawLaserResetBar();
          // now create the 30 second timer as a delay after which we resest da boys lasers AND reset the timer
          this.laserResetTimer = this.time.addEvent({
            delay: this.laserResetDuration,
            callback: () => {
              this.resetLasers();
              this.timeUntilNextReset = this.laserResetDuration;
            },
            callbackScope: this,
            loop: true,
          });
          // create a physics collider for the kid and prime's spawn
          // if the player collides with bad reqs, we set the enemy's body to invisible, stop its motion, disable its physics, add one to "enemiesHit", remove the enemy from the scene, and update the score
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
          // create a physics collider for the lasers and the enemies
          // if the laser collids with an enemy, we set the laser to invisible, stop its motion, disable its physics, and update the score
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

        updateTotalGameTime(elapsedTime: number) {
          const totalGameTimeElement =
            document.getElementById("total-game-time");
          if (totalGameTimeElement) {
            const elapsedTimeInSeconds = Math.round(elapsedTime / 1000);
            totalGameTimeElement.innerText = `Total Game Time: ${elapsedTimeInSeconds} seconds`;
          }
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
        }

        update(time: number, delta: number) {
          const velocityPerSecond = 500;
          const deltaInSeconds = delta / 1000;
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
            this.player.setVelocityX(-1000);
          } else if (
            this.cursors.right.isDown ||
            this.input.keyboard!.checkDown(
              this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.L)
            )
          ) {
            this.player.setVelocityX(1000);
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
          this.drawLaserResetBar();
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
          this.drawLaserResetBar();
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
            currentTrail.setAlpha(1 - index * 0.1);
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
          if (!this.gameIsActive) {
            const laserResetBar = document.getElementById("laser-reset-bar");
            if (laserResetBar) {
              laserResetBar.style.width = "100%";
            }
            return;
          }
          const currentTime = Date.now();
          const timePassed = currentTime - this.lastLaserShotTime;
          const timeLeft = this.laserResetDuration - timePassed;
          const percentageLeft = (timeLeft / this.laserResetDuration) * 100;
          const laserResetBar = document.getElementById("laser-reset-bar");
          if (laserResetBar) {
            laserResetBar.style.width = `${percentageLeft}%`;
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
          this.lastLaserShotTime = Date.now();
          this.timeUntilNextReset = this.laserResetDuration;
        }

        shootLaser() {
          const currentTime = Date.now();
          if (
            this.availableLasers > 0 &&
            currentTime - this.lastLaserShotTime > this.laserCooldown
          ) {
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
              this.lastLaserShotTime = currentTime;
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
            enemy = this.enemies.create(
              Phaser.Math.Between(0, this.scale.width),
              -50,
              "enemy"
            );
          } else {
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
                this.gameIsActive = false;
                this.physics.pause();
                this.gameEndTime = Date.now();
                this.gameDurationTimer.remove();
                const elapsedTime = this.gameEndTime - this.gameStartTime; // Correctly calculate elapsedTime here
                this.updateTotalGameTime(elapsedTime);
                const totalGameTime = this.gameEndTime - this.gameStartTime;
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
                    this.enemiesKilledWithLaser = 0;
                    this.updateEnemiesKilled();
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
                    this.initializeGameElements();
                  });
              }
            }
          }
        }
      }

      const Game = () => {
        const gameRef = useRef<HTMLDivElement>(null);
        const [game, setGame] = useState<Phaser.Game | null>(null);
        const [gameStarted, setGameStarted] = useAtom(gameStartedAtom);
        const [isGamePaused, setIsGamePaused] = useAtom(gamePausedAtom);
        const [loggedIn, setLoggedIn] = useState(false);
        useEffect(() => {
          if (game || !gameStarted) {
            // getUserSession().then(res=>res).catch(e=>e);
            getUserStats().then(res=>{
              console.log(res);
              // TODO: display stats
              setLoggedIn(true);
            }).catch(e=>e);
            return;
           }
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
        }, [gameStarted]); // depend on gameStarted state atom to initialize a new game when start game is clicked
        useEffect(() => {
          const handleKeyDown = async (event: KeyboardEvent) => {
            if (event.key === " ") {
              setIsGamePaused((prev) => !prev);
              // update DB here
              console.log(await updateGameStats());
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
              <h1 id="total-game-time">Total Game Time: 0.00 seconds</h1>
              <div
                id="laser-reset-bar"
                style={{
                  width: "100%",
                  height: "20px",
                  backgroundColor: "#ddd",
                }}
              ></div>
            </div>
            {!gameStarted && loggedIn ? (
              <button
                onClick={() => setGameStarted(true)}
                style={{
                  padding: "10px 20px",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
              >
                Start Game
              </button>
            ) : "log in maan"}
            {gameStarted && (
              <div
                ref={gameRef}
                style={{ width: "1000px", height: "750px" }}
              ></div>
            )}
          </div>
        );
      };
      return Game;
    }),
  { ssr: false, loading: () => <p>Loading game...</p> }
);

export default GameComponent;
