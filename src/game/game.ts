import { TileMap } from "./tilemap/tilemap";
import { Hero } from "./hero/hero";
import { MonsterCollection } from "./monsters/monsterCollection";
import { Coordinate } from "./utils/coordinate";
import { AI, AIBehavior } from "./monsters/ai";
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
import { gameBus } from "../eventBus/game-bus";
import { gameFinished, logPublished, nextLevelCreated, playerMoved, rogueEvent, endRogueEvent, heroGainedXp, xpHasChanged, sightUpdated, timePassed } from "../events";
import { EventDispatcher } from "./event-handlers/dispatcher";
import { CommandDispatcher } from "./command-handlers/dispatcher";
import { sightHasChanged } from "../events/sight-has-changed";
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
    commandDispatcher: CommandDispatcher;
    eventDispatcher: EventDispatcher;

    public getHero(): Hero {
        return this.hero;
    }
    public getTilemap(): TileMap {
        return this.tilemap;
    }
    public getItems() {
        return this.items;
    }
    public getPlaces() {
        return this.places;
    }
    public getMonsters() {
        return this.monsters;
    }

    constructor() {
        Log.init();
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
        this.commandDispatcher = new CommandDispatcher(this);
        this.eventDispatcher = new EventDispatcher(this);
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

    nextLevelIfAllowed() {
        if (this.canGoToNextLevel()) {
            this.level ++;
            this.reInitLevel();
        }
    }
    private reInitLevel() {
        if (this.level === 6) gameBus.publish(gameFinished({}));
        
        this.places.clear();
        let additionalThingsToPlace: ThingToPlace[] = [];
        additionalThingsToPlace = this.tilemap.init(this.level);
        this.startingPosition();
        gameBus.publish(sightHasChanged({}));

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
    private mayAddUniqItem() {
        const p = randomIn(_.sample(this.tilemap.graph.rooms)!.rect);
        const uniq = getUniqLoot();

        if (uniq != null) {
            uniq.pos = p;
            console.log('uniq', uniq.name);
            this.items.itemsArray().push(uniq);
        }
    }
    initBus() {
        gameBus.subscribe(rogueEvent, event => {
            this.savedLevel = this.level;
            this.level = RogueEventLevel;
            this.reInitLevel();
        });
        gameBus.subscribe(endRogueEvent, event => {
            this.level = this.savedLevel+1;
            this.reInitLevel();
        });
        gameBus.subscribe(timePassed, event => {
            this.nextTurn(event.payload.timeSpent);
        });
    }

    private nextTurn(timeSpent: number) {
        if (this.isNextTurn(timeSpent)) {
            this.tilemap.playTileEffectsOn(this.hero, this.monsters.monstersArray());
            this.hero.update();
            this.hero.heroSkills.update(); // TODO REFACTO
            this.monsters.update();
            this.items.update();
        }

        if (this.hero.enchants.getStuned()) {
            this.nextTurn(1);
        }
    }

    private isNextTurn(timeSpent: number) {
        this.currentTurn += timeSpent;
        if (this.currentTurn >= 1) {
            this.currentTurn = 0;
            return true;
        } else {
            return false;
        }
    }
    private startingPosition() {
        const heroPos = this.tilemap.startingPosition();
        this.hero.pos = heroPos;
    }

    // queries
    public canGoToNextLevel() {
        return this.tilemap.getAt(this.hero.pos).isExit;
    }
    public getAttackable(pos: Coordinate) {
        return this.monsters.getAt(pos);
    }
	public getNearestAttackables(): Monster[] {
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