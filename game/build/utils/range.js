"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var _ = __importStar(require("lodash"));
var GameRange = /** @class */ (function () {
    function GameRange(start, end) {
        this.range = _.range(start, end, 1);
    }
    GameRange.prototype.pick = function () {
        var r = _.sample(this.range);
        if (r === undefined) {
            throw new Error('range not found');
        }
        else {
            return r;
        }
    };
    return GameRange;
}());
exports.GameRange = GameRange;
