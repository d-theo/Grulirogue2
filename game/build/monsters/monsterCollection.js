"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var monster_1 = require("./monster");
var MonsterCollection = /** @class */ (function () {
    function MonsterCollection() {
        this.monsters = [new monster_1.Monster()];
    }
    return MonsterCollection;
}());
exports.MonsterCollection = MonsterCollection;
