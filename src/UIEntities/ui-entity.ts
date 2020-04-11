import { Scene } from "phaser";
import { toPix } from "../maths/maps-utils";
import { Coordinate } from "../game/utils/coordinate";
import { Movable } from "../game/entitybase/movable";
import { Killable } from "../game/entitybase/killable";

export class UIEntity {
    sprite: any;
    healthBar: Phaser.GameObjects.Sprite;
    healthBarFull: Phaser.GameObjects.Sprite;
	healthSize = 28;
	constructor(private readonly parentScene: Scene,
				 public subject: Movable & Killable,
				 private imageKey) {
		this.sprite = this.parentScene.physics.add.sprite(toPix(subject.pos.x), toPix(subject.pos.y), imageKey);
		this.sprite.setOrigin(0,0);
		this.healthBarFull = this.parentScene.add.sprite(this.sprite.x, this.sprite.y-14, 'healthfull');
		this.healthBarFull.setOrigin(0,0);
		this.healthBar = this.parentScene.add.sprite(this.sprite.x, this.sprite.y-14, 'health');
		this.healthBar.setOrigin(0,0);
		this.healthBar.setAlpha(0);
		this.healthBarFull.setAlpha(0);
	}
    
    move() {
        const delta = this.adjustSpriteAndLogicPosition();
        delta && this.animateToSynchronize(delta);
	}
	destroy(isHero = false) {
		if (!isHero)this.sprite.destroy();
		this.healthBarFull.destroy();
		this.healthBar.destroy();
	}
	updateHp(isHero = false) {
		if (this.subject.health.currentHp <= 0) {
			this.destroy(isHero);
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
}