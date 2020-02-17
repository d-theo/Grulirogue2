"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tile = /** @class */ (function () {
    function Tile(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.pos = { x: x, y: y };
    }
    return Tile;
}());
exports.Tile = Tile;
