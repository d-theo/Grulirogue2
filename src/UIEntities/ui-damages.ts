import { Scene } from "phaser";
import { toPix } from "../maths/maps-utils";
import { Coordinate } from "../game/utils/coordinate";

export class UIDamages {
	textObj;
	offset: number = 0;
	Font = {
		fontSize: '10px',
		fontFamily: 'square',
		color: '#FFFFFF',
		wordWrap: {
		  width: 310
		}
	  };
	constructor(private readonly parentScene: Scene,
				 public subject: {name: string, pos: Coordinate},
				 private number) {
		let txt;
		if (number == 0) {
			txt = 'miss';
			this.Font.fontSize = '8px';
		} else if (number < 0) {
			txt = ''+number;
		} else if (number > 0) {
			txt = '+'+number;
			this.Font.color = '#83F52C'
		}
		this.textObj = this.parentScene.add.text(toPix(subject.pos.x), toPix(subject.pos.y), txt, this.Font);
		this.textObj.setOrigin(0,0);
		this.textObj.setDepth(1);
	}
	private destroy() {
		this.textObj.destroy();
	}

	public addOffset(i: number) {
		this.offset = i*12;
	}

	public showDamage() {
		this.textObj.setDepth(3);
		this.parentScene.tweens.add({
			targets: this.textObj,
			ease: 'Cubic.easeInOut',
			duration: 160,
			repeat: 0,
			yoyo: false,
			x: { from: this.textObj.x, to:this.textObj.x },
			y: { from: this.textObj.y-this.offset, to: this.textObj.y - 30 - this.offset }
		});
		setTimeout(() => {
			this.destroy();
		},250);
	};
}