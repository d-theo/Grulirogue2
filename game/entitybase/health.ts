export class Health {
    currentHp: number;
    constructor(public baseHp: number) {
        this.currentHp = baseHp;
    }
    take(hp: number): HealthReport {
        const oldHp = this.currentHp;
        this.currentHp = Math.min(this.currentHp+hp, this.baseHp);
        if (this.currentHp <= 0) {
            return {
                status: HealthStatus.Dead
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
    amount?: number;
}

export enum HealthStatus {
    Dead = 0,
    Healed = 1,
    Dammaged = 2,
    Unaffected = 3
}