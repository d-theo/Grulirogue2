import {SceneName} from './scenes.constants';
import {createMap} from '../map/map-generator';
import {GreeceCreationParams} from '../map/terrain.greece';
import {Game} from '../game/game';

class GameScene extends Phaser.Scene {
	hero: any;
	cursors: any;
	tilemap;
	layer;
	delta;
	moveAllowed = true;
	game: Game;
	constructor() {
    super({
			key: SceneName.Game
		});
	}
	
	preload() {
		this.game = new Game();
		this.game.tilemap.startingPosition();
		this.tilemap = this.game.tilemap.tiles;
		
		this.load.image('terrain', '/assets/tilemaps/greece.png');
		this.load.image('hero', '/assets/sprites/hero.png');
	}

	create() {
		var map:Phaser.Tilemaps.Tilemap = this.make.tilemap({data: this.tilemap, key: 'map'});
		var tileset:Phaser.Tilemaps.Tileset = map.addTilesetImage('terrain');
		var layer = map.createDynamicLayer(0, tileset, 0, 0) as any;
		this.hero = this.physics.add.sprite(16, 16, 'hero');
		this.cursors = this.input.keyboard.createCursorKeys();
		this.layer = layer;
		this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
		this.cameras.main.startFollow(this.hero, false);
	}

	moveTo(pos) {
		this.delta = 0;
		this.moveAllowed = false;
		let p = {
			targets: this.hero,
			ease: 'Linear',
			duration: 50,
			repeat: 0,
			yoyo: false
		}
		
		switch(pos){
			case 'left': 
				p['x'] = { from: this.hero.x, to: this.hero.x-32 };
				break;
			case'right':
				p['x'] = { from: this.hero.x, to: this.hero.x+32 };
				//this.hero.x = this.hero.x+32;
				break;
			case 'down':
				p['y'] = { from: this.hero.y, to: this.hero.y+32 };
				break;
			case 'up':
				p['y'] = { from: this.hero.y, to: this.hero.y-32 };
				break;
		}
		this.tweens.add(p);
	}

	update(time: number, delta:number) {
		this.hero.setVelocity(0,0);
		if (!this.moveAllowed) {
			this.delta += delta;
			if (this.delta > 250) {
				this.moveAllowed = true;
			}
			return;
		}
		if (this.cursors.left.isDown) {
			this.moveTo('left')
		}
		if (this.cursors.right.isDown) {
			this.moveTo('right')
		}
		if (this.cursors.down.isDown) {
			this.moveTo('down')
		}
		if (this.cursors.up.isDown) {
			this.moveTo('up')
		}
	}
}

export default GameScene;