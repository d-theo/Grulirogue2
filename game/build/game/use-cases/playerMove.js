"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var moveAllowed_1 = require("./preconditions/moveAllowed");
var types_1 = require("../utils/types");
function playerMove(game, message) {
    try {
        moveAllowed_1.checkMoveAllowed();
    }
    catch (e) {
        return {
            timeSpent: 0,
            status: types_1.MessageResponseStatus.NotAllowed,
            msg: JSON.stringify(e)
        };
    }
    game.hero.pos = message.data.to;
    return {
        timeSpent: 1,
        status: types_1.MessageResponseStatus.Ok,
    };
}
exports.playerMove = playerMove;
