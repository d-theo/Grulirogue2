"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Attack = /** @class */ (function () {
    function Attack(attacker, target) {
        this.attacker = attacker;
        this.target = target;
    }
    Attack.prototype.do = function () {
        var weapon = this.attacker.weapon;
        var armour = this.target.armour;
        this.target.health.take(weapon.baseDamage.pick() - armour.absorbBase);
    };
    return Attack;
}());
exports.Attack = Attack;
