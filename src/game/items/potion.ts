import { Item } from "../entitybase/item";
import * as _ from 'lodash';
import { IEffect } from "../effects/effects";
import { ItemVisitor } from "./item-visitor";

export const PotionColors = [
    'blue',
    'dark',
    'red',
    'brown',
    'pink',
    'orange',
    'yellow',
    'green',
    'purple',
    'white'
];

export class Potion extends Item {
    effect: IEffect;
    static colors: string[] = _.shuffle(_.cloneDeep(PotionColors));
    static mystery: any = {};
    constructor(args: any) {
        super(args);
        this.effect = args.effect;
        if (!Potion.mystery[this.name]) {
            Potion.mystery[this.name] = this.randomColor();
        }
        this.skin = Potion.mystery[this.name];
        this.keyMapping['q'] = this.use.bind(this);
        this.keyDescription['q'] = '(q)uaff';
    }
    randomColor() {
        return 'potion-'+Potion.colors.pop();
    }
    use(target: any) {
        this.effect.cast(target);
    }
    visit(visitor: ItemVisitor) {
        return visitor.visitPotion(this);
    }
}