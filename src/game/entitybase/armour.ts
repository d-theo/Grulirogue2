import { Item } from "./item";

export class Armour extends Item {
    public baseAbsorb: number;
    constructor(arg: any) { // Todo
        super(arg);
        this.baseAbsorb = arg.baseAbsorb || 0;
    }
}