import { Scene } from "phaser";
import { toPix } from "../maths/maps-utils";
import { Item } from "../game/entitybase/item";

export class UIItem {
    sprite: any;
	constructor(private readonly parentScene: Scene,
				 public subject: Item,
				 private imageKey) {
		this.sprite = this.parentScene.physics.add.sprite(toPix(subject.pos.x), toPix(subject.pos.y), imageKey);
		this.sprite.setOrigin(0,0);
	}
	pickedUp() {
		this.sprite.destroy();
	}
	destroy() {
		this.sprite.destroy();
	}
}