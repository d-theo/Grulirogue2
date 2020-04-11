import {SceneName} from './scenes.constants';
import {Game as GameEngine} from '../game/game';
import { Coordinate } from '../game/utils/coordinate';
import { TilemapVisibility } from '../map/TilemapVisibility';
import { TilemapItems } from '../map/tilemap-items';
import { gameBus, sightUpdated, monsterMoved, playerMoved, playerActionMove, doorOpened, gameStarted, playerAttackedMonster, playerAttemptAttackMonster, itemPickedUp, playerHealed, playerUseItem, itemDropped, logPublished, waitATurn, nextLevel, nextLevelCreated, xpHasChanged, playerChoseSkill, playerSetTrap, effectSet } from '../eventBus/game-bus';
import { UIEntity } from '../UIEntities/ui-entity';
import { Item } from '../game/entitybase/item';
import { UIItem } from '../UIEntities/ui-item';
import { PotionColors } from '../game/items/potion';
import { Hero } from '../game/hero/hero';
import { UIEffect } from '../UIEntities/ui-effect';

class GameScene extends Phaser.Scene {
	hero: UIEntity;
	target: any;
	gameMonsters: { [id: string]:  UIEntity} = {};
	gameItems: { [id: string]:  UIItem} = {};
	gameEffects: { [id: string]:  UIEffect} = {};
	cursors: any;
	tilemap;
	layer;
	delta;
	moveAllowed = true;
	gameEngine: GameEngine;
	tilemapVisibility: TilemapVisibility;
	tilemapItems: TilemapItems;
	tilemapFloor: TilemapItems;
	range: any;

	mode:'play' | 'select' = 'play';
	currentAction: 'fire' | null = null;
	actionContext: any;

	subs:any = [];
	constructor() {
    super({
			key: SceneName.Game
		});
	}
	
	preload() {
		this.gameEngine = GameEngine.getInstance();
		this.tilemap = this.gameEngine.tilemap.tilemap;
		this.load.image('terrain', '/assets/tilemaps/greece.png');
		this.load.image('terrain2', '/assets/tilemaps/greece2.png');
		this.load.image('hero', '/assets/sprites/hero.png');
		this.load.image('health', '/assets/sprites/health.png');
		this.load.image('healthfull', '/assets/sprites/healthfull.png');
		this.load.image('Snake', '/assets/sprites/snake.png');
		this.load.image('Boar', '/assets/sprites/boar.png');
		this.load.image('Centaurus', '/assets/sprites/centaurus.png');
		this.load.image('target', '/assets/sprites/target.png');

		this.load.image('Blowpipe', '/assets/sprites/blowpipe.png');
		this.load.image('Fist', '/assets/sprites/blowpipe.png');
		this.load.image('Slingshot', '/assets/sprites/slingshot.png');

		this.load.image('Slingshot', '/assets/sprites/armour-light.png');
		this.load.image('Slingshot', '/assets/sprites/armour-heavy.png');
		this.load.image('Spikes', '/assets/sprites/spikes.png');
		for (const c of PotionColors) {
			this.load.image(`potion-${c}`, `/assets/sprites/potion-${c}.png`);
		}
	}

