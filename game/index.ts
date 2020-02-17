import { Game } from "./game";
import { GameEventType } from "./events/events";

const game = new Game();
const res = game.handleMessage({
    type: GameEventType.PlayerMove,
    data: {
        to: {
            x: 0,
            y: 1
        }
    }
});
console.log(res);