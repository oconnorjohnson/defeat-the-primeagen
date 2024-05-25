"use client";
import Link from "next/link";
import {
  getTopScores,
  getUserStats,
  updateGameStats /*getUserSession */,
} from "@/lib/actions";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useAtom } from "jotai";

import {
  gamePausedAtom,
  gameStartedAtom,
  scoreAtom,
  enemiesKilledWithLaserAtom,
  enemiesCollidedWithAtom,
  acceptanceRateAtom,
  totalFriendliesPassedAtom,
  hitRateAtom,
} from "@/state/atoms";
import ScoreCalculator from "@/components/game/ScoreCalculator";
import { updateAchievements, Stat } from "@/lib/achievement-actions";

// game component is a wrapper around phaser game, which dynamically loads the phaser library to interop with next ssr and client side rendering
// MainScene defines the game logic and state
// Create is a function that creates a new instance of the MainScene class
// Update is a function called on every frame of phaser's game loop
const GameComponent = dynamic(
  () =>
    import("phaser").then((Phaser) => {
      class MainScene extends Phaser.Scene {
        // game stat callback initializers
        setScoreState: (value: number) => void = () => {};
        setEnemiesKilledWithLaserState: (value: number) => void = () => {};
        setEnemiesCollidedWithState: (value: number) => void = () => {};
        setTotalFriendliesPassedState: (value: number) => void = () => {};
        setHitRateState: (value: number) => void = () => {};
        setAcceptanceRateState: (value: number) => void = () => {};
        // mainscene class constructor
        constructor(
          setScoreState: (value: number) => void,
          setEnemiesKilledWithLaserState: (value: number) => void,
          setEnemiesCollidedWithState: (value: number) => void,
          setTotalFriendliesPassedState: (value: number) => void,
          setHitRateState: (value: number) => void,
          setAcceptanceRateState: (value: number) => void
        ) {
          super({ key: "MainScene" });
          this.setScoreState = setScoreState;
          this.setEnemiesKilledWithLaserState = setEnemiesKilledWithLaserState;
          this.setEnemiesCollidedWithState = setEnemiesCollidedWithState;
          this.setTotalFriendliesPassedState = setTotalFriendliesPassedState;
          this.setHitRateState = setHitRateState;
          this.setAcceptanceRateState = setAcceptanceRateState;
          this.score = 0;
          this.hitEnemy = this.hitEnemy;
        }
        // game state variables
        gameIsActive: boolean = true;
        score: number;
        scoreText!: Phaser.GameObjects.Text;
        bg!: Phaser.GameObjects.TileSprite;
        stars!: Phaser.GameObjects.TileSprite;
        meteors!: Phaser.GameObjects.TileSprite;
        enemiesKilledWithLaser: number = 0;
        enemiesKilledText!: Phaser.GameObjects.Text;
        player!: Phaser.Physics.Arcade.Sprite;
        cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
        enemies!: Phaser.Physics.Arcade.Group;
        friendlies!: Phaser.Physics.Arcade.Group;
        enemySpawnEvent!: Phaser.Time.TimerEvent;
        enemySpawnRate: number = 1000;
        friendlySpawnEvent!: Phaser.Time.TimerEvent;
        totalFriendliesPassed: number = 0;
        friendliesCollected: number = 0;
        laserShootSound!: Phaser.Sound.BaseSound;
        laserHitSound!: Phaser.Sound.BaseSound;
        kachingSound!: Phaser.Sound.BaseSound;
        errorSound!: Phaser.Sound.BaseSound;
        backgroundMusic!: Phaser.Sound.BaseSound;
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
        elapsedTimeDuringPause: number = 0;
        gameStartTime!: number;
        gameEndTime!: number;
        lastLaserShotTime: number = 0;
        laserCooldown: number = 250; // ms
        lastRateDecreaseTime: number = 0;
        rateDecreaseInterval: number = 5000;
        lastLaserResetTime: number = 0;

        // preload game assets
        preload() {
          this.load.spritesheet("portal", "/portal.png", {
            frameWidth: 64,
            frameHeight: 60,
          });
          this.load.spritesheet("enemy", "/badcode.png", {
            frameWidth: 50,
            frameHeight: 50,
          });
          this.load.spritesheet("friendly", "/goodcode.png", {
            frameWidth: 50,
            frameHeight: 50,
          });
          this.load.image("laser", "/laser.png");
          this.load.image("background", "/gamebgtile.png");
          this.load.image("BG", "/BG.png");
          this.load.image("Meteors", "/Meteors.png");
          this.load.image("Stars", "/Stars.png");
          this.load.audio("soundtrack", "/soundtrack.mp3");
          this.load.audio("laserShootSound", "/laserShoot.mp3");
          this.load.audio("laserHitSound", "/laserHit.mp3");
          this.load.audio("kachingSound", "/kaching.mp3");
          this.load.audio("errorSound", "/error.mp3");
        }
        //  initialize game elements
        initializeGameElements() {
          this.setupLaserResetTimer();
          this.drawLaserResetBar();
        }
        // create class method that runs on game start
        create() {
          this.initializeGameElements();
          this.bg = this.add.tileSprite(0, 0, 1080, 1920, "BG").setOrigin(0, 0);
          this.stars = this.add
            .tileSprite(0, 0, 1080, 1920, "Stars")
            .setOrigin(0, 0);
          this.meteors = this.add
            .tileSprite(0, 0, 1080, 1920, "Meteors")
            .setOrigin(0, 0);

          // Set depth for layering
          this.bg.setDepth(-3);
          this.stars.setDepth(-2);
          this.meteors.setDepth(-1);
          this.lastLaserResetTime = Date.now();
          this.cameras.main.setBackgroundColor("#b0c4de");
          this.gameStartTime = Date.now();
          this.lastRateDecreaseTime = this.gameStartTime;
          this.setupEnemySpawnEvent();
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
            "portal"
          );
          this.player.setCollideWorldBounds(true);
          this.anims.create({
            key: "portal-animate",
            frames: this.anims.generateFrameNumbers("portal", {
              start: 5,
              end: 0,
            }),
            frameRate: 18,
            repeat: 0,
          });
          this.anims.create({
            key: "enemy-loop",
            frames: this.anims.generateFrameNumbers("enemy", {
              start: 0,
              end: 11,
            }),
            frameRate: 5,
            repeat: -1,
          });
          this.anims.create({
            key: "friendly-loop",
            frames: this.anims.generateFrameNumbers("friendly", {
              start: 0,
              end: 11,
            }),
            frameRate: 5,
            repeat: -1,
          });
          this.laserShootSound = this.sound.add("laserShootSound", {
            volume: 0.3,
          });
          this.laserHitSound = this.sound.add("laserHitSound", {
            volume: 0.5,
          });
          this.kachingSound = this.sound.add("kachingSound", {
            volume: 0.5,
          });
          this.errorSound = this.sound.add("errorSound", {
            volume: 0.5,
          });
          this.backgroundMusic = this.sound.add("soundtrack", { loop: true });
          this.backgroundMusic.play();

          // create a group for player trails
          // this.playerTrail = this.add.group({
          //   max: 0.1,
          //   classType: Phaser.GameObjects.Image,
          // });
          // iterate overal over the player adding a trail (simulate motion blur)
          // for (let i = 0; i < 1; i++) {
          //   const trailSprite = this.add.image(
          //     this.player.x,
          //     this.player.y,
          //     "player"
          //   );
          //   trailSprite.setScale(1 - i * 0.01);
          //   trailSprite.setAlpha(1 - i * 0.1);
          //   this.playerTrail.add(trailSprite);
          // }
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
              enemy.play("enemy-loop");
            }
            return true;
          });

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
                this.setEnemiesCollidedWithState(this.enemiesHit);
                this.enemies.remove(enemy, true, true);
                this.hitEnemy(player, enemy);
                this.player.play("portal-animate");
                this.errorSound.play();
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
                this.laserHitSound.play();
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
          const firstFriendly = this.friendlies.getFirstAlive();
          if (firstFriendly) {
            firstFriendly.play("friendly-loop");
          }
          this.setupColliders();
          this.enemySpawnEvent = this.time.addEvent({
            delay: this.enemySpawnRate,
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

        pauseGameDurationTimer() {
          if (this.gameDurationTimer) {
            this.gameDurationTimer.paused = true;
            this.elapsedTimeDuringPause = Date.now(); // Capture the current time when pausing
          }
        }

        resumeGameDurationTimer() {
          if (this.gameDurationTimer) {
            const pausedDuration = Date.now() - this.elapsedTimeDuringPause; // Calculate the paused duration
            this.gameStartTime += pausedDuration; // Adjust the game start time by the paused duration
            this.gameDurationTimer.paused = false;
          }
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

        setupEnemySpawnEvent() {
          if (this.enemySpawnEvent) {
            this.enemySpawnEvent.remove();
          }
          this.enemySpawnEvent = this.time.addEvent({
            delay: this.enemySpawnRate,
            callback: this.spawnEnemy,
            callbackScope: this,
            loop: true,
          });
        }

        update(time: number, delta: number) {
          const velocityPerSecond = 500;
          const deltaInSeconds = delta / 1000;
          this.bg.tilePositionY -= 0.5; // Slowest
          this.stars.tilePositionY -= 1; // Medium speed
          this.meteors.tilePositionY -= 2.5; // Fastest
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

          if (time - this.lastRateDecreaseTime > this.rateDecreaseInterval) {
            if (this.enemySpawnRate > 100) {
              // minimum delay of 100 ms
              this.enemySpawnRate -= 50; // decrease the delay by 50 ms
              this.setupEnemySpawnEvent(); // Re-setup the spawn event with new delay
              this.lastRateDecreaseTime = time; // Reset the last decrease time
            }
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
              this.setTotalFriendliesPassedState(this.totalFriendliesPassed);
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

          if (this.totalFriendliesPassed > 0) {
            const newHitRate =
              (this.friendliesCollected / this.totalFriendliesPassed) * 100;
          }
          let lastPosition = { x: this.player.x, y: this.player.y };

          // this.playerTrail.getChildren().forEach((trail, index) => {
          //   const currentTrail = trail as Phaser.GameObjects.Image;
          //   const tempPosition = { x: currentTrail.x, y: currentTrail.y };
          //   currentTrail.setPosition(lastPosition.x, lastPosition.y);
          //   lastPosition = tempPosition;
          //   currentTrail.setAlpha(1 - index * 0.1);
          // });
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
              laserResetBar.style.backgroundColor = "#ddd"; // Static color when game is paused or ended
            }
            return;
          }
          const currentTime = Date.now();
          const timePassed = currentTime - this.lastLaserResetTime; // Use lastLaserResetTime here
          const timeLeft = this.laserResetDuration - timePassed;
          const percentageLeft = (timeLeft / this.laserResetDuration) * 100;
          const laserResetBar = document.getElementById("laser-reset-bar");
          if (laserResetBar) {
            laserResetBar.style.width = `${Math.max(0, percentageLeft)}%`;
            laserResetBar.style.backgroundColor = "#00ff00"; // Dynamic color when game is active
          }
        }

        updateScore() {
          const scoreElement = document.getElementById("score");
          if (scoreElement) {
            scoreElement.innerText = `Score: ${this.score}`;
          }
          this.setScoreState(this.score);
        }

        updateHitRate() {
          const hitRateElement = document.getElementById("hit-rate");
          if (hitRateElement)
            hitRateElement.innerText = `Hit Rate: ${(
              (this.friendliesCollected / this.totalFriendliesPassed) *
              100
            ).toFixed(2)}%`;
          this.setHitRateState(
            (this.friendliesCollected / this.totalFriendliesPassed) * 100
          );
        }

        updateEnemiesKilled() {
          const enemiesKilledElement =
            document.getElementById("enemies-killed");
          if (enemiesKilledElement)
            enemiesKilledElement.innerText = `Enemies Killed: ${this.enemiesKilledWithLaser}`;
          this.setEnemiesKilledWithLaserState(this.enemiesKilledWithLaser);
        }

        setupLaserResetTimer() {
          if (this.laserResetTimer) {
            this.laserResetTimer.remove();
          }
          this.laserResetTimer = this.time.addEvent({
            delay: this.laserResetDuration,
            callback: () => {
              this.resetLasers();
              this.timeUntilNextReset = this.laserResetDuration;
            },
            callbackScope: this,
            loop: true,
          });
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
              this.laserShootSound.play();
            }
          } else {
            // console.log("No lasers available to fire.");
          }
        }

        resetLasers() {
          this.availableLasers = 10;
          this.lastLaserResetTime = Date.now();
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
            this.tweens.add({
              targets: enemy,
              angle: 360,
              duration: 500,
              ease: "Cubic.easeOut",
              onComplete: () => {
                enemy.setActive(false).setVisible(false);
                enemy.body!.enable = false;
              },
            });
          }
        }

        spawnEnemy() {
          // Spawn enemy logic
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
          enemy.play("enemy-loop");
        }

        spawnFriendly() {
          const xPosition = Phaser.Math.Between(0, this.scale.width);
          const newFriendly = this.friendlies.create(
            xPosition,
            -50,
            "friendly"
          );
          newFriendly.setVelocity(0, 200);
          newFriendly.play("friendly-loop");
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
            this.player.play("portal-animate");
            this.kachingSound.play();
          }
        }

        clearEnemyStates() {
          this.enemies.children.iterate(
            (enemy: Phaser.GameObjects.GameObject) => {
              if (enemy instanceof Phaser.Physics.Arcade.Sprite) {
                enemy.setData("isHit", false);
                enemy.setData("inDebounce", false);
                enemy.setActive(true).setVisible(true);
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

              // this.tweens.add({
              //   targets: player,
              //   angle: 360,
              //   duration: 500,
              //   ease: "Cubic.easeOut",
              //   onComplete: () => {
              //     player.setAngle(0);
              //   },
              // });
              if (this.enemiesHit < 3) {
                player.setTint(0xff0000); // Red tint
                this.time.delayedCall(500, () => {
                  player.clearTint(); // Clear tint after 500ms
                });
              }
              if (this.enemiesHit >= 3) {
                this.gameIsActive = false;
                this.physics.pause();
                this.gameEndTime = Date.now();
                this.gameDurationTimer.remove();
                const elapsedTime = this.gameEndTime - this.gameStartTime;
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
                    this.backgroundMusic.stop();
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

        const [loggedIn, setLoggedIn] = useState(true);

        const [scoreState, setScoreState] = useAtom(scoreAtom);
        const [enemiesKilledWithLaserState, setEnemiesKilledWithLaserState] =
          useAtom(enemiesKilledWithLaserAtom);
        const [enemiesCollidedWithState, setEnemiesCollidedWithState] = useAtom(
          enemiesCollidedWithAtom
        );
        const [totalFriendlyPassedState, setTotalFriendliesPassedState] =
          useAtom(totalFriendliesPassedAtom);
        const [hitRateState, setHitRateState] = useAtom(hitRateAtom);
        const [acceptanceRateState, setAcceptanceRateState] =
          useAtom(acceptanceRateAtom);

        const [width, setWidth] = useState(window.innerWidth);
        const [height, setHeight] = useState(window.innerHeight);
        const sideBarWidth = 200;
        useEffect(() => {
          if (game || !gameStarted) {
            getUserStats()
              .then((res) => {
                console.log(res);
                if (res) {
                  const resJson = JSON.parse(res);
                  setScoreState(Number(resJson.stats.score));
                  setEnemiesKilledWithLaserState(
                    Number(resJson.stats.enemies_shot_down)
                  );
                  setEnemiesCollidedWithState(
                    Number(resJson.stats.enemy_collisions)
                  );
                  setTotalFriendliesPassedState(
                    Number(resJson.stats.friendly_collisions)
                  );
                  setLoggedIn(true);
                }
              })
              .catch((e) => e);

              getTopScores()
              .then(res => {
                if (res) {
                  const resJson = JSON.parse(res);
                  console.log(resJson);
                }
              })
              .catch(error => console.error(error));
            return;
          }

          const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: 1050,
            height: 800,
            parent: gameRef.current || undefined,
            physics: {
              default: "arcade",
              arcade: { gravity: { y: 200, x: 0 } },
            },
            scene: [
              new MainScene(
                setScoreState,
                setEnemiesKilledWithLaserState,
                setEnemiesCollidedWithState,
                setTotalFriendliesPassedState,
                setHitRateState,
                setAcceptanceRateState
              ),
            ],
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
        }, [gameStarted]);
        useEffect(() => {
          const handleKeyDown = async (event: KeyboardEvent) => {
            if (event.key === " ") {
              setIsGamePaused((prev) => !prev);

              console.log(
                "game state atom values:",
                scoreState,
                enemiesKilledWithLaserState,
                enemiesCollidedWithState,
                totalFriendlyPassedState,
                hitRateState,
                acceptanceRateState
              );
              // update DB here
              console.log(
                await updateGameStats(
                  scoreState,
                  enemiesKilledWithLaserState,
                  enemiesCollidedWithState,
                  totalFriendlyPassedState
                )
              );

              await updateAchievements({
                score: scoreState,
                enemy_collisions: enemiesCollidedWithState,
                friendly_collisions: totalFriendlyPassedState,
                friendly_misses: totalFriendlyPassedState,
                enemies_shot_down: hitRateState,
                total_game_time: acceptanceRateState,
              } as Stat);
            }
          };

          window.addEventListener("keydown", handleKeyDown);
          return () => {
            window.removeEventListener("keydown", handleKeyDown);
          };
        }, [
          scoreState,
          enemiesKilledWithLaserState,
          enemiesCollidedWithState,
          totalFriendlyPassedState,
          hitRateState,
          acceptanceRateState,
        ]);
        useEffect(() => {
          if (!game) return;
          const scene = game.scene.getScene("MainScene") as MainScene;
          if (scene) {
            if (isGamePaused) {
              game.scene.pause("MainScene");
              scene.pauseGameDurationTimer();
            } else {
              game.scene.resume("MainScene");
              scene.resumeGameDurationTimer();
            }
          } else {
            // console.log("No scene found");
          }
        }, [isGamePaused, game]);
        useEffect(() => {
          const resizeGame = () => {
            setWidth(window.innerWidth - sideBarWidth);
            setHeight(window.innerHeight);
            if (gameRef.current && game) {
              game.scale.resize(width, height);
            }
          };

          window.addEventListener("resize", resizeGame);
          return () => {
            window.removeEventListener("resize", resizeGame);
          };
        }, [game, width, height]);

        return (
          <div
            style={{ width: `${width}px`, height: `${height}px` }}
            className="flex flex-row justify-center items-center"
          >
            {/* {!gameStarted && loggedIn ? (
            <div
              id="game-ui"
              className="text-xl bg-white text-black font-bold"
              style={{ width: "200px", flexShrink: 0, padding: "10px" }}
            >
              <h1 id="score">Score: {scoreState}</h1>
              <h1 id="hit-rate">Hit Rate: 0%</h1>
              <h1 id="enemies-killed">Enemies Killed: {enemiesKilledWithLaserState}</h1>
              <h1 id="enemy-collisions">Enemy Collisions: {enemiesCollidedWithState}/3</h1>
              <h1 id="total-game-time">Total Game Time: 0.00 seconds</h1>
              <div
                id="game-ui"
                className="text-xl bg-black text-white font-bold flex flex-col justify-center items-start h-full"
                style={{ width: "200px", flexShrink: 0, padding: "10px" }}
              >
                <h1 id="score">Score: {scoreState}</h1>
                <h1 id="hit-rate">Hit Rate: 0%</h1>
                <h1 id="enemies-killed">
                  Enemies Killed: {enemiesKilledWithLaserState}
                </h1>
                <h1 id="enemy-collisions">
                  Enemy Collisions: {enemiesCollidedWithState}/3
                </h1>
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
            ) : (
             
              // <div
              //   id="game-ui"
              //   className="text-xl bg-white text-black font-bold h-full"
              //   style={{ width: "200px", padding: "10px" }}
              // >
              //   {" "}
              //   {loggedIn ? (
              //     <>
              //       <h1 id="score">Score: {scoreState}</h1>
              //       <h1 id="hit-rate">Hit Rate: 0%</h1>
              //       <h1 id="enemies-killed">
              //         Enemies Killed: {enemiesKilledWithLaserState}
              //       </h1>
              //       <h1 id="enemy-collisions">
              //         Enemy Collisions: {enemiesCollidedWithState}/3
              //       </h1>
              //       <h1 id="total-game-time">Total Game Time: 0.00 seconds</h1>
              //       <div
              //         id="laser-reset-bar"
              //         style={{
              //           width: "100%",
              //           height: "20px",
              //           backgroundColor: "#ddd",
              //         }}
              //       ></div>
              //     </>
              //   ) : (
              //     <h1>Login to see stats</h1>
              //   )}
              // </div>
              <div></div>
            )} */}
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
            ) : (
              <Link href="/auth/ui/signup" replace>
                Login
              </Link>
            )}
            {gameStarted && <div ref={gameRef}></div>}
          </div>
        );
      };
      return Game;
    }),
  { ssr: false, loading: () => <p>Loading game...</p> }
);

export default GameComponent;