	reInit() {
		this.gameEngine = GameEngine.getInstance();
		this.tilemap = this.gameEngine.tilemap.tilemap;
		this.subs = [];
		Object.values(this.gameMonsters).forEach(v => v.destroy())
		Object.values(this.gameItems).forEach(v => v.destroy())
		this.gameMonsters = {};
		this.gameItems = {};

		var map:Phaser.Tilemaps.Tilemap = this.make.tilemap({data: this.tilemap, key: 'map'});
		var tileset:Phaser.Tilemaps.Tileset = map.addTilesetImage('terrain2', 'terrain2', 32,32, 1, 2);
		var layer = map.createDynamicLayer(0, tileset, 0, 0) as any;

		this.layer = layer;
		this.tilemapFloor = new TilemapItems(this.layer, this.gameEngine.tilemap.graph.rooms);

		const itemLayer = map.createBlankDynamicLayer("Items", tileset, undefined, undefined, undefined, undefined).fill(-1);
		this.tilemapItems = new TilemapItems(itemLayer, this.gameEngine.tilemap.graph.rooms);
		this.addDecorations();
		this.placeMonsters();
		this.placeItems();
		const shadowLayer = map.createBlankDynamicLayer("Shadow", tileset, undefined, undefined, undefined, undefined).fill(this.gameEngine.currentTerrain().Void);
		this.tilemapVisibility = new TilemapVisibility(shadowLayer);
		
		this.hero = new UIEntity(this, this.gameEngine.hero, 'hero');
		this.target = this.physics.add.sprite(0, 0, 'target');
		this.target.setOrigin(0,0);
		this.input.on('pointermove', () => {
			this.target.setAlpha(0.9);
		});
		this.input.on('pointerup', this.handleMouseClick.bind(this));

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

		/*this.events.on('resume', (sys, data:{action: 'useItem', key: string, item: Item} | undefined) => {
			if (data) {
				gameBus.publish(playerUseItem({
					item: data.item,
					target: this.hero.subject as Hero,
					action: data.key,
					owner: this.hero.subject as Hero
				}));
			}
		});*/
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
		this.placeItems();
		const shadowLayer = map.createBlankDynamicLayer("Shadow", tileset, undefined, undefined, undefined, undefined).fill(this.gameEngine.currentTerrain().Void);
		this.tilemapVisibility = new TilemapVisibility(shadowLayer);
		
		this.hero = new UIEntity(this, this.gameEngine.hero, 'hero');
		this.target = this.physics.add.sprite(0, 0, 'target');
		this.target.setOrigin(0,0);
		this.input.on('pointermove', () => {
			this.target.setAlpha(0.9);
		});
		this.input.on('pointerup', this.handleMouseClick.bind(this));

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

		this.input.keyboard.on('keyup', (event) => {
			switch (event.key) {
				case 'i': return this.scene.pause().launch(SceneName.Inventory, this.gameEngine.hero.openBag());
				case 'f': 
					if (this.mode === 'play') {
						const mobs = this.gameEngine.getNearestAttackables();
						if (mobs.length === 0) {
							gameBus.publish(logPublished({data:'noting to attack'}));
						} else {
							gameBus.publish(logPublished({data:'who do you want to attack ?'}));
							const mob = mobs[0];
							this.target.alpha = 1;
							this.target.x = mob.pos.x * 32;
							this.target.y = mob.pos.y * 32;
							this.mode = 'select';
							this.currentAction = 'fire';
							this.actionContext = mobs;
						}
					} else if (this.mode === 'select') {
						const mob = this.gameEngine.getAttackable({
							x:this.target.x/32,
							y:this.target.y/32
						});
						if (mob) {
							gameBus.publish(playerAttemptAttackMonster({monster: mob}));
						}
						this.target.alpha = 0;
						this.mode = 'play';
						this.currentAction = null;
						this.actionContext = null;
					}
					break;
				case 'z': {
					if (this.mode === 'select' && this.currentAction === 'fire') {
						const last = this.actionContext.shift();
						this.actionContext.push(last);
						const mob = this.actionContext[0];
						this.target.alpha = 1;
						this.target.x = mob.pos.x * 32;
						this.target.y = mob.pos.y * 32;
					}
					break;
				}
				case 'Escape' : {
					gameBus.publish(logPublished({data:'forget that'}));
					this.mode = 'play';
					this.currentAction = null;
					break;
				}
				case 'w' : {
					gameBus.publish(waitATurn({}));
					break;
				}
				case '>':
					if (this.gameEngine.canGoToNextLevel()) {
						this.subs.forEach(s => s());
						gameBus.publish(nextLevel({}));
					}
					break;
			}
		});
		this.events.on('resume', (sys, data:{action: 'pickSkill'|'useItem', key: string, item: Item} | undefined) => {
			console.log(data);
			if (data && data.action === 'useItem') {
				gameBus.publish(playerUseItem({
					item: data.item,
					target: this.hero.subject as Hero,
					action: data.key,
					owner: this.hero.subject as Hero
				}));
			} else if (data && data.action === 'pickSkill') {
				gameBus.publish(playerChoseSkill({
					name: data.item.name
				}));
			}
		});
	}

