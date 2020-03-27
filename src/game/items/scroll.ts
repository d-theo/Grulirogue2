import { Item } from "../entitybase/item";

export class Scroll extends Item {
    effect: Function
    constructor(args: any) {
        super(args);
        this.effect = args.effect;
    }
}