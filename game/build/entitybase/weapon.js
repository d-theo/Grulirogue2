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
var item_1 = require("./item");
var range_1 = require("../utils/range");
var Weapon = /** @class */ (function (_super) {
    __extends(Weapon, _super);
    function Weapon(arg) {
        var _this = _super.call(this, arg) || this;
        _this.baseDamage = arg.baseDamage || new range_1.GameRange(0, 1);
        return _this;
    }
    return Weapon;
}(item_1.Item));
exports.Weapon = Weapon;
