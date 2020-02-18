"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tile_1 = require("./tile");
var TileMap = /** @class */ (function () {
    function TileMap() {
        this.width = 3;
        this.height = 3;
        var tiles = [];
        var lines = [];
        for (var lineNb = 0; lineNb < this.height; lineNb++) {
            for (var colNb = 0; colNb < this.width; colNb++) {
                lines.push(new tile_1.Tile({ x: colNb, y: lineNb }));
            }
            tiles.push(lines);
            lines = [];
        }
        this.tiles = tiles;
    }
    return TileMap;
}());
exports.TileMap = TileMap;
