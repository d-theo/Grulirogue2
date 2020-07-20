import { gameBus, playerHealed } from "../../eventBus/game-bus";
import { pickInRange } from "../utils/random";

export class Health {
    currentHp: number;
    regenerationRate = 15;
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
        let moreHp = pickInRange('2-4');
        moreHp += pickInRange('1-2')+level;
        this.currentHp += moreHp;
        this.baseHp += moreHp;
        gameBus.publish(playerHealed({baseHp: this.baseHp, currentHp: this.currentHp}));
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
    getStrongerByHp(hp: number) {
        this.baseHp += hp;
        gameBus.publish(playerHealed({baseHp: this.baseHp, currentHp: this.currentHp}));
    }
    getWeakerByHp(hp: number) {
        this.baseHp -= hp;
        gameBus.publish(playerHealed({baseHp: this.baseHp, currentHp: this.currentHp}));
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