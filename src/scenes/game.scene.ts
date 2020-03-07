import {SceneName} from './scenes.constants';
import {createMap} from '../map/map-generator';

class GameScene extends Phaser.Scene {
	hero: any;
	cursors: any;
	tilemap;
	mapObject;
	layer;
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
		//var map:Phaser.Tilemaps.Tilemap = this.make.tilemap({data: this.tilemap, key: 'map'});
		var map:Phaser.Tilemaps.Tilemap = this.make.tilemap({data: [[2,2,2],[2,2,2],[1,1,1]], key: 'map'});
		var tileset:Phaser.Tilemaps.Tileset = map.addTilesetImage('terrain');
		var layer:Phaser.Tilemaps.StaticTilemapLayer = map.createStaticLayer(0, tileset, 0, 0);

		this.hero = this.physics.add.sprite(32, 32, 'hero').setBounce(1,1);
		this.hero.body.onCollide = true;
		this.hero.setCollideWorldBounds(true);
		this.cursors = this.input.keyboard.createCursorKeys();
		map.setCollision([1]);
		this.physics.add.collider(this.hero.body as any, layer as any, () => console.log('col'), null, this);
		const debugGraphics:any = this.add.graphics();
		layer.renderDebug(debugGraphics, {
			tileColor: null,
			collidingTileColor: new Phaser.Display.Color(0, 0, 48, 255), // Color of colliding tiles
			faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
		});
		this.hero.body.onCollide = true;
    	this.hero.on('collide', function () { console.log('collided'); });
		this.layer = layer;
		this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    	this.cameras.main.startFollow(this.hero, false);
	}

	update(time: number, delta:number) {
		var c = this.physics.collide(this.hero.body, this.layer);
		this.hero.angle += 1;
		this.hero.body.setVelocityX(1);
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