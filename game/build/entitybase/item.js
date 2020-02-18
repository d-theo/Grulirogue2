"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Item = /** @class */ (function () {
    function Item(arg) {
        this.pos = {
            x: arg.x || 0,
            y: arg.y || 0
        };
        this.description = arg.description || '';
        this.name = arg.name || '';
    }
    return Item;
}());
exports.Item = Item;
