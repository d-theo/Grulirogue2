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
import { TileVisibility } from "./tilemap/tile";
import { AI, AIBehavior } from "./monsters/ai";
import {GreeceCreationParams} from '../map/terrain.greece';
import { Terrain } from "../map/terrain";
import { monstersSpawn } from "./monsters/monster-spawn";

export class Game {
    tilemap: TileMap;
    hero: Hero;
    monsters: MonsterCollection;
    loopNb: number;
    currentTurn: number;
    log: Log;
    level = 1;
    constructor() {
        this.tilemap = new TileMap();
        this.hero = new Hero();
        this.loopNb = 0;
        this.currentTurn = 0;
        this.log = new Log();
        this.monsters = new MonsterCollection();
        const behaviors = AI(this);
        AIBehavior.init(behaviors);
    }

    reInitLevel() {
        if (this.level < 4) {
            this.tilemap.init(GreeceCreationParams);
        }
        this.startingPosition();
        this.tilemap.computeSight({from: this.hero.pos, range:8});

        this.monsters.setMonsters(monstersSpawn(this.tilemap.graph.rooms, this.level, 20))
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
            return result;
        }

        if (result.events && result.events.length > 0) {
            this.resolveEvents(result.events);
        }

        if (this.isNextTurn(result.timeSpent)) {
            this.monsters.play();
        }

        this.tilemap.computeSight({from: this.hero.pos, range:8});
        this.loopNb ++;
        return result;
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

    startingPosition() {
        const heroPos = this.tilemap.startingPosition();
        this.hero.pos = heroPos;
    }
}