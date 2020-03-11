import {SceneName} from './scenes.constants';
import {Game as GameEngine} from '../game/game';
import { toPix } from '../maths/maps-utils';
import { Coordinate } from '../game/utils/coordinate';
import { TilemapVisibility } from '../map/TilemapVisibility';
import { GameEventType } from '../game/events/events';
import { MessageResponseStatus } from '../game/utils/types';
import { TilemapItems } from '../map/tilemap-items';
import { addBiome } from '../generation/map_decoration';

class GameScene extends Phaser.Scene {
	hero: any;
	cursors: any;
	tilemap;
	layer;
	delta;
	moveAllowed = true;
	gameEngine: GameEngine;
	heroPosition: Coordinate
	tilemapVisibility: TilemapVisibility;
	tilemapItems: TilemapItems;
	constructor() {
    super({
			key: SceneName.Game
		});
	}
	
	preload() {
		this.gameEngine = new GameEngine();
		this.gameEngine.reInitLevel();

		this.heroPosition = toPix(this.gameEngine.hero.pos);
		this.tilemap = this.gameEngine.tilemap.tilemap;
		this.load.image('terrain', '/assets/tilemaps/greece.png');
		this.load.image('terrain2', '/assets/tilemaps/greece2.png');
		this.load.image('hero', '/assets/sprites/hero.png');
	}

	create() {
		var map:Phaser.Tilemaps.Tilemap = this.make.tilemap({data: this.tilemap, key: 'map'});
		var tileset:Phaser.Tilemaps.Tileset = map.addTilesetImage('terrain2', 'terrain2', 32,32, 1, 2);
		var layer = map.createDynamicLayer(0, tileset, 0, 0) as any;

		const itemLayer = map.createBlankDynamicLayer("Items", tileset, undefined, undefined, undefined, undefined).fill(-1);
		this.tilemapItems = new TilemapItems(itemLayer, this.gameEngine.tilemap.graph.rooms);
		this.addItems();

		const shadowLayer = map.createBlankDynamicLayer("Shadow", tileset, undefined, undefined, undefined, undefined).fill(this.gameEngine.currentTerrain().Void);
		this.tilemapVisibility = new TilemapVisibility(shadowLayer);

		this.hero = this.physics.add.sprite(this.heroPosition.x, this.heroPosition.y, 'hero');
		this.hero.setOrigin(0,0);
		this.cursors = this.input.keyboard.createCursorKeys();
		this.layer = layer;
		this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
		this.cameras.main.startFollow(this.hero, false);
	}

	addItems() {
		this.tilemapItems.placeItems(this.gameEngine.currentTerrain().Deco4, (pos) => {
			this.gameEngine.tilemap.getAt(pos).type = this.gameEngine.currentTerrain().Deco;
		});
		this.tilemapItems.placeItem(this.gameEngine.currentTerrain().Deco5, (pos) => {
			this.gameEngine.tilemap.getAt(pos).type = this.gameEngine.currentTerrain().Deco;
		});
		this.tilemapItems.placeItem(this.gameEngine.currentTerrain().Deco3, (pos) => {
			this.gameEngine.tilemap.getAt(pos).type = this.gameEngine.currentTerrain().Deco;
		});
		this.tilemapItems.placeItem(this.gameEngine.currentTerrain().Deco2, (pos) => {
			this.gameEngine.tilemap.getAt(pos).type = this.gameEngine.currentTerrain().Deco;
		});
		this.tilemapItems.placeItem(this.gameEngine.currentTerrain().Deco1, (pos) => {
			this.gameEngine.tilemap.getAt(pos).type = this.gameEngine.currentTerrain().Deco;
		});
	}

	moveTo(pos) {
		let p = {
			targets: this.hero,
			ease: 'Linear',
			duration: 50,
			repeat: 0,
			yoyo: false
		}
		let newPos: Coordinate = {x:-1, y:-1};
		let heroPos = this.gameEngine.hero.pos;
		let dx = 0;
		let dy = 0;
		switch(pos){
			case 'left': 
				newPos = {x: heroPos.x-1, y: heroPos.y}
				dx = -32;
				p['x'] = { from: this.hero.x, to: this.hero.x-32 };
				break;
			case'right':
				newPos = {x: heroPos.x+1, y: heroPos.y}
				p['x'] = { from: this.hero.x, to: this.hero.x+32 };
				dx = 32;
				break;
			case 'down':
				newPos = {x: heroPos.x, y: heroPos.y+1}
				p['y'] = { from: this.hero.y, to: this.hero.y+32 };
				dy = 32;
				break;
			case 'up':
				newPos = {x: heroPos.x, y: heroPos.y-1}
				p['y'] = { from: this.hero.y, to: this.hero.y-32 };
				dy = -32;
				break;
		}
		const res = this.gameEngine.handleMessage({
			type: GameEventType.PlayerMove,
			data: {
				to: newPos
			}
		});
		if (res.status !== MessageResponseStatus.Ok) {
			return;
		} else {
			this.tweens.add(p);
			//this.hero.x += dx;
			//this.hero.y += dy;
			this.delta = 0;
			this.moveAllowed = false;
		}
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
		this.tilemapVisibility.setFogOfWar2(this.gameEngine.tilemap.tiles);
	}
}

export default GameScene;