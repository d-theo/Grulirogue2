import { Game } from "../game";
import { checkMoveAllowed } from "./preconditions/moveAllowed";
import { MessageResponse, MessageResponseStatus } from "../utils/types";
import { PlayerAttackMessage } from "../events/messages";

export function playerMove(game: Game, message: PlayerAttackMessage): MessageResponse {
    const attacked = game.getAttackable(message.data.to);
    return {
        timeSpent: 1,
        status: MessageResponseStatus.Ok,
    };
}