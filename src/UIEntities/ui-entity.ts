import { Scene } from "phaser";
import { toPix } from "../maths/maps-utils";
import { Coordinate } from "../game/utils/coordinate";
import { gameBus, gameOver } from "../eventBus/game-bus";
import { pickInRange } from "../game/utils/random";
import { Armour } from "../game/items/armour";
import { Entity } from "../game/entitybase/entity";

export class UIEntity {
    sprite: Phaser.GameObjects.Sprite;
    healthBar: Phaser.GameObjects.Sprite;
    healthBarFull: Phaser.GameObjects.Sprite;
	healthSize = 28;
	isDead = false;
	constructor(private readonly parentScene: Scene,
				 public subject: Entity,
				 private imageKey) {
		this.sprite = this.parentScene.physics.add.sprite(toPix(subject.pos.x), toPix(subject.pos.y), imageKey);
		this.sprite.setOrigin(0,0);
		this.healthBarFull = this.parentScene.add.sprite(this.sprite.x, this.sprite.y-14, 'healthfull');
		this.healthBarFull.setOrigin(0,0);
		this.healthBar = this.parentScene.add.sprite(this.sprite.x, this.sprite.y-14, 'health');
		this.healthBar.setOrigin(0,0);
		this.healthBar.setAlpha(0);
		this.healthBarFull.setAlpha(0);
		this.sprite.setDepth(3);
	}
    
    move() {
		const delta = this.adjustSpriteAndLogicPosition();
        delta && this.animateToSynchronize(delta);
	}

	destroy() {
		this.sprite.destroy();
		this.healthBarFull.destroy();
		this.healthBar.destroy();
	}

	updateHp(isHero = false) {
		if (this.subject.health.currentHp <= 0 && !this.isDead) {
			this.isDead = true;
			if (isHero) {
				gameBus.publish(gameOver({}));
			} else {
				if (pickInRange('0-1')) {
					this.sprite.setTexture('blood');
					this.healthBarFull.destroy();
					this.healthBar.destroy();
					this.sprite.setDepth(0);
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
			const normalized = this.subject.health.currentHp / this.subject.health.baseHp;
			this.healthBar.scaleX = normalized;
		}
	}

    animateToSynchronize(delta: Coordinate) {
		this.parentScene.tweens.add({
			targets: this.sprite,
			ease: 'Linear',
			duration: 50,
			repeat: 0,
			yoyo: false,
			x: { from: this.sprite.x, to: this.sprite.x + delta.x },
			y: { from: this.sprite.y, to: this.sprite.y + delta.y }
		});

		this.parentScene.tweens.add({
			targets: this.healthBar,
			ease: 'Linear',
			duration: 50,
			repeat: 0,
			yoyo: false,
			x: { from: this.healthBar.x, to: this.healthBar.x + delta.x },
			y: { from: this.healthBar.y, to: this.healthBar.y + delta.y }
		});
		this.parentScene.tweens.add({
			targets: this.healthBarFull,
			ease: 'Linear',
			duration: 50,
			repeat: 0,
			yoyo: false,
			x: { from: this.healthBarFull.x, to: this.healthBarFull.x + delta.x },
			y: { from: this.healthBarFull.y, to: this.healthBarFull.y + delta.y }
		});
    }

    adjustSpriteAndLogicPosition() {
		const dx = toPix(this.subject.pos.x) - this.sprite.x;
		const dy = toPix(this.subject.pos.y) - this.sprite.y;
		if (dx !== 0 || dy !== 0) {
			return {x: dx,y: dy};
		} else {
			return null;
		}
	}

	updateHeroSprite(armourSkin: string) {
		const skin = {
			'armour-light': 'hero-light',
			'armour-heavy': 'hero-heavy',
			'@': '@'
		}
		this.sprite.setTexture(skin[armourSkin] ?? 'hero');
	}
}