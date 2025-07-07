import { playerAttemptAttackMonster } from "../commands";
import { timePassed } from "../game/events";
import { Hero } from "../game/hero/hero";
import { TileMap } from "../game/tilemap/tilemap";
import { playerAttack } from "../game/use-cases/playerAttack";
import { gameBus } from "../infra/events/game-bus";
import { MessageResponse, MessageResponseStatus } from "../utils/types";
import { CommandHandler } from "./commands";

export class PlayerAttemptAttackMonsterHandler extends CommandHandler {
  constructor(private hero: Hero, private tilemap: TileMap) {
    super();
  }

  handle(event: ReturnType<typeof playerAttemptAttackMonster>) {
    const { monster } = event.payload;
    const result: MessageResponse = playerAttack({
      hero: this.hero,
      attacked: monster,
      tilemap: this.tilemap,
    });
    if (result.status === MessageResponseStatus.Ok) {
      gameBus.publish(timePassed({ timeSpent: result.timeSpent }));
    }
  }
}
