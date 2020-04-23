import {SceneName} from './scenes.constants';
import {Game as GameEngine} from '../game/game';
import { Coordinate } from '../game/utils/coordinate';
import { TilemapVisibility } from '../map/TilemapVisibility';
import { gameBus, sightUpdated, monsterMoved, playerMoved, playerActionMove, doorOpened, gameStarted, playerAttackedMonster, playerAttemptAttackMonster, itemPickedUp, playerHealed, playerUseItem, itemDropped, logPublished, waitATurn, nextLevel, nextLevelCreated, xpHasChanged, playerChoseSkill, effectSet, effectUnset, playerUseSkill, playerReadScroll, heroGainedXp, gameOver, monsterDead, itemEquiped, gameFinished } from '../eventBus/game-bus';
import { UIEntity } from '../UIEntities/ui-entity';
import { Item } from '../game/entitybase/item';
import { UIItem } from '../UIEntities/ui-item';
import { Hero } from '../game/hero/hero';
import { UIEffect } from '../UIEntities/ui-effect';
import { SkillNames } from '../game/hero/hero-skills';
import { Scroll } from '../game/items/scroll';
import { line } from '../game/tilemap/sight';
import { Terrain } from '../map/terrain.greece';
import { MapEffect } from '../map/map-effect';

class GameScene extends Phaser.Scene {
	hero: UIEntity;
	target: Phaser.GameObjects.Sprite;
	gameMonsters: { [id: string]:  UIEntity} = {};
	gameItems: { [id: string]:  UIItem} = {};
	gameEffects: { [id: string]:  UIEffect} = {};
	
	cursors: any;
	tilemap;
	layer;
	layer2;

	delta: number;
	moveAllowed = true;

	gameEngine: GameEngine;
	tilemapVisibility: TilemapVisibility;

	mode:'play' | 'select' = 'play';
	currentAction: 'fire' | 'scroll_chose_location' | 'scroll_chose_target' | 'scroll_chose_item' | null = null;
	actionContext: any;
	range;

	subs:any = [];
	constructor() {
    super({
			key: SceneName.Game
		});
	}
	
	preload() {
		this.gameEngine = GameEngine.getInstance();
		this.tilemap = this.gameEngine.tilemap.tilemap;
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
		var tileset:Phaser.Tilemaps.Tileset = map.addTilesetImage('terrain2', 'terrain2', 32,32, 1, 2, 0);
		this.layer = map.createDynamicLayer(0, tileset, 0, 0) as any;
		this.layer2 = map.createBlankDynamicLayer('additions', tileset);
		this.layer2.putTilesAt(this.gameEngine.tilemap.additionalLayer, 0, 0);
		map.convertLayerToStatic(this.layer2);

		this.placeMonsters();
		this.placeItems();

		const shadowLayer = map.createBlankDynamicLayer("Shadow", tileset, undefined, undefined, undefined, undefined).fill(Terrain.Void);
		this.tilemapVisibility = new TilemapVisibility(shadowLayer);
		
		this.hero = new UIEntity(this, this.gameEngine.hero, 'hero');
		this.target = this.physics.add.sprite(0, 0, 'target');
		this.target.setOrigin(0,0);
		this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
		this.cameras.main.startFollow(this.hero.sprite, false);

		this.initGameEvents();

		// hack ! 
		setTimeout(() => {
			gameBus.publish(gameStarted({}));
			this.tilemapVisibility.setFogOfWar2(this.gameEngine.tilemap.tiles);
			this.tilemapVisibility.setFogOfWar1(this.gameEngine.tilemap.tiles, this.gameMonsters);
		}, 50);
	}

