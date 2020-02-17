import { Game } from "../game";
import { checkMoveAllowed } from "./preconditions/moveAllowed";
import {GameEventType} from '../events/events';
import {GameMessage} from '../events/messages';
import { MessageResponse, MessageResponseStatus } from "../utils/types";
import { Coordinate } from "shared";

export interface PlayerMoveMessage extends GameMessage {
    type: GameEventType.PlayerMove;
    data: {
        to: Coordinate
    }
}

export function playerMove(game: Game, message: PlayerMoveMessage): MessageResponse {
    try {
        checkMoveAllowed();
    } catch(e) {
        return {
            timeSpent: 0,
            status: MessageResponseStatus.NotAllowed,
            msg: JSON.stringify(e)
        };
    }
    game.hero.pos = message.data.to;
    return {
        timeSpent: 1,
        status: MessageResponseStatus.Ok,
    };
}