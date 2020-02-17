import { TileMap } from "./tilemap/tilemap";
import { Hero } from "./hero/hero";
import { MonsterCollection } from "./monsters/monsterCollection";
import { playerMove } from "./use-cases/playerMove";
import { GameMessage } from "./events/messages";
import { GameEventType } from "./events/events";
import { MessageResponse } from "./utils/types";

export class Game {
    tilemap: TileMap;
    hero: Hero;
    monsters: MonsterCollection;
    loopNb: number;
    currentTurn: number;
    constructor() {
        this.tilemap = new TileMap();
        this.hero = new Hero();
        this.monsters = new MonsterCollection();
        this.loopNb = 0;
        this.currentTurn = 0;
    }
    handleMessage(msg: GameMessage) {
        let result: MessageResponse;
        switch(msg.type) {
            case GameEventType.PlayerMove: 
                result = playerMove(this, msg);
                break;
            default: throw new Error('not implemented code: '+JSON.stringify(msg));
        }
        this.checkNextTurn(result.timeSpent);

        this.loopNb ++;
        return this;
    }

    checkNextTurn(timeSpent: number) {
        this.currentTurn += timeSpent;
    }
}