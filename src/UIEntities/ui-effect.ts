import { Scene } from "phaser";
import { toPix } from "../maths/maps-utils";
import { Coordinate } from "../game/utils/coordinate";

export class UIEffect {
    sprite: any;
	constructor(private readonly parentScene: Scene,
				 public subject: {name: string, pos: Coordinate},
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