import { Game } from "./game";
import { GameEventType } from "./events/events";
import { GameMessage } from "./events/messages";


const game = new Game();
const move1: GameMessage = {
    type: GameEventType.PlayerMove,
    data: {
        to: {
            x: 4,
            y: 1
        }
    }
};
const move2: GameMessage = {
    type: GameEventType.PlayerMove,
    data: {
        to: {
            x: 4,
            y: 2
        }
    }
};
const atk: GameMessage = {
    type: GameEventType.PlayerAttack,
    data: {
        to: {
            x: 2,
            y: 2
        }
    }
}

const moves = [
    move1,move2,atk
]

let res = game.compact();
console.log(res.join('\n'));
for (let m of moves) {
    res = game.handleMessage(m);
    console.log(res.join('\n'));
}