import { Item } from "./item";
import { GameRange } from "../utils/range";

export class Weapon extends Item {
    baseDamage: GameRange;
    maxRange: number;
    constructor(arg: any) { // Todo
        super(arg);
        this.baseDamage = arg.baseDamage || new GameRange(0,1);
        this.maxRange = arg.maxRange || 1;
    }
}