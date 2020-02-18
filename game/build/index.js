"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = require("./game");
var events_1 = require("./events/events");
var game = new game_1.Game();
var move = {
    type: events_1.GameEventType.PlayerMove,
    data: {
        to: {
            x: 0,
            y: 1
        }
    }
};
var atk = {
    type: events_1.GameEventType.PlayerAttack,
    data: {
        to: {
            x: 0,
            y: 0
        }
    }
};
var res = game.handleMessage(move);
console.log(res);
res = game.handleMessage(atk);
console.log(res);
