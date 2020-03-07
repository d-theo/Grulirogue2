import { Item } from "./item";

export class Armour extends Item {
    public absorbBase: number;
    constructor(arg: any) { // Todo
        super(arg);
        this.absorbBase = arg.absorbBase || 0;
    }
}