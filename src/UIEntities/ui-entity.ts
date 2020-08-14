import { Scene } from "phaser";
import { toPix } from "../maths/maps-utils";
import { Coordinate } from "../game/utils/coordinate";
import { gameBus, gameOver } from "../eventBus/game-bus";
import { pickInRange } from "../game/utils/random";
import { Entity } from "../game/entitybase/entity";
import { Monster } from "../game/monsters/monster";
import { Hero } from "../game/hero/hero";
import * as _ from 'lodash';
import { UIStatus } from "./ui-status";
import { UIDamages, DamageQueue } from "./ui-damages";

export abstract class UIEntity {
    sprite: Phaser.GameObjects.Sprite;
    outline: Phaser.GameObjects.Sprite;
    healthBar: Phaser.GameObjects.Sprite;
    healthBarFull: Phaser.GameObjects.Sprite;
	healthSize = 28;
	isDead = false;
	status: UIStatus; 
	spriteGroup: Phaser.GameObjects.Sprite[] = [];

	constructor(protected readonly parentScene: Scene, public subject: Entity, imageKey) {
		this.sprite = this.parentScene.physics.add.sprite(toPix(subject.pos.x), toPix(subject.pos.y), imageKey);
		this.sprite.setOrigin(0,0);
		this.healthBarFull = this.parentScene.add.sprite(this.sprite.x, this.sprite.y-14, 'healthfull');
		this.healthBarFull.setOrigin(0,0);
		this.healthBar = this.parentScene.add.sprite(this.sprite.x, this.sprite.y-14, 'health');
		this.healthBar.setOrigin(0,0);
		this.healthBar.setAlpha(0);
		this.healthBarFull.setAlpha(0);
		this.sprite.setDepth(3);
		this.spriteGroup.push(this.sprite, this.healthBarFull, this.healthBar);

		this.status = new UIStatus(this.parentScene, this.subject);
	}
	abstract updateHp(amount: number);
	abstract updateSprite(armourSkin: string);
	abstract takesDammage(amount, delay);
	
	updateStatus() {
		this.status.updateStatus();
	}
    move() {
		const delta = this.adjustSpriteAndLogicPosition();
		delta && this.animateToSynchronize(delta);
	}
	destroy() {
		this.spriteGroup.forEach(a => a.destroy());
		this.status.destroy();
	}
    animateToSynchronize(delta: Coordinate) {
		let delay = 75;
		if (this.subject instanceof Hero) {
			delay = 0;
		}
		if (this.subject instanceof Monster && this.subject.getFriendly() ) {
			delay = 0;
		}
		
		this.spriteGroup.forEach(sprite => {
			this.parentScene.tweens.add({
				targets: sprite,
				ease: 'Linear',
				duration: 50,
				delay: delay,
				repeat: 0,
				yoyo: false,
				x: { from: sprite.x, to: sprite.x + delta.x },
				y: { from: sprite.y, to: sprite.y + delta.y }
			});
		});

		this.status.updateToSynchronize(delay, delta);
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

export class UIHero extends UIEntity {
	damageQueue: DamageQueue = new DamageQueue();
	updateHp(amount: number) {
		this.takesDammage(amount);
		if (this.subject.health.currentHp <= 0 && !this.isDead) {
			gameBus.publish(gameOver({}));
		} else if (this.subject.health.currentHp === this.subject.health.baseHp) {
			this.healthBar.setAlpha(0);
			this.healthBarFull.setAlpha(0);
		} else {
			this.healthBar.setAlpha(0.9);
			this.healthBarFull.setAlpha(0.9);
			const normalized = this.subject.health.currentHp / this.subject.health.baseHp;
			this.healthBar.scaleX = normalized;
		}
	}
	takesDammage(amount: number) {
		this.damageQueue.add(
			new UIDamages(this.parentScene, this.subject as Hero, amount)
		);
		setTimeout(() => this.damageQueue.resolve(), 10);
	}
	updateSprite(armourSkin: string) {
		const skin = {
			'armour-light': 'hero-light',
			'armour-heavy': 'hero-heavy',
			'@': '@'
		}
		this.sprite.setTexture(skin[armourSkin] ?? 'hero');
	}
}
export class UIMonster extends UIEntity {
	cadaver: Phaser.GameObjects.Sprite;
	constructor(protected readonly parentScene: Scene, public subject: Entity, imageKey) {
		super(parentScene,subject,imageKey);
		this.updateFriendyIndication();
	}
	updateHp(amount: number) {
		this.takesDammage(amount);
		this.updateFriendyIndication();
		if (this.subject.health.currentHp <= 0 && !this.isDead) {
			this.isDead = true;
			if (pickInRange('0-1')) {
				this.cadaver = this.parentScene.add.sprite(toPix(this.subject.pos.x), toPix(this.subject.pos.y), 'blood');					
				this.cadaver.setOrigin(0,0);
			}
			this.destroy();
		} else if (this.subject.health.currentHp === this.subject.health.baseHp) {
			this.healthBar.setAlpha(0);
			this.healthBarFull.setAlpha(0);
		} else {
			this.healthBar.setAlpha(0.9);
			this.healthBarFull.setAlpha(0.9);
			const normalized = this.subject.health.currentHp / this.subject.health.baseHp;
			this.healthBar.scaleX = normalized;
		}
	}
	updateFriendyIndication() {
		if (this.subject instanceof Monster && this.subject.getFriendly() && this.outline == null) {
			this.outline = this.parentScene.physics.add.sprite(toPix(this.subject.pos.x), toPix(this.subject.pos.y), 'friendly').setOrigin(0,0);
			this.spriteGroup.push(this.outline);
		}
	}
	updateSprite(armourSkin: string) {}
	takesDammage(amount: number) {
		new UIDamages(this.parentScene, this.subject as Monster, amount).showDamage();
	}
	move() {
		super.move();
		this.updateFriendyIndication();
	}
}
