import { Item } from "../entitybase/item";

export class Potion extends Item {
    effect: Function;
    static mystery: any = {};
    constructor(args: any) {
        super(args);
        this.effect = args.effect;
        if (!Potion.mystery[this.name]) {
            Potion.mystery[this.name] = this.randomColor();
        }
        this.skin = Potion.mystery[this.name];
    }
    randomColor() {
        return 'potion-red';
    }
}