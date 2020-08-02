import { Entity } from "../game/entitybase/entity";
import { toPix } from "../maths/maps-utils";

// manage & display temporary status like speed/poisoned/bleeding...
export class UIStatus {
    affects: {sprite: Phaser.GameObjects.Sprite, type: string}[] = [];
    constructor(private readonly parentScene, private readonly subject: Entity) {}

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

	private addAffect(affect: string) {
		const status = {
			'Bleeding':'bleeding',
			'Poisoned':'poisoning',
			'Movement+':'movement_plus',
			'Range+':'range_plus',
			'Absorb+':'absorb_plus',
		};
		const offsetX = this.affects.length > 3 ? 32 : 0;
		const offsetY = this.affects.length % 4 * 10;
		const sprite = this.parentScene.add.sprite(toPix(this.subject.pos.x) + offsetX, toPix(this.subject.pos.y) + offsetY, status[affect]);
		this.affects.push({
			type: affect,
			sprite: sprite
		});
	}
	private removeAffect(affect: {type, sprite}) {
		affect.sprite.destroy();
		this.affects = this.affects.filter(a => a.type !== affect.type);
	}
	
	updateToSynchronize(delay, delta) {
		this.affects.forEach(affect => {
			this.parentScene.tweens.add({
				targets: affect.sprite,
				ease: 'Linear',
				duration: 50,
				delay: delay,
				repeat: 0,
				yoyo: false,
				x: { from: affect.sprite.x, to: affect.sprite.x + delta.x },
				y: { from: affect.sprite.y, to: affect.sprite.y + delta.y }
			});
		});
	}

    destroy() {
        this.affects.forEach(a => a.sprite.destroy());
    }
}