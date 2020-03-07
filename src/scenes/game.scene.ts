import {SceneName} from './scenes.constants';
import {createMap} from '../map/map-generator';

class GameScene extends Phaser.Scene {
	hero: Phaser.GameObjects.Sprite;
	cursors: any;
	tilemap;
	mapObject;
	constructor() {
    super({
			key: SceneName.Game
		});
	}
	
	preload() {
		const {tilemap, mapObject} = createMap();
		this.tilemap = tilemap;
		this.mapObject = mapObject;
		this.load.image('desert', '/assets/tilemaps/desert.png');
		this.load.image('terrain', '/assets/tilemaps/terrain.png');
		this.load.image('hero', '/assets/sprites/hero.png');
	}

	create() {
		var map:Phaser.Tilemaps.Tilemap = this.make.tilemap({data: this.tilemap, key: 'map'});
		var tileset:Phaser.Tilemaps.Tileset = map.addTilesetImage('terrain');
		var hero:Phaser.Tilemaps.StaticTilemapLayer = map.createStaticLayer(0, tileset, 0, 0);

		this.hero = this.add.sprite(32, 32, 'hero');
		this.cursors = this.input.keyboard.createCursorKeys();

		this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    	this.cameras.main.startFollow(this.hero, false);
	}

	update(time: number, delta:number) {
		this.hero.angle += 1;
		if (this.cursors.left.isDown) {
			this.hero.x -= 5;
		}
		if (this.cursors.right.isDown) {
			this.hero.x += 5;
		}
		if (this.cursors.down.isDown) {
			this.hero.y += 5;
		}
		if (this.cursors.up.isDown) {
			this.hero.y -= 5;
		}
	}
}

export default GameScene;