import { Action } from "./action";
import { Coordinate } from "../utils/coordinate";
import { playerMove } from "../use-cases/playerMove";
import { MessageResponseStatus } from "../utils/types";
import { gameBus, playerMoved } from "../../eventBus/game-bus";

export class PlayerMoveAction extends Action {
    constructor(private args: {to: Coordinate}) {
        super();
    }
    execute() {
        const res = playerMove({
            monsters: this.game.monsters,
            pos: this.args.to,
            hero: this.game.hero,
            tilemap: this.game.tilemap,
            items: this.game.items,
            places: this.game.places
        });
        if (res.status === MessageResponseStatus.Ok) {
            gameBus.publish(playerMoved({}));
            this.game.nextTurn(res.timeSpent);
            this.game.adjustSight();
        }
    }
}