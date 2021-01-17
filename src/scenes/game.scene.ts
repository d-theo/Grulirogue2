import { ZapView } from './zap/zap.scene';
import {SceneName} from './scenes.constants';
import {Game as GameEngine} from '../game/game';
import {Coordinate, around} from '../game/utils/coordinate';
import {TilemapVisibility} from '../map/TilemapVisibility';
import {UIEntity} from '../UIEntities/ui-entity';
import {Item} from '../game/entitybase/item';
import {UIItem} from '../UIEntities/ui-item';
import {Hero} from '../game/hero/hero';
import {UIEffect} from '../UIEntities/ui-effect';
import {line} from '../game/tilemap/sight';
import {Terrain} from '../map/terrain.greece';
import {EffectTarget} from '../game/effects/spells';
import {Monster} from '../game/monsters/monster';
import { GameContext, Modes } from './states';
import { Keyboard } from '../phaser-addition/keyboard';
import { CellSize } from '../main';
import { UIDamages } from '../UIEntities/ui-damages';
import { DamageQueue } from '../phaser-addition/damage-queue';
import { gameBus } from '../eventBus/game-bus';
import { gameStarted, logPublished, sightUpdated, monsterMoved, monsterDead, monsterTookDamage, playerTookDammage, playerMoved, doorOpened, itemPickedUp, playerHealed, itemDropped, itemRemoved, rogueEvent, monsterSpawned, effectSet, effectUnset, gameOver, gameFinished, itemEquiped, nextLevelCreated } from '../events';
import { playerAttemptAttackMonster, playerUseItem, nextLevel, waitATurn, playerChoseSkill, playerActionMove, playerUseZap } from '../commands';
import { SkillView } from './skills/passive-skill.scene';
import { Zap } from '../game/hero/zap/zap';


class GameScene extends Phaser.Scene {
	keyboard: Keyboard;

	hero: UIEntity;
	target: Phaser.GameObjects.Sprite;
	gameMonsters: {[id: string]: UIEntity} = {};
	gameItems: {[id: string]: UIItem} = {};
	gameEffects: {[id: string]: UIEffect} = {};
	damageQueue: DamageQueue = new DamageQueue();

	tilemap;
	layer;
	layer2;

	delta: number;
	moveAllowed = true;

	gameEngine: GameEngine;
	tilemapVisibility: TilemapVisibility;

	gameContext: GameContext;
	actionContext: 
	{target: 'basic_attack',mobs: Monster[]} 
	| {action: 'useSkill' | 'pickSkill' | 'useItem' | 'pickItem', key: string, item: Item, target: EffectTarget}
	| null
	| any;

	range;
	constructor() {
		super({
			key: SceneName.Game
		});
	}

	preload() {
		this.gameEngine = GameEngine.getInstance();
		this.tilemap = this.gameEngine.tilemap.tilemap;
		this.gameContext = new GameContext(this);
	}

	reInit() {
		this.gameEngine = GameEngine.getInstance();
		this.tilemap = this.gameEngine.tilemap.tilemap;
		Object.values(this.gameMonsters).forEach(v => v.destroy());
		Object.values(this.gameItems).forEach(v => v.destroy());
		Object.values(this.gameEffects).forEach(v => v.destroy());
		this.hero && this.hero.destroy();

		this.hero = null;
		this.gameMonsters = {};
		this.gameItems = {};
		this.gameEffects = {};

		var map: Phaser.Tilemaps.Tilemap = this.make.tilemap({
			data: this.tilemap,
			key: 'map'
		});
		var tileset: Phaser.Tilemaps.Tileset = map.addTilesetImage('terrain2', 'terrain2', CellSize, CellSize, 1, 2, 0);
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
		this.target.setOrigin(0, 0);
		this.target.setDepth(5);
		this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
		this.cameras.main.startFollow(this.hero.sprite, false);

		// hack ! 
		setTimeout(() => {
			gameBus.publish(gameStarted({}));
			this.tilemapVisibility.setFogOfWar2(this.gameEngine.tilemap.tiles);
			this.tilemapVisibility.setFogOfWar1(this.gameEngine.tilemap.tiles, this.gameMonsters);
		}, 50);
	}

