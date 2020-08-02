import { TileMap } from "./tilemap/tilemap";
import { Hero } from "./hero/hero";
import { MonsterCollection } from "./monsters/monsterCollection";
import { Coordinate } from "./utils/coordinate";
import { AI, AIBehavior } from "./monsters/ai";
import {gameBus, nextLevelCreated, logPublished, gameFinished, rogueEvent, endRogueEvent, turnEnded} from '../eventBus/game-bus';
import { Log } from "./log/log";
import { ItemCollection } from "./items/item-collection";
import { EffectMaker } from "./effects/effect";
import { Monster } from "./monsters/monster";
import { makeThings } from "./generation/additionnal-things";
import { monstersSpawn } from "./generation/monster-spawn";
import { itemSpawn } from "./generation/item-spawn";
import { ThingToPlace } from "../generation/map_tiling_utils";
import { SpecialPlaces } from "./places/special-places";
import { RogueEventLevel } from "../eventBus/event-rogue";
import { randomIn } from "./utils/rectangle";
import { getUniqLoot } from "./loot/loot-uniq";
import * as _ from 'lodash';
import { Action } from "./actions/action";


export class Game {
    static Engine: Game;
    tilemap: TileMap;
    hero: Hero;
    monsters: MonsterCollection;
    items: ItemCollection;
    loopNb: number;
    currentTurn: number;
    level = 1;
    savedLevel = -1;
    Danger: any = {
        1: 50,
        2: 70,
        3: 80,
        4: 100,
        5: 120,
        6: 160,
        99: 50
    };
    Loots: any = {
        1:11,
        2:7,
        3:6,
        4:6,
        5:6,
        6:6,
        99: 10
    };
    places: SpecialPlaces;
    constructor() {
        Log.init();
        Action.bindOnce(this);
        this.tilemap = new TileMap();
        this.hero = new Hero();
        this.loopNb = 0;
        this.currentTurn = 0;
        this.monsters = new MonsterCollection();
        this.items = new ItemCollection();
        this.places = new SpecialPlaces(this.items, this.monsters);
        const behaviors = AI(this);
        AIBehavior.init(behaviors);
        EffectMaker.set(this);
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
        if (this.level === 6) gameBus.publish(gameFinished({}));
        
        this.places.clear();
        let additionalThingsToPlace: ThingToPlace[] = [];
        additionalThingsToPlace = this.tilemap.init(this.level);
        this.startingPosition();
        this.adjustSight();

        const friendlies = this.monsters.monstersArray().filter(m => m.getFriendly());
        friendlies.forEach(f => f.pos = {x: this.hero.pos.x, y: this.hero.pos.y+1});

        this.monsters.setMonsters(
            friendlies
                .concat(monstersSpawn(this.tilemap.graph, this.level, this.Danger[this.level]))
        );
        this.items.setItems(itemSpawn(this.tilemap.graph, this.level, this.hero.skillFlags.additionnalItemPerLevel + this.Loots[this.level]));
        this.mayAddUniqItem();
        makeThings(additionalThingsToPlace, this.monsters, this.items, this.tilemap, this.places);
        if (this.tilemap.graph.bossRoom && this.level == 2) {
            gameBus.publish(logPublished({level: 'warning', data:'You hear a distinct hissing...'}));
        }
        if (this.level > 1) {
            gameBus.publish(nextLevelCreated({level: this.level}));
        }
    }
    mayAddUniqItem() {
        const p = randomIn(_.sample(this.tilemap.graph.rooms)!.rect);
        const uniq = getUniqLoot();

        if (uniq != null) {
            uniq.pos = p;
            console.log('uniq', uniq.name);
            this.items.itemsArray().push(uniq);
        }
    }
    public setNextAction(action: Action) {
        action.execute();
    }
    initBus() {
        gameBus.subscribe(rogueEvent, _ => {
            this.savedLevel = this.level;
            this.level = RogueEventLevel;
            this.reInitLevel();
        });
        gameBus.subscribe(endRogueEvent, _ => {
            this.level = this.savedLevel+1;
            this.reInitLevel();
        });
    }
    adjustSight() {
        this.tilemap.computeSight({from: this.hero.pos, range: this.hero.sight});
    }
    
    nextTurn(timeSpent: number) {
        if (this.isNextTurn(timeSpent)) {
            this.tilemap.playTileEffectsOn(this.hero, this.monsters.monstersArray());
            this.hero.update();
            this.hero.heroSkills.update(); // TODO REFACTO
            this.monsters.update();
            this.items.update();
            gameBus.publish(turnEnded({}));
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
            const dist = Math.max(Math.abs(posA.x - posB.x),Math.abs(posA.y - posB.y));
            if (dist <= this.hero.weapon.maxRange 
                && this.tilemap.hasVisibility({from: posA, to: posB})) {
                nearest.push(mob);
            }
        }
        return nearest.sort((a,b) => {
            const distA = Math.abs(a.pos.x - this.hero.pos.x) + Math.abs(a.pos.y - this.hero.pos.y);
            const distB = Math.abs(b.pos.x - this.hero.pos.x) + Math.abs(b.pos.y - this.hero.pos.y);
            return distA > distB ? 1 : -1;
        }).filter(m => !m.getFriendly());
    }
}