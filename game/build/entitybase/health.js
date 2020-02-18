"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Health = /** @class */ (function () {
    function Health(baseHp) {
        this.baseHp = baseHp;
        this.currentHp = baseHp;
    }
    Health.prototype.take = function (hp) {
        var oldHp = this.currentHp;
        this.currentHp = Math.min(this.currentHp + hp, this.baseHp);
        if (this.currentHp <= 0) {
            return {
                status: HealthStatus.Dead
            };
        }
        else {
            if (this.currentHp > oldHp) {
                return {
                    status: HealthStatus.Healed,
                    amount: this.currentHp - oldHp
                };
            }
            else if (this.currentHp < oldHp) {
                return {
                    status: HealthStatus.Dammaged,
                    amount: this.currentHp - oldHp
                };
            }
            else {
                return { status: HealthStatus.Unaffected };
            }
        }
    };
    return Health;
}());
exports.Health = Health;
var HealthStatus;
(function (HealthStatus) {
    HealthStatus[HealthStatus["Dead"] = 0] = "Dead";
    HealthStatus[HealthStatus["Healed"] = 1] = "Healed";
    HealthStatus[HealthStatus["Dammaged"] = 2] = "Dammaged";
    HealthStatus[HealthStatus["Unaffected"] = 3] = "Unaffected";
})(HealthStatus = exports.HealthStatus || (exports.HealthStatus = {}));