	selectFire() {
		const mobs = this.gameEngine.getNearestAttackables();
		if (mobs.length === 0) {
			gameBus.publish(logPublished({
				data: 'nothing to attack'
			}));
			return false;
		} else {
			gameBus.publish(logPublished({
				data: 'who do you want to attack ?'
			}));
			const mob = mobs[0];
			this.setTargetAtPos(mob.pos);
			this.actionContext = {
				target: 'basic_attack',
				mobs: mobs
			};
			this.showRange(this.gameEngine.hero, mob.pos);
			return true;
		}
	}
	nextTarget() {
		const last = this.actionContext.mobs.shift();
		this.actionContext.mobs.push(last);
		const mob = this.actionContext.mobs[0];
		this.setTargetAtPos(mob.pos);
		this.showRange(this.gameEngine.hero, mob.pos);
	}
	fire() {
		this.hideRange();
		const mob = this.gameEngine.getAttackable(this.getTargetPos());
		if (mob) {
			gameBus.publish(playerAttemptAttackMonster({
				monster: mob
			}));
		}
		this.hideTarget();
		this.actionContext = null;
	}
	enterLocation() {
		const pos = this.getTargetPos();
		this.hideTarget();
		const t = this.gameEngine.tilemap.getAt(pos);
		if (!t.isWalkable()) {
			gameBus.publish(logPublished({data: 'You cannot do that'}));
			return;
		}
		if(! this.gameEngine.tilemap.hasVisibility({from: this.hero.subject.pos, to: pos})) {
			gameBus.publish(logPublished({data: 'You cannot see that far !'}));
			return;
		}
		
		if (this.actionContext.action === 'useItem') {
			gameBus.publish(playerUseItem({
				item: this.actionContext.item,
				target: pos,
				action: this.actionContext.key
			}));
		} else if (this.actionContext.action === 'useZap') {
			gameBus.publish(playerUseZap({
				name: this.actionContext.data.name,
				target: pos,
			}));
		}
	}

	enterMovable() {
		const pos = this.getTargetPos();
		this.hideTarget();
		let t;
		if (this.gameEngine.hero.pos.x === pos.x && this.gameEngine.hero.pos.y === pos.y) {
			t = this.gameEngine.hero;
		} else {
			t = this.gameEngine.getAttackable(pos);
			if (!t) return;
		}

		if (this.actionContext.action === 'useItem') {
			gameBus.publish(playerUseItem({
				item: this.actionContext.item,
				target: t,
				action: this.actionContext.key
			}));
		} else if (this.actionContext.action === 'useZap') {
			gameBus.publish(playerUseZap({
				name: this.actionContext.data.name,
				target: t,
			}));
		}
	}

	displayInventory(action: 'useItem'|'pickItem', timeoutMs?: number, displayCategories?: string[]) {
		let conf;
		if (displayCategories) {
			conf = this.gameEngine.hero.openBag(displayCategories);
		} else {
			conf = this.gameEngine.hero.openBag();
		}

		this.keyboard.pause();
		setTimeout(() => {
			this.scene.pause()
				.launch(SceneName.Inventory, {
					config: conf,
					action: action
				});
		}, timeoutMs || 0)
	}

	displaySkill() {
		this.keyboard.pause();
		this.scene.pause().launch(SceneName.SkillTreeScene, {
			data: new SkillView(this.gameEngine.hero.skills.report()),
			action: 'pickSkill'
		});
	}

	displayZaps() {
		this.keyboard.pause();
		const data = new ZapView(this.gameEngine.hero.zapper.report());
		this.scene.pause().launch(SceneName.Zap, {
			data,
			action: 'useZap'
		});
	}

	escape() {
		gameBus.publish(logPublished({
			data: 'forget that'
		}));
		this.hideRange();
		this.hideTarget();
	}

	tryStairs() {
		if (this.gameEngine.canGoToNextLevel()) {
			gameBus.publish(nextLevel({}));
		}
	}
	waitATurn() {
		gameBus.publish(waitATurn({}));
	}
	moveTarget(direction: string) {
		if (direction === 'ArrowUp') this.target.y -= CellSize;
		if (direction === 'ArrowDown') this.target.y += CellSize;
		if (direction === 'ArrowLeft') this.target.x -= CellSize;
		if (direction === 'ArrowRight') this.target.x += CellSize;
	}

	moveTargetToAttack(direction: string) {
		this.hideRange();
		this.moveTarget(direction);
		this.showRange(this.gameEngine.hero, this.getTargetPos());
	}

