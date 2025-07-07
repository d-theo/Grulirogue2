import { Scene } from "phaser";
import { toPix } from "../../utils/maths/maps-utils";
import { Coordinate } from "../../utils/coordinate";
import { gameBus } from "../../infra/events/game-bus";
import { pickInRange } from "../../utils/random";
import { Entity } from "../../game/entitybase/entity";
import * as _ from "lodash";
import { Hero } from "../../game/hero/hero";
import { Monster } from "../../game/entitybase/monsters/monster";
import { gameOver } from "../../game/events";

export class UIEntity {
  sprite: Phaser.GameObjects.Sprite;
  outline: Phaser.GameObjects.Sprite;
  healthBar: Phaser.GameObjects.Sprite;
  healthBarFull: Phaser.GameObjects.Sprite;
  healthSize = 28;
  isDead = false;
  affects: { sprite: Phaser.GameObjects.Sprite; type: string }[] = [];
  constructor(
    private readonly parentScene: Scene,
    public subject: Entity,
    private imageKey
  ) {
    this.sprite = this.parentScene.physics.add.sprite(
      toPix(subject.pos.x),
      toPix(subject.pos.y),
      imageKey
    );
    this.sprite.setOrigin(0, 0);
    this.healthBarFull = this.parentScene.add.sprite(
      this.sprite.x,
      this.sprite.y - 14,
      "healthfull"
    );
    this.healthBarFull.setOrigin(0, 0);
    this.healthBar = this.parentScene.add.sprite(
      this.sprite.x,
      this.sprite.y - 14,
      "health"
    );
    this.healthBar.setOrigin(0, 0);
    this.healthBar.setAlpha(0);
    this.healthBarFull.setAlpha(0);
    this.sprite.setDepth(3);
    this.updateFriendyIndication();
  }

  move() {
    const delta = this.adjustSpriteAndLogicPosition();
    delta && this.animateToSynchronize(delta);
    this.updateFriendyIndication();
    this.updateStatus();
  }

  destroy() {
    this.sprite.destroy();
    this.healthBarFull.destroy();
    this.healthBar.destroy();
    this.affects.forEach((a) => a.sprite.destroy());
    if (this.outline != null) this.outline.destroy();
  }

  updateStatus() {
    const report = this.subject.enchants.report();

    const currentStatus = new Set<string>();
    for (let affect of this.affects) {
      // affect ended
      if (report.indexOf(affect.type) < 0) {
        this.removeAffect(affect);
      } else {
        currentStatus.add(affect.type);
      }
    }

    for (let affect of report) {
      if (!currentStatus.has(affect)) {
        currentStatus.add(affect);
        this.addAffect(affect);
      }
    }
  }

  addAffect(affect: string) {
    const status = {
      Bleeding: "bleeding",
      Poisoned: "poisoning",
      "Movement+": "movement_plus",
      "Range+": "range_plus",
      "Absorb+": "absorb_plus",
    };
    const offset = this.affects.length * 10;
    const sprite = this.parentScene.add.sprite(
      toPix(this.subject.pos.x),
      toPix(this.subject.pos.y) + offset,
      status[affect]
    );
    this.sprite.setOrigin(0, 0);
    this.affects.push({
      type: affect,
      sprite: sprite,
    });
  }
  removeAffect(affect: { type; sprite }) {
    //const index = _.findIndex(this.affects, (a => affect.type === a.type));
    affect.sprite.destroy();
    this.affects = this.affects.filter((a) => a.type !== affect.type);
  }

  updateHp(isHero = false) {
    this.updateStatus();
    this.updateFriendyIndication();
    if (this.subject.health.currentHp <= 0 && !this.isDead) {
      this.isDead = true;
      if (isHero) {
        gameBus.publish(gameOver({}));
      } else {
        if (pickInRange("0-1")) {
          this.sprite.setTexture("blood");
          this.healthBarFull.destroy();
          this.healthBar.destroy();
          this.sprite.setDepth(0);
          this.affects.forEach((a) => a.sprite.destroy());
          if (this.outline != null) this.outline.destroy(); // todo refacto ?
        } else {
          this.destroy();
        }
      }
    }
    if (this.subject.health.currentHp === this.subject.health.baseHp) {
      this.healthBar.setAlpha(0);
      this.healthBarFull.setAlpha(0);
    } else {
      this.healthBar.setAlpha(0.9);
      this.healthBarFull.setAlpha(0.9);
      const normalized =
        this.subject.health.currentHp / this.subject.health.baseHp;
      this.healthBar.scaleX = normalized;
    }
  }

  animateToSynchronize(delta: Coordinate) {
    let delay = 75;
    if (this.subject instanceof Hero) {
      delay = 0;
    }
    if (this.subject instanceof Monster && this.subject.getFriendly()) {
      delay = 0;
    }

    this.parentScene.tweens.add({
      targets: this.sprite,
      ease: "Linear",
      duration: 50,
      delay: delay,
      repeat: 0,
      yoyo: false,
      x: { from: this.sprite.x, to: this.sprite.x + delta.x },
      y: { from: this.sprite.y, to: this.sprite.y + delta.y },
    });

    this.parentScene.tweens.add({
      targets: this.healthBar,
      ease: "Linear",
      duration: 50,
      delay: delay,
      repeat: 0,
      yoyo: false,
      x: { from: this.healthBar.x, to: this.healthBar.x + delta.x },
      y: { from: this.healthBar.y, to: this.healthBar.y + delta.y },
    });
    this.parentScene.tweens.add({
      targets: this.healthBarFull,
      ease: "Linear",
      duration: 50,
      delay: delay,
      repeat: 0,
      yoyo: false,
      x: { from: this.healthBarFull.x, to: this.healthBarFull.x + delta.x },
      y: { from: this.healthBarFull.y, to: this.healthBarFull.y + delta.y },
    });
    this.affects.forEach((affect) => {
      this.parentScene.tweens.add({
        targets: affect.sprite,
        ease: "Linear",
        duration: 50,
        delay: delay,
        repeat: 0,
        yoyo: false,
        x: { from: affect.sprite.x, to: affect.sprite.x + delta.x },
        y: { from: affect.sprite.y, to: affect.sprite.y + delta.y },
      });
    });

    if (this.outline) {
      this.parentScene.tweens.add({
        targets: this.outline,
        ease: "Linear",
        duration: 50,
        delay: delay,
        repeat: 0,
        yoyo: false,
        x: { from: this.outline.x, to: this.outline.x + delta.x },
        y: { from: this.outline.y, to: this.outline.y + delta.y },
      });
    }
  }

  adjustSpriteAndLogicPosition() {
    const dx = toPix(this.subject.pos.x) - this.sprite.x;
    const dy = toPix(this.subject.pos.y) - this.sprite.y;
    if (dx !== 0 || dy !== 0) {
      return { x: dx, y: dy };
    } else {
      return null;
    }
  }

  updateFriendyIndication() {
    if (
      this.subject instanceof Monster &&
      this.subject.getFriendly() &&
      this.outline == null
    ) {
      this.outline = this.parentScene.physics.add
        .sprite(
          toPix(this.subject.pos.x),
          toPix(this.subject.pos.y),
          "friendly"
        )
        .setOrigin(0, 0);
    }
  }

  updateHeroSprite(armourSkin: string) {
    const skin = {
      "armour-light": "hero-light",
      "armour-heavy": "hero-heavy",
      "@": "@",
    };
    this.sprite.setTexture(skin[armourSkin] ?? "hero");
  }
}
