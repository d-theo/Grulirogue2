import { gameBus } from "../../eventBus/game-bus";
import { playerAttemptAttackMonster } from "../../commands";
import { MessageResponse, MessageResponseStatus } from "../utils/types";
import { playerAttack } from "../use-cases/playerAttack";
import { CommandHandler } from "./commands";
import { Hero } from "../hero/hero";
import { TileMap } from "../tilemap/tilemap";
import { timePassed } from "../../events";

export class PlayerAttemptAttackMonsterHandler extends CommandHandler {
    constructor(private hero: Hero, private tilemap: TileMap) {
        super();
    }

    handle(event: ReturnType<typeof playerAttemptAttackMonster>) {
        const {monster} = event.payload;
        const result: MessageResponse = playerAttack({
            hero: this.hero,
            attacked: monster,
            tilemap: this.tilemap
        });
        if (result.status === MessageResponseStatus.Ok) {
            gameBus.publish(timePassed({timeSpent: result.timeSpent}))
        }
    }
}