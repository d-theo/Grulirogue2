import {SceneName} from './scenes.constants';
import {createMap} from '../map/map-generator';

class GameScene extends Phaser.Scene {
	player: Phaser.GameObjects.Sprite;
	cursors: any;

	constructor() {
    super({
			key: SceneName.Game
		});
	}
	
	preload() {
		const {tilemap, mapObject} = createMap();
		this.make.tilemap({data: tilemap});
		this.load.image('desert', '/assets/tilemaps/desert.png');
		this.load.image('hero', '/assets/sprites/hero.png');
	}

	create() {
		var map:Phaser.Tilemaps.Tilemap = this.make.tilemap({ key: 'map' });

		var tileset:Phaser.Tilemaps.Tileset = map.addTilesetImage('desert');

		var layer:Phaser.Tilemaps.StaticTilemapLayer = map.createStaticLayer(0, tileset, 0, 0);

		this.player = this.add.sprite(32, 32, 'player');
		this.cursors = this.input.keyboard.createCursorKeys();

		this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    	this.cameras.main.startFollow(this.player, false);
	}

	update(time: number, delta:number) {
		this.player.angle += 1;
		if (this.cursors.left.isDown) {
			this.player.x -= 5;
		}
		if (this.cursors.right.isDown) {
			this.player.x += 5;
		}
		if (this.cursors.down.isDown) {
			this.player.y += 5;
		}
		if (this.cursors.up.isDown) {
			this.player.y -= 5;
		}
	}
}

export default GameScene;