import { Hero } from './../hero';
import { gameBus } from "../../../eventBus/game-bus";
import { logPublished } from "../../../events";

export abstract class PassiveSkill {
    private xp = 0;
    private _level = 0;
    private xpTable = [30, 100, 150, 250, 450, 700, 1000, 1500, 3000, 10000];
    abstract name: string;
    abstract description: string;
    constructor(protected readonly hero: Hero) {}
    abstract onLevelUp(level: number);
    _modifier = 0;

    public get modifier () {return this._modifier;}
    public get level() {return this._level + this.modifier;}

    public addModifier(n: number) {
        this._modifier += n;
    }
    public addXp(xp: number) {
        const oldLevel = this.calcLevel();
        this.xp += xp;
        const newLevel = this.calcLevel();
        const delta = newLevel - oldLevel;
        if (delta > 0) {
            for (let i = oldLevel; i < newLevel; i++) {
                this.onLevelUp(i+1);
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