	initGameEvents() {
		this.subs.push(gameBus.subscribe(sightUpdated, event => {
			this.tilemapVisibility.setFogOfWar2(this.gameEngine.tilemap.tiles);
			this.tilemapVisibility.setFogOfWar1(this.gameEngine.tilemap.tiles, this.gameMonsters);
		}));
		this.subs.push(gameBus.subscribe(monsterMoved, event => {
			const {monster} = event.payload;
			const m = this.gameMonsters[monster.id];
			this.hero.updateHp(true);
			m.move();
		}));
		this.subs.push(gameBus.subscribe(playerMoved, event => {
			this.hero.move();
		}));
		this.subs.push(gameBus.subscribe(doorOpened, event => {
			const {pos} = event.payload;
			this.layer.putTileAt(this.gameEngine.currentTerrain().DoorOpened, pos.x, pos.y);
		}));
		this.subs.push(gameBus.subscribe(playerAttackedMonster, event => {
			const {monster} = event.payload;
			this.gameMonsters[monster.id].updateHp();
		}));
		this.subs.push(gameBus.subscribe(itemPickedUp, event => {
			const {item} = event.payload;
			this.gameItems[item.id].pickedUp();
		}));
		this.subs.push(gameBus.subscribe(playerHealed, event => {
			this.hero.updateHp();
		}));
		this.subs.push(gameBus.subscribe(itemDropped, event => {
			const {item} = event.payload;
			this.gameItems[item.id] = new UIItem(this, item, item.skin);
		}));
		this.subs.push(gameBus.subscribe(xpHasChanged, event => {
			const {status} = event.payload;
			if (status === 'level_up') {
				this.scene.pause().launch(SceneName.SkillTreeScene, this.gameEngine.hero.heroSkills.AllSkills);
			}
		}));
		this.subs.push(gameBus.subscribe(effectSet, event => {
			const {name, type, pos} = event.payload;
			this.gameEffects[name] = new UIEffect(this, {name, pos}, type);
		}));
		gameBus.subscribe(nextLevelCreated, event => {
			this.reInit();
		});
	}

	placeMonsters() {
		const mobToPlace = this.gameEngine.monsters.monstersArray();
		for (const mob of mobToPlace) {
			const monster = new UIEntity(this, mob, mob.name)
			this.gameMonsters[mob.id] = monster;
		}
	}
	
	placeItems() {
		const itemsToPlace: Item[] = this.gameEngine.items.itemsArray();
		for (const i of itemsToPlace) {
			if (! this.gameEngine.tilemap.getAt(i.pos).isWalkable()) continue;
			if (this.gameEngine.tilemap.getAt(i.pos).isEntry) continue;
			if (this.gameEngine.tilemap.getAt(i.pos).isExit) continue;
			const item = new UIItem(this, i, i.skin);
			this.gameItems[i.id] = item;
		}
	}

