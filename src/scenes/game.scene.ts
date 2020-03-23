import {SceneName} from './scenes.constants';
import {Game as GameEngine} from '../game/game';
import { toPix } from '../maths/maps-utils';
import { Coordinate } from '../game/utils/coordinate';
import { TilemapVisibility } from '../map/TilemapVisibility';
import { TilemapItems } from '../map/tilemap-items';
import { gameBus, sightUpdated, monsterMoved, playerMoved, playerActionMove, doorOpened, gameStarted } from '../eventBus/game-bus';
import { UIEntity } from '../UIEntities/ui-entity';

class GameScene extends Phaser.Scene {
	hero: UIEntity;
	gameMonsters: { [id: string]:  UIEntity} = {};
	cursors: any;
	tilemap;
	layer;
	delta;
	moveAllowed = true;
	gameEngine: GameEngine;
	tilemapVisibility: TilemapVisibility;
	tilemapItems: TilemapItems;
	tilemapFloor: TilemapItems;

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

		this.tilemap = this.gameEngine.tilemap.tilemap;
		this.load.image('terrain', '/assets/tilemaps/greece.png');
		this.load.image('terrain2', '/assets/tilemaps/greece2.png');
		this.load.image('hero', '/assets/sprites/hero.png');
		this.load.image('health', '/assets/sprites/health.png');
		this.load.image('healthfull', '/assets/sprites/healthfull.png');
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
		this.tilemapFloor = new TilemapItems(this.layer, this.gameEngine.tilemap.graph.rooms);

		const itemLayer = map.createBlankDynamicLayer("Items", tileset, undefined, undefined, undefined, undefined).fill(-1);
		this.tilemapItems = new TilemapItems(itemLayer, this.gameEngine.tilemap.graph.rooms);
		this.addDecorations();
		this.placeMonsters();
		const shadowLayer = map.createBlankDynamicLayer("Shadow", tileset, undefined, undefined, undefined, undefined).fill(this.gameEngine.currentTerrain().Void);
		this.tilemapVisibility = new TilemapVisibility(shadowLayer);
		
		this.hero = new UIEntity(this, this.gameEngine.hero, 'hero');

		this.cursors = this.input.keyboard.createCursorKeys();
		this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
		this.cameras.main.startFollow(this.hero.sprite, false);

		this.initGameEvents();

		// hack ! 
		setTimeout(() => {
			gameBus.publish(gameStarted({}));
			this.tilemapVisibility.setFogOfWar2(this.gameEngine.tilemap.tiles);
			this.tilemapVisibility.setFogOfWar1(this.gameEngine.tilemap.tiles, this.gameMonsters);
		}, 50);

		//this.scene.launch(SceneName.Hud);
	}

	initGameEvents() {
		gameBus.subscribe(sightUpdated, event => {
			this.tilemapVisibility.setFogOfWar2(this.gameEngine.tilemap.tiles);
			this.tilemapVisibility.setFogOfWar1(this.gameEngine.tilemap.tiles, this.gameMonsters);
		});
		gameBus.subscribe(monsterMoved, event => {
			const {monster} = event.payload;
			const m = this.gameMonsters[monster.id];
			this.hero.update();
			m.move();
		});
		gameBus.subscribe(playerMoved, event => {
			this.hero.move();
		});
		gameBus.subscribe(doorOpened, event => {
			const {pos} = event.payload;
			this.layer.putTileAt(this.gameEngine.currentTerrain().DoorOpened, pos.x, pos.y);
		});
	}

	placeMonsters() {
		const mobToPlace = this.gameEngine.monsters.monstersArray();
		for (const mob of mobToPlace) {
			const monster = new UIEntity(this, mob, mob.name)
			this.gameMonsters[mob.id] = monster;
		}
	}

	addDecorations() {
		this.tilemapItems.placeItems(this.gameEngine.currentTerrain().Deco4, (pos) => {
			this.gameEngine.tilemap.getAt(pos).type = this.gameEngine.currentTerrain().Deco;
		});
		this.tilemapItems.placeItem(this.gameEngine.currentTerrain().Deco5, 0.5 ,(pos) => {
			this.gameEngine.tilemap.getAt(pos).type = this.gameEngine.currentTerrain().Deco;
		});
		this.tilemapItems.placeItem(this.gameEngine.currentTerrain().Deco3, 0.5 ,(pos) => {
			this.gameEngine.tilemap.getAt(pos).type = this.gameEngine.currentTerrain().Deco;
		});
		this.tilemapItems.placeItem(this.gameEngine.currentTerrain().Deco2, 0.5 ,(pos) => {
			this.gameEngine.tilemap.getAt(pos).type = this.gameEngine.currentTerrain().Deco;
		});
		this.tilemapItems.placeItem(this.gameEngine.currentTerrain().Deco1, 0.5 ,(pos) => {
			this.gameEngine.tilemap.getAt(pos).type = this.gameEngine.currentTerrain().Deco;
		});
		this.tilemapFloor.placeItem(this.gameEngine.currentTerrain().FloorAlt1, 1,null);
		this.tilemapFloor.placeItem(this.gameEngine.currentTerrain().FloorAlt1, 1,null);
		this.tilemapFloor.placeItem(this.gameEngine.currentTerrain().FloorAlt2, 1,null);
		this.tilemapFloor.placeItem(this.gameEngine.currentTerrain().FloorAlt2, 1,null);
		this.tilemapFloor.placeItem(this.gameEngine.currentTerrain().FloorAlt3, 1,null);
		this.tilemapFloor.placeItem(this.gameEngine.currentTerrain().FloorAlt3, 1,null);
	}

	moveTo(pos) {
		let newPos: Coordinate = {x:-1, y:-1};
		let heroPos = this.gameEngine.hero.pos;
		switch(pos){
			case 'left': 
				newPos = {x: heroPos.x-1, y: heroPos.y}
				break;
			case'right':
				newPos = {x: heroPos.x+1, y: heroPos.y}
				break;
			case 'down':
				newPos = {x: heroPos.x, y: heroPos.y+1}
				break;
			case 'up':
				newPos = {x: heroPos.x, y: heroPos.y-1}
				break;
		}
		this.moveAllowed = false;
		this.delta = 0;
		gameBus.publish(playerActionMove({
			to: newPos
		}));
	}

	update(time: number, delta:number) {
		this.hero.sprite.setVelocity(0,0);
		if (!this.moveAllowed) {
			this.delta += delta;
			if (this.delta > 300) {
				this.moveAllowed = true;
			}
			return;
		}
		if (this.cursors.left.isDown) this.moveTo('left')
		if (this.cursors.right.isDown) this.moveTo('right')
		if (this.cursors.down.isDown) this.moveTo('down')
		if (this.cursors.up.isDown) this.moveTo('up')
	}
}

export default GameScene;