	create() {
		this.reInit();
		this.keyboard = new Keyboard();
		this.input.on('pointerup', this.handleMouseClick.bind(this));
		this.initGameEvents();
		this.input.keyboard.on('keydown-' + 'UP', (e) => this.keyboard.keyPressed(e.key));
		this.input.keyboard.on('keydown-' + 'DOWN',(e) => this.keyboard.keyPressed(e.key));
		this.input.keyboard.on('keydown-' + 'LEFT', (e) => this.keyboard.keyPressed(e.key));
		this.input.keyboard.on('keydown-' + 'RIGHT', (e) => this.keyboard.keyPressed(e.key));
		this.input.keyboard.on('keyup', (event) => {
			switch (event.key) {
				case 'ArrowUp':
				case 'ArrowDown':
				case 'ArrowLeft':
				case 'ArrowRight':
					this.keyboard.keyReleased(event.key);
					return this.gameContext.arrow(event.key);
				case 'i':
					return this.gameContext.i();
				case 'f':
					return this.gameContext.f();
				case 'Enter':
					return this.gameContext.enter();
				case 'g': 
					return this.gameContext.g();
				case 'm': 
					return this.gameContext.m();
				case 'z': 
					return this.gameContext.z();
				case 'Escape':
					return this.gameContext.esc();
				case 'w': 
					return this.gameContext.w();
				case '>':
					return this.gameContext.stair();
			}
		});
		this.events.on('resume', (sys, data: {
			action: 'pickSkill' | 'useItem' | 'pickItem' | 'useZap',
			key: string,
			item: Item,
			data: any
		} | undefined) => {
			this.keyboard.resume();
			if (data && data.action === 'pickItem') {
				gameBus.publish(playerUseItem({
					item: this.actionContext.item,
					target: this.gameEngine.hero.getItem(data.item),
					action: this.actionContext.key
				}));
			} else if (data && data.action === 'useZap') {
				const zap = data.data as Zap;
				const spellNeedsTarget = this.gameEngine.hero.zapper.getZap(zap.name).targetType();
				switch (spellNeedsTarget) {
					case EffectTarget.AoE:
					case EffectTarget.Location:
						this.putTargetOnHero();
						this.actionContext = {
							...data,
							target: spellNeedsTarget
						};
						gameBus.publish(logPublished({
							data: 'where do you want to target ?'
						}));
						this.gameContext.transitionTo(Modes.SelectLocation);
						break;
					case EffectTarget.Movable:
						this.putTargetOnHero();
						this.actionContext = {
							...data,
							target: spellNeedsTarget
						};
						gameBus.publish(logPublished({
							data: 'who do you want to target ?'
						}));
						this.gameContext.transitionTo(Modes.SelectMovable);
						break;
					case EffectTarget.Item:
						gameBus.publish(logPublished({
							data: 'Select an item'
						}));
						this.actionContext = {
							...data,
							target: spellNeedsTarget
						};
						this.displayInventory('pickItem', 500, ['Weapons', 'Armours', 'Consumables']);
						break;
					case EffectTarget.Weapon:
						this.actionContext = {
							...data,
							target: spellNeedsTarget
						};
						this.displayInventory('pickItem', 500, ['Weapons']);
						gameBus.publish(logPublished({
							data: 'Select a weapon'
						}));
						break;
					case EffectTarget.Armour:
						gameBus.publish(logPublished({
							data: 'Select an item'
						}));
						this.actionContext = {
							...data,
							target: spellNeedsTarget
						};
						this.displayInventory('pickItem', 500, ['Armours']);
						break;
					case EffectTarget.Hero:
					case EffectTarget.None:
						gameBus.publish(playerUseZap({
							name: data.data.name,
							target: this.hero.subject as Hero,
						}));
						break;
					default:
						throw new Error(`Not implemented [${spellNeedsTarget}]`)
				}
			} else if (data && data.action === 'useItem') {
				const itemNeedsTarget = this.gameEngine.hero.getItem(data.item).getArgumentForKey(data.key);
				switch (itemNeedsTarget) {
					case EffectTarget.AoE:
					case EffectTarget.Location:
						this.putTargetOnHero();
						this.actionContext = {
							...data,
							target: itemNeedsTarget
						};
						gameBus.publish(logPublished({
							data: 'where do you want to target ?'
						}));
						this.gameContext.transitionTo(Modes.SelectLocation);
						break;
					case EffectTarget.Movable:
						this.putTargetOnHero();
						this.actionContext = {
							...data,
							target: itemNeedsTarget
						};
						gameBus.publish(logPublished({
							data: 'who do you want to target ?'
						}));
						this.gameContext.transitionTo(Modes.SelectMovable);
						break;
					case EffectTarget.Item:
						gameBus.publish(logPublished({
							data: 'Select an item'
						}));
						this.actionContext = {
							...data,
							target: itemNeedsTarget
						};
						this.displayInventory('pickItem', 500, ['Weapons', 'Armours', 'Consumables']);
						break;
					case EffectTarget.Weapon:
						this.actionContext = {
							...data,
							target: itemNeedsTarget
						};
						this.displayInventory('pickItem', 500, ['Weapons']);
						gameBus.publish(logPublished({
							data: 'Select a weapon'
						}));
						break;
					case EffectTarget.Armour:
						gameBus.publish(logPublished({
							data: 'Select an item'
						}));
						this.actionContext = {
							...data,
							target: itemNeedsTarget
						};
						this.displayInventory('pickItem', 500, ['Armours']);
						break;
					case EffectTarget.Hero:
					case EffectTarget.None:
						gameBus.publish(playerUseItem({
							item: data.item,
							target: this.hero.subject as Hero,
							action: data.key,
						}));
						break;
					default:
						throw new Error(`Not implemented [${itemNeedsTarget}]`)
				}
			} else if (data && data.action === 'pickSkill') {
				gameBus.publish(playerChoseSkill({
					skills: data.data
				}));
			}
		});
	}

