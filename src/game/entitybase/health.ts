import { gameBus } from "../../eventBus/game-bus";
import { pickInRange } from "../utils/random";
import { playerHealed } from "../../events";

export class Health {
    currentHp: number;
    regenerationRate = 15;
    tickPerRegen = 1;
    nextRegen = 0;
    constructor(public _baseHp: number) {
        this.currentHp = _baseHp;
    }
    get baseHp () {
        return this._baseHp;
    }
    update() {
        if (this.regenerationRate > 0) {
            if (this.currentHp === this.baseHp) {
                this.nextRegen = 0;
                return;
            }
            this.nextRegen ++;
            if (this.nextRegen >= this.regenerationRate) {
                this.nextRegen = 0;
                this.take(-this.tickPerRegen);
                gameBus.publish(playerHealed({baseHp: this.baseHp, currentHp: this.currentHp, isSilent: true}));
            }
        }
    }
    take(hp: number): HealthReport {
        const oldHp = this.currentHp;
        this.currentHp = Math.min(this.currentHp-hp, this.baseHp);
        if (this.currentHp <= 0) {
            return {
                status: HealthStatus.Dead,
                amount: -hp
            }
        } else {
            if (this.currentHp > oldHp) {
                return {
                    status: HealthStatus.Healed,
                    amount: +hp
                };
            } else if (this.currentHp < oldHp) {
                return {
                    status: HealthStatus.Dammaged,
                    amount: -hp
                };
            } else {
                return {status: HealthStatus.Unaffected, amount: 0};
            }
        }
    }
}

export type HealthReport = {
    status: HealthStatus;
    amount: number;
}

export enum HealthStatus {
    Dead = 0,
    Healed = 1,
    Dammaged = 2,
    Unaffected = 3
}