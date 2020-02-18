import { Game } from "./game";
import { GameEventType } from "./events/events";
import { GameMessage } from "./events/messages";

const game = new Game();
const move: GameMessage = {
    type: GameEventType.PlayerMove,
    data: {
        to: {
            x: 0,
            y: 1
        }
    }
};
const atk: GameMessage = {
    type: GameEventType.PlayerAttack,
    data: {
        to: {
            x: 0,
            y: 0
        }
    }
}

let res = game.handleMessage(move);
console.log(res);
res = game.handleMessage(atk);
console.log(res);