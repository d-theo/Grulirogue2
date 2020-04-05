import { TileMap } from "./tilemap/tilemap";
import { Hero } from "./hero/hero";
import { MonsterCollection } from "./monsters/monsterCollection";
import { playerMove } from "./use-cases/playerMove";
import { MessageResponse, MessageResponseStatus } from "./utils/types";
import { Coordinate } from "./utils/coordinate";
import { AI, AIBehavior } from "./monsters/ai";
import {GreeceCreationParams} from '../map/terrain.greece';
import { Terrain } from "../map/terrain";
import { monstersSpawn } from "./monsters/monster-spawn";
import {sightUpdated, gameBus, playerActionMove, playerMoved, playerAttemptAttackMonster, playerUseItem, waitATurn} from '../eventBus/game-bus';
import { Log } from "./log/log";
import { playerAttack } from "./use-cases/playerAttack";
import { ItemCollection } from "./items/item-collection";
import { EffectMaker } from "./effects/effect";
import { itemSpawn } from "./items/item-spawn";
import { Item } from "./entitybase/item";
import { Monster } from "./monsters/monster";

export class Game {
    tilemap: TileMap;
    hero: Hero;
    monsters: MonsterCollection;
    items: ItemCollection;
    loopNb: number;
    currentTurn: number;
    level = 1;
    constructor() {
        Log.init();
        this.tilemap = new TileMap();
        this.hero = new Hero();
        this.loopNb = 0;
        this.currentTurn = 0;
        this.monsters = new MonsterCollection();
        this.items = new ItemCollection();
        const behaviors = AI(this);
        AIBehavior.init(behaviors);
        this.initBus();
    }

    reInitLevel() {
        if (this.level < 4) {
            this.tilemap.init(GreeceCreationParams);
        }
        this.startingPosition();
        this.adjustSight();
        this.monsters.setMonsters(monstersSpawn(this.tilemap.graph.rooms, this.level, 20));
        

        EffectMaker.set({tilemap: this.tilemap, monsters: this.monsters, hero: this.hero});
        this.items.setItems(itemSpawn(this.tilemap.graph.rooms, this.level, 10));
        
    }
    initBus() {
        gameBus.subscribe(playerActionMove, event => {
            const {to} = event.payload;
            const result: MessageResponse = playerMove({
                monsters: this.monsters,
                pos: to,
                hero: this.hero,
                tilemap: this.tilemap,
                items: this.items
            });
            if (result.status === MessageResponseStatus.Ok) {
                gameBus.publish(playerMoved({}));
                this.nextTurn(result.timeSpent);
                this.adjustSight();
            }
        });
        gameBus.subscribe(playerAttemptAttackMonster, event => {
            const {monster} = event.payload;
            const result: MessageResponse = playerAttack({
                hero: this.hero,
                attacked: monster,
                tilemap: this.tilemap
            });
            if (result.status === MessageResponseStatus.Ok) {
                this.nextTurn(result.timeSpent);
            }
        });
        gameBus.subscribe(playerUseItem, event => {
            const {owner, target, item, action} = event.payload;
            const usedItem = owner.getItem(item);
            console.log('target',target);
            if (usedItem !== undefined) {
                usedItem.keyMapping[action](target);
                this.hero.consumeItem(usedItem);
            }
            this.nextTurn(1);
        });
        gameBus.subscribe(waitATurn, event => {
            this.nextTurn(1);
        });
    }
    currentTerrain(): Terrain {
        return GreeceCreationParams.Terrain;
    }

    adjustSight() {
        this.tilemap.computeSight({from: this.hero.pos, range: this.hero.sight});
        gameBus.publish(sightUpdated({}));
    }

    nextTurn(timeSpent: number) {
        if (this.isNextTurn(timeSpent)) {
            this.hero.resolveBuffs();
            this.monsters.resolveBuffs();
            this.monsters.play();
        }

        if (this.hero.enchants.stuned) {
            this.nextTurn(1);
        }
    }

    isNextTurn(timeSpent: number) {
        this.currentTurn += timeSpent;
        if (this.currentTurn >= 1) {
            this.currentTurn = 0;
            return true;
        } else {
            return false;
        }
    }

    getAttackable(pos: Coordinate) {
        return this.monsters.getAt(pos);
    }

    startingPosition() {
        const heroPos = this.tilemap.startingPosition();
        this.hero.pos = heroPos;
    }

	getNearestAttackables(): Monster[] {
        let nearest = [];
		for (const mob of this.monsters.monstersArray()) {
            const posA = mob.pos;
            const posB = this.hero.pos;
            const dist = Math.abs(posA.x - posB.x) + Math.abs(posA.y - posB.y);
            if (dist <= this.hero.weapon.maxRange 
                && this.tilemap.hasVisibility({from: posA, to: posB})) {
                nearest.push(mob);
            }
        }
        return nearest.sort((a,b) => {
            const distA = Math.abs(a.pos.x - this.hero.pos.x) + Math.abs(a.pos.y - this.hero.pos.y);
            const distB = Math.abs(b.pos.x - this.hero.pos.x) + Math.abs(b.pos.y - this.hero.pos.y);
            return distA > distB ? 1 : -1;
        });
	}
}