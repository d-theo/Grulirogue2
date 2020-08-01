import { Action } from "./action";
import { Monster } from "../monsters/monster";
import { MessageResponse, MessageResponseStatus } from "../utils/types";
import { playerAttack } from "../use-cases/playerAttack";

export class AttackAction extends Action {
    constructor(private readonly args: {monster: Monster}) {
        super();
    }
    execute() {
        const result: MessageResponse = playerAttack({
            hero: this.game.hero,
            attacked: this.args.monster,
            tilemap: this.game.tilemap
        });
        if (result.status === MessageResponseStatus.Ok) {
            this.game.nextTurn(result.timeSpent);
        }
    }
}