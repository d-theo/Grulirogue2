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
import {sightUpdated, gameBus, playerActionMove, playerMoved, playerAttemptAttackMonster, playerUseItem} from '../eventBus/game-bus';
import { Log } from "./log/log";
import { playerAttack } from "./use-cases/playerAttack";
import { ItemCollection } from "./items/item-collection";
import { EffectMaker } from "./effects/effect";
import { itemSpawn } from "./items/item-spawn";

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
            const {target, item} = event.payload;
            item.use(target);
            /*if (result.status === MessageResponseStatus.Ok) {
                this.nextTurn(result.timeSpent);
            }*/
        });
    }
    currentTerrain(): Terrain {
        return GreeceCreationParams.Terrain;
    }

    adjustSight() {
        this.tilemap.computeSight({from: this.hero.pos, range:8});
        gameBus.publish(sightUpdated({}));
    }

    nextTurn(timeSpent: number) {
        if (this.isNextTurn(timeSpent)) {
            this.monsters.play();
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
}