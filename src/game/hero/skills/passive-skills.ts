import { Hero } from './../hero';
import { gameBus } from "../../../eventBus/game-bus";
import { logPublished } from "../../../events";

export abstract class PassiveSkill {
    private xp = 0;
    private _level = 0;
    private xpTable = [30, 60, 100, 200, 450, 700, 1000, 1500, 3000, 10000];
    abstract name: string;
    abstract description: string;
    abstract mapLevelValue;
    constructor(protected readonly hero: Hero) {}

    public get level() {return this._level }
    public get value() {
        if (this.level === 0) {
            return 0;
        } else {
            this.mapLevelValue[this.level-1];
        }
    }

    public addXp(xp: number) {
        const oldLevel = this.calcLevel();
        this.xp += xp;
        const newLevel = this.calcLevel();
        const delta = newLevel - oldLevel;
        if (delta > 0) {
            for (let i = oldLevel; i < newLevel; i++) {
                gameBus.publish(logPublished({data: `Your skill ${this.name} is now level ${i+1}`, level: 'success'}));
            }
        }
        this._level = newLevel;
    }
    public report() {
        return {
            level: this.level,
            name: this.name,
            description: this.description,
        };
    }
    private calcLevel() {
        for (let i = 0; i < this.xpTable.length; i++) {
            if (this.xp < this.xpTable[i]) {
                return i;
            }
        }
    }
}