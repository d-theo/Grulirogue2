import { Game } from "../game";
import { isTileEmpty, isSurroundingClear, isMovingOnlyOneCase, isInsideMapBorder} from "./preconditions/moveAllowed";
import { MessageResponse, MessageResponseStatus } from "../utils/types";
import { PlayerMoveMessage } from "../events/messages";

export function playerMove(game: Game, message: PlayerMoveMessage): MessageResponse {
    const pos = message.data.to;
    if (
        isTileEmpty(pos, [game.monsters.getAt(pos)])
        && isSurroundingClear(pos, game.tilemap)
        && isMovingOnlyOneCase(game.hero.pos, pos)
        && isInsideMapBorder(pos, game.tilemap.getBorders())
    ) {
        game.hero.pos = message.data.to;
        return {
            timeSpent: 1,
            status: MessageResponseStatus.Ok,
        };   
    } else {
        return {
            timeSpent: 0,
            status: MessageResponseStatus.NotAllowed
        };
    }
}