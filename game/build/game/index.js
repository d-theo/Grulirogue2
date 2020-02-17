"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = require("./game");
var events_1 = require("./events/events");
var game = new game_1.Game();
var res = game.handleMessage({
    type: events_1.GameEventType.PlayerMove,
    data: {
        to: {
            x: 0,
            y: 1
        }
    }
});
console.log(res);
