import { TileMap } from "./tilemap/tilemap";
import { Hero } from "./hero/hero";
import { MonsterCollection } from "./monsters/monsterCollection";
import { playerMove } from "./use-cases/playerMove";
import { GameMessage } from "./events/messages";
import { GameEventType, InternalEventType, GameEvent } from "./events/events";
import { MessageResponse, MessageResponseStatus } from "./utils/types";
import { Coordinate } from "./utils/coordinate";
import { playerAttack } from "./use-cases/playerAttack";
import { Log } from "./log/log";
import { throws } from "assert";
import { cpus } from "os";
import { TileVisibility } from "./tilemap/tile";
import { AI } from "./monsters/ai";
import {GreeceCreationParams} from '../map/terrain.greece';
import { Terrain } from "../map/terrain";

export class Game {
    tilemap: TileMap;
    hero: Hero;
    monsters: MonsterCollection;
    loopNb: number;
    currentTurn: number;
    log: Log;
    level = 0;
    constructor() {
        this.tilemap = new TileMap();
        this.hero = new Hero();
        this.loopNb = 0;
        this.currentTurn = 0;
        this.log = new Log();
        const behaviors = AI(this);
        this.monsters = new MonsterCollection(behaviors);
    }

    reInitLevel() {
        if (this.level < 4) {
            this.tilemap.init(GreeceCreationParams);
        }
        this.startingPosition();
        this.tilemap.computeSight({from: this.hero.pos, range:8});
    }
    currentTerrain(): Terrain {
        return GreeceCreationParams.Terrain;
    }
    handleMessage(msg: GameMessage) {
        this.log.archive();
        let result: MessageResponse;
        this.log.add(msg.type);
        switch(msg.type) {
            case GameEventType.PlayerMove:
                result = playerMove({
                    monsters: this.monsters,
                    pos: msg.data.to,
                    hero: this.hero,
                    tilemap: this.tilemap
                });
                break;
            case GameEventType.PlayerAttack: 
                result = playerAttack({
                    attacked: this.getAttackable(msg.data.to),
                    hero: this.hero,
                    tilemap: this.tilemap
                });
                break;
            default: throw new Error('not implemented code: '+JSON.stringify(msg));
        }

        if (result.status === MessageResponseStatus.NotAllowed || result.status === MessageResponseStatus.Error) {
            this.log.add('nothing');
            //return this.compact();
            return result;
        }

        if (result.events && result.events.length > 0) {
            this.resolveEvents(result.events);
        }

        this.checkNextTurn(result.timeSpent);

        this.tilemap.computeSight({from: this.hero.pos, range:8});
        this.loopNb ++;
        return result;
    }

    checkNextTurn(timeSpent: number) {
        this.currentTurn += timeSpent;
        if (this.currentTurn >= 1) {
            this.currentTurn = 0;
            return 1;
        } else {
            return 0;
        }
    }

    resolveEvents(events: GameEvent[]) {
        if (events.length === 0) return;
        const nextEvent = events.shift() as GameEvent;
        this.log.add(nextEvent.type);
        switch(nextEvent.type) {
            case InternalEventType.MonsterDead:
                break;
            default: throw new Error('not implemented code: '+JSON.stringify(nextEvent));
        }
        this.resolveEvents(events);
    }


    getAttackable(pos: Coordinate) {
        return this.monsters.getAt(pos);
    }


    compact() {
        const a = Array(this.tilemap.height).fill('-').map(()=>Array(this.tilemap.width).fill('-'));
        for (let row of this.tilemap.tiles) {
            for (let t of row) {
                switch(t.visibility) {
                    case TileVisibility.Hidden: 
                        a[t.pos.y][t.pos.x] = '8';
                        break;
                    case TileVisibility.OnSight:
                        a[t.pos.y][t.pos.x] = '-';
                        break;
                    case TileVisibility.Far:
                        a[t.pos.y][t.pos.x] = '@';
                        break;
                }
                if (t.isSolid()) a[t.pos.y][t.pos.x] = 'x'; 
            }
        }
        for (let m of this.monsters.monstersArray()) {
            a[m.pos.y][m.pos.x] = 'm';
        }
        a[this.hero.pos.y][this.hero.pos.x] = "h";
        console.log(this.log.currentLog);
        return a;
    }

    startingPosition() {
        const heroPos = this.tilemap.startingPosition();
        this.hero.pos = heroPos;
    }
}