	initGameEvents() {
		gameBus.subscribe(sightUpdated, event => {
			this.tilemapVisibility.setFogOfWar2(this.gameEngine.tilemap.tiles);
			this.tilemapVisibility.setFogOfWar1(this.gameEngine.tilemap.tiles, this.gameMonsters);
		});
		gameBus.subscribe(monsterMoved, event => {
			const { monster } = event.payload;
			const m = this.gameMonsters[monster.id];

			this.hero.updateHp(true);
			this.damageQueue.resolve();

			// TODO REFACTO
			m.move();

			this.tilemapVisibility.setFogOfWar1(this.gameEngine.tilemap.tiles, this.gameMonsters);
		});
		gameBus.subscribe(monsterDead, event => {
			const { monster } = event.payload;
			const m = this.gameMonsters[monster.id];
			m.updateHp();
		});
		gameBus.subscribe(monsterTookDamage, event => {
			const monster = event.payload.monster;
			const m = this.gameMonsters[monster.id];
			new UIDamages(this, monster, event.payload.amount).showDamage();
			m.updateHp();
		});
		gameBus.subscribe(playerTookDammage, event => {
			this.damageQueue.add(new UIDamages(this, this.hero.subject as Hero, event.payload.amount));
		});
		gameBus.subscribe(playerMoved, event => {
			this.hero.move();
		});
		gameBus.subscribe(doorOpened, event => {
			const { pos } = event.payload;
			this.layer.putTileAt(Terrain.DoorOpened, pos.x, pos.y);
		});
		gameBus.subscribe(itemPickedUp, event => {
			const { item } = event.payload;
			if (this.gameItems[item.id] == null) {
				console.error(item);
				console.error('is not pickable');
				return;
			}
			this.gameItems[item.id].pickedUp();
		});
		gameBus.subscribe(playerHealed, event => {
			this.hero.updateHp();
		});
		gameBus.subscribe(itemDropped, event => {
			const { item } = event.payload;
			this.gameItems[item.id] = new UIItem(this, item, item.skin);
		});
		gameBus.subscribe(itemRemoved, event => {
			const { item } = event.payload;
			const gameItem = this.gameItems[item.id];
			gameItem.destroy();
		});
		gameBus.subscribe(rogueEvent, () => {
			this.hero.updateHeroSprite('@');
		});
		gameBus.subscribe(monsterSpawned, (event) => {
			const mob = event.payload.monster;
			const monster = new UIEntity(this, mob, mob.name)
			this.gameMonsters[mob.id] = monster;
		});
		gameBus.subscribe(effectSet, event => {
			switch (event.payload.animation) {
				case 'static':
					return this.gameEffects[event.payload.id] = new UIEffect(this, {
						name: event.payload.type,
						pos: event.payload.pos
					}, event.payload.type);
				case 'throw':
					const p = new UIEffect(this, {
						name: event.payload.type,
						pos: event.payload.from
					}, event.payload.type);
					p.throwProjectile(event.payload.to);
					break;
			}
		});
		gameBus.subscribe(effectUnset, event => {
			const { id } = event.payload;
			if (!this.gameEffects[id]) {
				console.error(`${id} is not defined`);
				return;
			}
			this.gameEffects[id].destroy();
			delete this.gameEffects[id];
		});
		gameBus.subscribe(gameOver, event => {
			this.scene.pause().launch(SceneName.GameOver);
		});
		gameBus.subscribe(gameFinished, event => {
			this.scene.pause().launch(SceneName.GameFinished);
		});
		gameBus.subscribe(itemEquiped, event => {
			const {
				armour
			} = event.payload;
			if (armour) {
				this.hero.updateHeroSprite(armour.skin);
			}
		});
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
		const itemsToPlace: Item[] = this.gameEngine.items.itemOnGround();
		for (const i of itemsToPlace) {
			
			if (!this.gameEngine.tilemap.getAt(i.pos).isWalkable()) {
				const next = around(i.pos, 1);
				for (const n of next) {
					if (this.gameEngine.tilemap.getAt(n).isWalkable()) {
						i.pos = n;
					}
				}
				continue;
			}

			if (this.gameEngine.tilemap.getAt(i.pos).isEntry) continue;
			const item = new UIItem(this, i, i.skin);
			this.gameItems[i.id] = item;
		}
	}

