import {SceneName} from './scenes.constants';
import {createMap} from '../map/map-generator';

class GameScene extends Phaser.Scene {
	hero: any;
	cursors: any;
	tilemap;
	mapObject;
	layer;
	delta;
	moveAllowed = true;
	constructor() {
    super({
			key: SceneName.Game
		});
	}
	
	preload() {
		const {tilemap, mapObject} = createMap();
		this.tilemap = tilemap;
		this.mapObject = mapObject;
		this.load.image('terrain', '/assets/tilemaps/terrain.png');
		this.load.image('hero', '/assets/sprites/hero.png');
	}

	create() {
		var map:Phaser.Tilemaps.Tilemap = this.make.tilemap({data: this.tilemap, key: 'map'});

		var tileset:Phaser.Tilemaps.Tileset = map.addTilesetImage('terrain');

		var layer = map.createStaticLayer(0, tileset, 0, 0) as any;

		layer.setCollisionByProperty({ collide: true });
		this.hero = this.physics.add.sprite(16, 16, 'hero');

		this.cursors = this.input.keyboard.createCursorKeys();

		map.setCollision([1], true, true, layer);

		this.physics.add.collider(this.hero, layer, () => console.log('col'), null, null);

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