	create() {
		this.reInit();
		/*this.input.on('pointermove', () => {
			this.target.setAlpha(0.9);
		});*/
		this.input.on('pointerup', this.handleMouseClick.bind(this));

		this.cursors = this.input.keyboard.createCursorKeys();
		this.input.keyboard.on('keyup', (event) => {
			switch (event.key) {
				case 'ArrowUp': 
					if (this.mode === 'select') this.target.y -= 32;
					if (this.currentAction === 'fire') this.showRange(this.gameEngine.hero, {
						x:this.target.x/32,
						y:this.target.y/32
					});
					break;
				case 'ArrowDown': 
					if (this.mode === 'select') this.target.y += 32;
					if (this.currentAction === 'fire') this.showRange(this.gameEngine.hero, {
						x:this.target.x/32,
						y:this.target.y/32
					});
					break;
				case 'ArrowLeft': 
					if (this.mode === 'select') this.target.x -= 32;
					if (this.currentAction === 'fire') this.showRange(this.gameEngine.hero, {
						x:this.target.x/32,
						y:this.target.y/32
					});
					break;
				case 'ArrowRight': 
					if (this.mode === 'select') this.target.x += 32;
					if (this.currentAction === 'fire') this.showRange(this.gameEngine.hero, {
						x:this.target.x/32,
						y:this.target.y/32
					});
					break;
				case 'i': return this.scene.pause().launch(SceneName.Inventory, {config:this.gameEngine.hero.openBag(), action: 'useItem'});
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
							this.showRange(this.gameEngine.hero, mob.pos);
						}
					} else if (this.mode === 'select') {
						this.hideRange();
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
				case 'Enter': {
					const pos = {
						x:this.target.x/32,
						y:this.target.y/32
					}
					if (this.mode === 'select' && this.currentAction === 'scroll_chose_location') {
						const t = this.gameEngine.tilemap.getAt(pos);
						if (!t.isWalkable()) return;
						gameBus.publish(playerReadScroll({
							item: this.actionContext as Scroll,
							target: pos,
						}));
						this.mode = 'play';
						this.target.alpha = 0;
					}
					else if (this.mode === 'select' && this.currentAction === 'scroll_chose_target') {
						let t;
						if (this.gameEngine.hero.pos.x === pos.x && this.gameEngine.hero.pos.y === pos.y) {
							t = this.gameEngine.hero;
						} else {
							t = this.gameEngine.getAttackable(pos);
							if (!t) return;
						}
						this.mode = 'play';
						this.target.alpha = 0;
						gameBus.publish(playerReadScroll({
							item: this.actionContext as Scroll,
							target: t,
						}));
					}
					break;
				}
				case 'g': {
					if (this.mode === 'play' && this.gameEngine.hero.heroSkills.usableSkills().length > 0) {
						this.scene.pause().launch(SceneName.SkillTreeScene, {data: this.gameEngine.hero.heroSkills.usableSkills(), action: 'useSkill'});
					}
				}	
				case 'z': {
					if (this.mode === 'select' && this.currentAction === 'fire') {
						const last = this.actionContext.shift();
						this.actionContext.push(last);
						const mob = this.actionContext[0];
						this.target.alpha = 1;
						this.target.x = mob.pos.x * 32;
						this.target.y = mob.pos.y * 32;
						this.showRange(this.gameEngine.hero, mob);
					}
					break;
				}
				case 'Escape' : {
					gameBus.publish(logPublished({data:'forget that'}));
					this.mode = 'play';
					this.currentAction = null;
					this.hideRange();
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
		this.events.on('resume', (sys, data:{action: 'useSkill'|'pickSkill'|'useItem'|'pickItem', key: string, item: Item} | undefined) => {
			if (data && data.action === 'pickItem') {
				if (this.currentAction === 'scroll_chose_item') {
					gameBus.publish(playerReadScroll({
						item: this.actionContext as Scroll,
						target: this.gameEngine.hero.getItem(data.item)
					}));
				}
			}
			if (data && data.action === 'useItem') {
				if (data.key === 'r') {
					const scroll = data.item as Scroll;
					const type = scroll.effect.type[0];
					if (type === 'chose_location') {
						gameBus.publish(logPublished({data:'where do you want to target ?'}));
						this.mode = 'select';
						this.currentAction = 'scroll_chose_location';
						this.actionContext = scroll;
						this.target.alpha = 1;
						this.target.x = this.hero.subject.pos.x * 32;
						this.target.y = this.hero.subject.pos.y * 32;
					} else if (type === 'chose_target') {
						gameBus.publish(logPublished({data:'who do you want to target ?'}));
						this.mode = 'select';
						this.currentAction = 'scroll_chose_target';
						this.actionContext = scroll;
						this.target.alpha = 1;
						this.target.x = this.hero.subject.pos.x * 32;
						this.target.y = this.hero.subject.pos.y * 32;
					} else if (type === 'chose_armour') {
						gameBus.publish(logPublished({data:'Select an item'}));
						this.currentAction = 'scroll_chose_item';
						this.actionContext = scroll;
						setTimeout(() => {
							this.scene.pause().launch(SceneName.Inventory, {config: this.gameEngine.hero.openBag(['Armours']), action: 'pickItem'});
						},500);
					} else if (type === 'chose_weapon') {
						gameBus.publish(logPublished({data:'Select a weapon'}));
						this.currentAction = 'scroll_chose_item';
						this.actionContext = scroll;
						setTimeout(() => {
							this.scene.pause().launch(SceneName.Inventory, {config: this.gameEngine.hero.openBag(['Weapons']), action: 'pickItem'});
						},500);
					} else if (type === 'chose_item') {
						gameBus.publish(logPublished({data:'Select an item'}));
						this.currentAction = 'scroll_chose_item';
						this.actionContext = scroll;
						setTimeout(() => {
							this.scene.pause().launch(SceneName.Inventory, {config: this.gameEngine.hero.openBag(['Weapons', 'Armours', 'Consumables']), action: 'pickItem'});
						},500);
					} else {
						gameBus.publish(playerReadScroll({
							item: scroll as Scroll,
							target: null,
						}));
					}
					return;
				}
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
			} else if (data && data.action === 'useSkill') {
				gameBus.publish(playerUseSkill({
					name: data.item.name as SkillNames
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
			this.tilemapVisibility.setFogOfWar1(this.gameEngine.tilemap.tiles, this.gameMonsters);
		}));
		this.subs.push(gameBus.subscribe(monsterDead, event => {
			const {monster} = event.payload;
			const m = this.gameMonsters[monster.id];
			m.updateHp();
		}));
		this.subs.push(gameBus.subscribe(playerMoved, event => {
			this.hero.move();
		}));
		this.subs.push(gameBus.subscribe(doorOpened, event => {
			const {pos} = event.payload;
			this.layer.putTileAt(Terrain.DoorOpened, pos.x, pos.y);
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
				this.scene.pause().launch(SceneName.SkillTreeScene, {data: this.gameEngine.hero.heroSkills.AllSkills, action: 'pickSkill'});
			}
		}));
		this.subs.push(gameBus.subscribe(effectSet, event => {
			switch (event.payload.type) {
				case MapEffect.Spike:
					return this.gameEffects[event.payload.name] = new UIEffect(this, {name: event.payload.name, pos: event.payload.pos}, event.payload.type);
				case MapEffect.Projectile:
					const p = new UIEffect(this, {name: event.payload.name, pos: event.payload.from}, event.payload.name);
					p.throwProjectile(event.payload.to);
					break;
			}
		}));
		this.subs.push(gameBus.subscribe(effectUnset, event => {
			const {name} = event.payload;
			this.gameEffects[name].destroy();
			this.gameEffects[name] = undefined;
		}));
		this.subs.push(gameBus.subscribe(gameOver, event => {
			this.scene.pause().launch(SceneName.GameOver);
		}));
		this.subs.push(gameBus.subscribe(gameFinished, event => {
			this.scene.pause().launch(SceneName.GameFinished);
		}));
		this.subs.push(gameBus.subscribe(itemEquiped, event => {
			const {armour} = event.payload;
			if (armour) {
				this.hero.updateHeroSprite(armour);
			}
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

	handleMouseClick() {
		const worldPoint: any = this.input.activePointer.positionToCamera(this.cameras.main);
		const tile = this.layer.getTileAtWorldXY(worldPoint.x, worldPoint.y);
		this.target.x = tile.x * 32;
		this.target.y = tile.y * 32;
		const mob = this.gameEngine.getAttackable({x:tile.x, y:tile.y});
		if (mob) {
			console.log(mob);
		}
	}

	moveTo(pos) {
		if (this.gameEngine.hero.enchants.getStupid()) {
			if (pos === 'left')
				pos = 'right;'
			if (pos === 'right')
				pos = 'left';
			if (pos ==='up')
				pos = 'down';
			if (pos === 'down')
				pos = 'up';
		}
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
		}
	}

	hideRange() {
		if (this.range == null) return;
		this.tilemapVisibility.hideRange(this.range);
		this.range = null;
	}

	showRange(hero: Hero, pos: Coordinate) {
		this.range = line({from: hero.pos, to: pos})
			.filter(p => 
				Math.max(Math.abs(hero.pos.x - p.x), Math.abs(hero.pos.y - p.y)) <= hero.weapon.maxRange
			);
		this.range.shift();
		this.tilemapVisibility.showRange(this.range);
	}
}

export default GameScene;