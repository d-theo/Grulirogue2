import { TileMap } from "./tilemap/tilemap";
import { Hero } from "./hero/hero";
import { MonsterCollection } from "./monsters/monsterCollection";
import { playerMove } from "./use-cases/playerMove";
import { MessageResponse, MessageResponseStatus } from "./utils/types";
import { Coordinate } from "./utils/coordinate";
import { AI, AIBehavior } from "./monsters/ai";
import {GreeceCreationParams} from '../map/terrain.greece';
import { monstersSpawn } from "./monsters/monster-spawn";
import {sightUpdated, gameBus, playerActionMove, playerMoved, playerAttemptAttackMonster, playerUseItem, waitATurn, nextLevel, nextLevelCreated, playerChoseSkill, heroGainedXp, xpHasChanged, playerUseSkill, playerReadScroll} from '../eventBus/game-bus';
import { Log } from "./log/log";
import { playerAttack } from "./use-cases/playerAttack";
import { ItemCollection } from "./items/item-collection";
import { EffectMaker } from "./effects/effect";
import { itemSpawn } from "./items/item-spawn";
import { Monster } from "./monsters/monster";
import { Scroll } from "./items/scroll";
import { ThingToPlace } from "../generation/map_tiling";
import { makeThings } from "./special/additionnal-things";

export class Game {
    static Engine: Game;
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
        this.reInitLevel();
    }

    static getInstance() {
        if (Game.Engine != null) {
            return Game.Engine;
        } else {
            Game.Engine = new Game();
            return Game.Engine;
        }
    }

    reInitLevel() {
        let additionalThingsToPlace: ThingToPlace[] = [];
        if (this.level < 4) {
            GreeceCreationParams.Algo = this.level % 2 == 0 ? 'dig' : 'rogue';
            additionalThingsToPlace = this.tilemap.init(GreeceCreationParams);
        }
        this.startingPosition();
        this.adjustSight();
        this.monsters.setMonsters(monstersSpawn(this.tilemap.graph, this.level, GreeceCreationParams.Danger[this.level-1]));
        EffectMaker.set({tilemap: this.tilemap, monsters: this.monsters, hero: this.hero});
        this.items.setItems(itemSpawn(this.tilemap.graph, this.level, this.hero.skillFlags.additionnalItemPerLevel + GreeceCreationParams.Loots[this.level-1]));
        makeThings(additionalThingsToPlace, this.monsters, this.items);
        if (this.level > 1) {
            gameBus.publish(nextLevelCreated({level: this.level}));
        }
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
            if (usedItem !== undefined) {
                usedItem.keyMapping[action](target);
                this.hero.consumeItem(usedItem);
            }
            this.nextTurn(1);
        });
        gameBus.subscribe(waitATurn, event => {
            this.nextTurn(1);
        });
        gameBus.subscribe(nextLevel, event => {
            if (this.canGoToNextLevel()) {
                this.level ++;
                this.reInitLevel();
            }
        });
        gameBus.subscribe(playerChoseSkill, event => {
            const {name} = event.payload;
            this.hero.heroSkills.learnSkill(name);
        });
        gameBus.subscribe(heroGainedXp, event => {
            const report = this.hero.gainXP(event.payload.amount);
            gameBus.publish(xpHasChanged(report));
        })
        gameBus.subscribe(playerUseSkill, event => {
            const {name} = event.payload;
            this.nextTurn(1);
            this.hero.heroSkills.castSkill(name);
        });
        gameBus.subscribe(playerReadScroll, event => {
            const {item, target} = event.payload;
            const scroll = this.hero.getItem(item) as Scroll;
            scroll.setTarget(target).use();
            this.hero.consumeItem(scroll);
            this.nextTurn(1);
        });
    }
    canGoToNextLevel() {
        return true; // TODO
        //return this.tilemap.getAt(this.hero.pos).isExit;
    }
    adjustSight() {
        this.tilemap.computeSight({from: this.hero.pos, range: this.hero.sight});
        gameBus.publish(sightUpdated({}));
    }

    nextTurn(timeSpent: number) {
        if (this.isNextTurn(timeSpent)) {
            this.hero.regenHealth();
            this.hero.resolveBuffs();
            this.hero.heroSkills.update(); // TODO REFACTO
            this.monsters.resolveBuffs();
            this.monsters.play();
            this.tilemap.playTileEffectsOn(this.hero, this.monsters.monstersArray());
        }

        if (this.hero.enchants.getStuned()) {
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
            const dist = Math.min(Math.abs(posA.x - posB.x),Math.abs(posA.y - posB.y));
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