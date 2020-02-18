"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tilemap_1 = require("./tilemap/tilemap");
var hero_1 = require("./hero/hero");
var monsterCollection_1 = require("./monsters/monsterCollection");
var playerMove_1 = require("./use-cases/playerMove");
var events_1 = require("./events/events");
var Game = /** @class */ (function () {
    function Game() {
        this.tilemap = new tilemap_1.TileMap();
        this.hero = new hero_1.Hero();
        this.monsters = new monsterCollection_1.MonsterCollection();
        this.loopNb = 0;
        this.currentTurn = 0;
    }
    Game.prototype.handleMessage = function (msg) {
        var result;
        switch (msg.type) {
            case events_1.GameEventType.PlayerMove:
                result = playerMove_1.playerMove(this, msg);
                break;
            default: throw new Error('not implemented code: ' + JSON.stringify(msg));
        }
        this.checkNextTurn(result.timeSpent);
        this.loopNb++;
        return this;
    };
    Game.prototype.checkNextTurn = function (timeSpent) {
        this.currentTurn += timeSpent;
        if (this.currentTurn >= 100) {
            this.currentTurn = 0;
            return 1;
        }
        else {
            return 0;
        }
    };
    return Game;
}());
exports.Game = Game;
