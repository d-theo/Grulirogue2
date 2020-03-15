import {SceneName} from './scenes.constants';
import {Game as GameEngine} from '../game/game';
import { toPix } from '../maths/maps-utils';
import { Coordinate } from '../game/utils/coordinate';
import { TilemapVisibility } from '../map/TilemapVisibility';
import { GameEventType } from '../game/events/events';
import { MessageResponseStatus } from '../game/utils/types';
import { TilemapItems } from '../map/tilemap-items';
import { addBiome } from '../generation/map_decoration';
import { Monster } from '../game/monsters/monster';
import { monstersSpawn } from '../game/monsters/monster-spawn';

class GameScene extends Phaser.Scene {
	hero: any;
	gameMonsters: {monster: Monster, sprite: any}[] = [];
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
		console.log('preload start');
		this.gameEngine = new GameEngine();
		console.log('game created');
		this.gameEngine.reInitLevel();
		console.log('level created');

		this.heroPosition = toPix(this.gameEngine.hero.pos);
		this.tilemap = this.gameEngine.tilemap.tilemap;
		this.load.image('terrain', '/assets/tilemaps/greece.png');
		this.load.image('terrain2', '/assets/tilemaps/greece2.png');
		this.load.image('hero', '/assets/sprites/hero.png');
		this.load.image('Snake', '/assets/sprites/snake.png');
		this.load.image('Boar', '/assets/sprites/boar.png');
		this.load.image('Centaurus', '/assets/sprites/centaurus.png');
		console.log('preload');
	}

	create() {
		var map:Phaser.Tilemaps.Tilemap = this.make.tilemap({data: this.tilemap, key: 'map'});
		var tileset:Phaser.Tilemaps.Tileset = map.addTilesetImage('terrain2', 'terrain2', 32,32, 1, 2);
		var layer = map.createDynamicLayer(0, tileset, 0, 0) as any;

		this.layer = layer;

		const itemLayer = map.createBlankDynamicLayer("Items", tileset, undefined, undefined, undefined, undefined).fill(-1);
		this.tilemapItems = new TilemapItems(itemLayer, this.gameEngine.tilemap.graph.rooms);
		this.addItems();
		this.addMonsters();
		const shadowLayer = map.createBlankDynamicLayer("Shadow", tileset, undefined, undefined, undefined, undefined).fill(this.gameEngine.currentTerrain().Void);
		this.tilemapVisibility = new TilemapVisibility(shadowLayer);
		
		this.hero = this.physics.add.sprite(this.heroPosition.x, this.heroPosition.y, 'hero');
		this.hero.setOrigin(0,0);
		
		this.cursors = this.input.keyboard.createCursorKeys();
		this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
		this.cameras.main.startFollow(this.hero, false);
	}

	addMonsters() {
		const mobToPlace = this.gameEngine.monsters.monstersArray();
		for (const mob of mobToPlace) {
			const m = this.physics.add.sprite(toPix(mob.pos.x), toPix(mob.pos.y), mob.name);
			m.setOrigin(0,0);
			this.gameMonsters.push({monster: mob, sprite: m});
		}
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

	moveMonsters() {
		for(const m of this.gameMonsters) {
			const delta = this.adjustSpriteAndLogicPosition(m.sprite, m.monster);
			if (delta) {
				this.moveTo2(
					m.sprite,
					{x: m.sprite.x, y: m.sprite.y},
					{x: m.sprite.x+delta.x, y: m.sprite.y+delta.y},
				)
			}
		}
	}

	adjustSpriteAndLogicPosition(sprite, movable) {
		const dx = toPix(movable.pos.x) - sprite.x;
		const dy = toPix(movable.pos.y) - sprite.y;
		if (dx !== 0 || dy !== 0) {
			return {x: dx,y: dy};
		} else {
			return null;
		}
	}

	moveTo2(target, posFrom: Coordinate, posTo: Coordinate) {
		let p = {
			targets: target,
			ease: 'Linear',
			duration: 50,
			repeat: 0,
			yoyo: false,
			x: { from: posFrom.x, to: posTo.x },
			y: { from: posFrom.y, to: posTo.y }
		}
		this.tweens.add(p);
	}

	update(time: number, delta:number) {
		this.hero.setVelocity(0,0);
		if (!this.moveAllowed) {
			this.delta += delta;
			if (this.delta > 300) {
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
		this.moveMonsters();
		this.tilemapVisibility.setFogOfWar2(this.gameEngine.tilemap.tiles);
		this.tilemapVisibility.setFogOfWar1(this.gameEngine.tilemap.tiles, this.gameMonsters);
	}
}

export default GameScene;