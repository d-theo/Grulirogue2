import { Scene } from "phaser";
import { toPix } from "../maths/maps-utils";
import { Coordinate } from "../game/utils/coordinate";
const Rainbow = require('rainbowvis.js');
export class UIDamages {
	textObj: Phaser.GameObjects.Text;
	offset: number = 0;
	Font = {
		fontSize: '10px',
		fontFamily: 'square',
		color: '#FFFFFF',
		wordWrap: {
		  width: 310
		}
	  };
	txt;
	rainbow = new Rainbow();
	constructor(private readonly parentScene: Scene,
				 public subject: {name: string, pos: Coordinate},
				 private number) {
		this.rainbow.setSpectrum('white', 'yellow', 'orange' ,'red'); 
		this.rainbow.setNumberRange(1, 25);
		if (number == 0) {
			this.txt = 'miss';
			this.Font.fontSize = '8px';
		} else if (number < 0) {
			this.txt = ''+Math.abs(number);
			this.Font.color =  `#${this.rainbow.colourAt(Math.abs(number))}`;
		} else if (number > 0) {
			this.txt = '+'+number;
			this.Font.color = '#83F52C'
		}
	}

	public addOffset(i: number) {
		this.offset = i*12;
	}

	public showDamage(option: {delay: number} = {delay: 0}) {
		setTimeout(() => {
			this.textObj = this.parentScene.add.text(toPix(this.subject.pos.x), toPix(this.subject.pos.y), this.txt, this.Font);
			this.textObj.setOrigin(0,0);
			this.textObj.setDepth(3);
			this.parentScene.tweens.add({
				targets: this.textObj,
				ease: 'Linear',
				duration: 500,
				repeat: 0,
				yoyo: false,
				onComplete: () => this.textObj.destroy(),
				x: { from: this.textObj.x, to:this.textObj.x },
				y: { from: this.textObj.y-this.offset, to: this.textObj.y - 30 - this.offset }
			});
		}, option.delay);
	};
}