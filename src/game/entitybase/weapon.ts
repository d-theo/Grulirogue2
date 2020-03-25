import { Item } from "./item";
import { GameRange } from "../utils/range";
import { pickInRange } from "../utils/random";

export class Weapon extends Item {
    baseDamage: string;
    maxRange: number;
    constructor(arg: any) { // TODO
        super(arg);
        this.baseDamage = arg.baseDamage;
        this.maxRange = arg.maxRange || 1;
    }
    deal() {
        return pickInRange(this.baseDamage);
    }
}