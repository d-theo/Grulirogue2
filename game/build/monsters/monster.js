"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var entity_1 = require("../entitybase/entity");
var health_1 = require("../entitybase/health");
var weapon_1 = require("../entitybase/weapon");
var armour_1 = require("../entitybase/armour");
var Monster = /** @class */ (function (_super) {
    __extends(Monster, _super);
    function Monster() {
        var _this = _super.call(this) || this;
        _this.health = new health_1.Health(10);
        _this.armour = new armour_1.Armour({ absorbBase: 1 });
        _this.weapon = new weapon_1.Weapon({});
        return _this;
    }
    return Monster;
}(entity_1.Entity));
exports.Monster = Monster;