	moveTo(pos) {
		let newPos: Coordinate = {x: -1,y: -1};
		let heroPos = this.gameEngine.hero.pos;
		switch (pos) {
			case 'left': 
				newPos = {x: heroPos.x-1, y: heroPos.y}
				break;
			case 'right':
				newPos = {x: heroPos.x+1, y: heroPos.y}
				break;
			case 'down': 
				newPos = {x: heroPos.x,y: heroPos.y + 1}
				break;
			case 'up': 
				newPos = {x: heroPos.x,y: heroPos.y - 1}
				break;
			case 'upleft': 
				newPos = {x: heroPos.x - 1,y: heroPos.y - 1}
				break;
			case 'upright': 
				newPos = {x: heroPos.x + 1,y: heroPos.y - 1}
				break;
			case 'downright': 
				newPos = {x: heroPos.x + 1,y: heroPos.y + 1}
				break;
			case 'downleft': 
				newPos = {x: heroPos.x - 1,y: heroPos.y + 1}
				break;
		}
		this.moveAllowed = false;
		this.delta = 0;
		this.hideTarget();
		gameBus.publish(playerActionMove({
			to: newPos
		}));
	}

	update(time: number, delta: number) {
		if (!this.moveAllowed) {
			this.delta += delta;
			if (this.delta > 200) {
				this.moveAllowed = true;
			}
			return;
		}

		if (this.gameContext.isOnState(Modes.Play)) {
			var isUpDown = this.keyboard.pressed.up;
			var isDownDown = this.keyboard.pressed.down;
			var isLeftDown = this.keyboard.pressed.left;
			var isRightDown = this.keyboard.pressed.right;
			if (isUpDown && isLeftDown) return this.moveTo('upleft');
			if (isUpDown && isRightDown) return this.moveTo('upright');
			if (isLeftDown && isDownDown) return this.moveTo('downleft');
			if (isRightDown && isDownDown) return this.moveTo('downright');
			if (isUpDown) return this.moveTo('up');
			if (isDownDown) return this.moveTo('down');
			if (isLeftDown) return this.moveTo('left');
			if (isRightDown) return this.moveTo('right');
		}
	}

	hideRange() {
		if (this.range == null) return;
		this.tilemapVisibility.hideRange(this.range);
		this.range = null;
	}

	showRange(hero: Hero, pos: Coordinate) {
		this.range = line({
				from: hero.pos,
				to: pos
			})
			.filter(p =>
				Math.max(Math.abs(hero.pos.x - p.x), Math.abs(hero.pos.y - p.y)) <= hero.weapon.maxRange
			);
		this.range.shift();
		this.tilemapVisibility.showRange(this.range);
	}

	getTargetPosPix() {
		return {x: this.target.x, y: this.target.y};
	}
	getTargetPos() {
		return {x: this.target.x / CellSize, y: this.target.y / CellSize};
	}
	setTargetAtPos(pos: Coordinate) {
		this.showTarget();
		this.target.x = pos.x * CellSize;
		this.target.y = pos.y * CellSize;
	}
	putTargetOnHero() {
		this.showTarget();
		this.setTargetAtPos(this.hero.subject.pos);
	}
	showTarget() {
		this.target.alpha = 0.9;
	}
	hideTarget() {
		this.target.alpha = 0;
	}

	handleMouseClick() {
		const worldPoint: any = this.input.activePointer.positionToCamera(this.cameras.main);
		const tile = this.layer.getTileAtWorldXY(worldPoint.x, worldPoint.y);
		this.target.x = tile.x * CellSize;
		this.target.y = tile.y * CellSize;
		const mob = this.gameEngine.getAttackable({
			x: tile.x,
			y: tile.y
		});
		if (mob) {
			console.log(mob);
		}
	}
}

export default GameScene;