	addDecorations() {
		this.tilemapItems.placeItems(this.gameEngine.currentTerrain().Deco4, (pos) => {
			this.gameEngine.tilemap.getAt(pos).type = this.gameEngine.currentTerrain().Deco;
		});
		this.tilemapItems.placeItem(this.gameEngine.currentTerrain().Deco5, 0.7 ,(pos) => {
			this.gameEngine.tilemap.getAt(pos).type = this.gameEngine.currentTerrain().Deco;
		});
		this.tilemapItems.placeItem(this.gameEngine.currentTerrain().Deco3, 0.7 ,(pos) => {
			this.gameEngine.tilemap.getAt(pos).type = this.gameEngine.currentTerrain().Deco;
		});
		this.tilemapItems.placeItem(this.gameEngine.currentTerrain().Deco2, 0.7 ,(pos) => {
			this.gameEngine.tilemap.getAt(pos).type = this.gameEngine.currentTerrain().Deco;
		});
		this.tilemapItems.placeItem(this.gameEngine.currentTerrain().Deco1, 0.7 ,(pos) => {
			this.gameEngine.tilemap.getAt(pos).type = this.gameEngine.currentTerrain().Deco;
		});
		this.tilemapFloor.placeItem(this.gameEngine.currentTerrain().FloorAlt1, 1,null);
		this.tilemapFloor.placeItem(this.gameEngine.currentTerrain().FloorAlt1, 1,null);
		this.tilemapFloor.placeItem(this.gameEngine.currentTerrain().FloorAlt2, 1,null);
		this.tilemapFloor.placeItem(this.gameEngine.currentTerrain().FloorAlt2, 1,null);
		this.tilemapFloor.placeItem(this.gameEngine.currentTerrain().FloorAlt3, 1,null);
		this.tilemapFloor.placeItem(this.gameEngine.currentTerrain().FloorAlt3, 1,null);
	}

	handleMouseClick() {
		const worldPoint: any = this.input.activePointer.positionToCamera(this.cameras.main);
		const tile = this.layer.getTileAtWorldXY(worldPoint.x, worldPoint.y);
		this.target.x = tile.x * 32;
		this.target.y = tile.y * 32;
		const mob = this.gameEngine.getAttackable({x:tile.x, y:tile.y});
		if (mob) {
			console.log(mob);
			gameBus.publish(playerAttemptAttackMonster({monster: mob}));
		}
		if (!mob) {
			gameBus.publish(playerSetTrap({}));
			//const t = this.gameEngine.tilemap.getAt({x:tile.x, y:tile.y});
			/*gameBus.publish(playerUseItem({
				item: this.gameItems[k].subject,
				target: this.hero.subject as Hero
			}));*/
		}
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
		this.target.setAlpha(0);
		gameBus.publish(playerActionMove({
			to: newPos
		}));
	}

	update(time: number, delta:number) {
		this.hero.sprite.setVelocity(0,0);
		if (!this.moveAllowed) {
			this.delta += delta;
			if (this.delta > 200) {
				this.moveAllowed = true;
			}
			return;
		}

		if (this.mode === 'play') {
			var isUpDown = this.cursors.up.isDown;
			var isDownDown = this.cursors.down.isDown;
			var isLeftDown = this.cursors.left.isDown;
			var isRightDown = this.cursors.right.isDown;
			if (isUpDown) 	 return this.moveTo('up');
			if (isDownDown)  return this.moveTo('down');
			if (isLeftDown)  return this.moveTo('left');
			if (isRightDown) return this.moveTo('right');
			
			Object.values(this.gameMonsters).forEach(v => v.move());

			const worldPoint: any = this.input.activePointer.positionToCamera(this.cameras.main);
			const tile = this.layer.getTileAtWorldXY(worldPoint.x, worldPoint.y);
			this.target.x = tile.x * 32;
			this.target.y = tile.y * 32;
			if (this.gameEngine.getAttackable({x:tile.x, y:tile.y})) {
				this.showRange();
			} else {
				this.hideRange();
			}
		}
	}

	hideRange() {
		if (this.range == null) return;
		this.tilemapVisibility.hideRange(this.range);
		this.range = null;
	}

	showRange() {
		if (this.range) return;
		this.range = this.gameEngine.tilemap.getSightAround({
			from : this.gameEngine.hero.pos,
			range: this.gameEngine.hero.weapon.maxRange
		});
		this.tilemapVisibility.showRange(this.range);
	}
}

export default GameScene;