import { gameBus, playerHealed } from "../../eventBus/game-bus";
import { pickInRange } from "../utils/random";

export class Health {
    currentHp: number;
    regenerationRate = 0;
    nextRegen = 0;
    constructor(public baseHp: number) {
        this.currentHp = baseHp;
    }
    regenHealth() {
        if (this.regenerationRate > 0) {
            if (this.currentHp === this.baseHp) {
                this.nextRegen = 0;
                return;
            }
            this.nextRegen ++;
            if (this.nextRegen >= this.regenerationRate) {
                this.nextRegen = 0;
                this.take(-1);
                gameBus.publish(playerHealed({baseHp: this.baseHp, currentHp: this.currentHp, isSilent: true}));
            }
        }
    }
    getStronger(level: number) {
        const lvlup = pickInRange('5-10') * level;
        this.currentHp += lvlup;
        this.baseHp += lvlup;
        gameBus.publish(playerHealed({baseHp: this.baseHp, currentHp: this.currentHp}));
    }
    take(hp: number): HealthReport {
        const oldHp = this.currentHp;
        this.currentHp = Math.min(this.currentHp-hp, this.baseHp);
        if (this.currentHp <= 0) {
            return {
                status: HealthStatus.Dead
                amount: this.currentHp
            }
        } else {
            if (this.currentHp > oldHp) {
                return {
                    status: HealthStatus.Healed,
                    amount: this.currentHp - oldHp
                };
            } else if (this.currentHp < oldHp) {
                return {
                    status: HealthStatus.Dammaged,
                    amount: this.currentHp - oldHp
                };
            } else {
                return {status: HealthStatus.Unaffected};
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