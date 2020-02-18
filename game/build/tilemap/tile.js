"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tileType_1 = require("./tileType");
var TileVisibility;
(function (TileVisibility) {
    TileVisibility[TileVisibility["OnSight"] = 0] = "OnSight";
    TileVisibility[TileVisibility["Hidden"] = 1] = "Hidden";
    TileVisibility[TileVisibility["Far"] = 2] = "Far";
})(TileVisibility = exports.TileVisibility || (exports.TileVisibility = {}));
var Tile = /** @class */ (function () {
    function Tile(arg) {
        this.pos = { x: arg.x, y: arg.y };
        this.visibility = arg.visibility || TileVisibility.Hidden;
        this.type = arg.type || tileType_1.TileType.Void;
    }
    return Tile;
}());
exports.Tile = Tile;
