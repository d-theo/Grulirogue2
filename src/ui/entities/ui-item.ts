import { Scene } from "phaser";
import { Item } from "../../game/entitybase/item";
import { toPix } from "../../maths/maps-utils";

export class UIItem {
	sprite: any;
	outline: any;
	constructor(private readonly parentScene: Scene,
				 public subject: Item,
				 private imageKey) {
		this.sprite = this.parentScene.physics.add.sprite(toPix(subject.pos.x), toPix(subject.pos.y), imageKey);
		this.sprite.setOrigin(0,0);
		this.outline = this.parentScene.physics.add.sprite(toPix(subject.pos.x), toPix(subject.pos.y), 'itemable').setOrigin(0,0);
	}
	pickedUp() {
		this.sprite.destroy();
		this.outline.destroy();
	}
	destroy() {
		this.sprite.destroy();
		this.outline.destroy();
	}
}