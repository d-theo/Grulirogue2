import { Item, ItemArgument } from "../entitybase/item";
import * as _ from 'lodash';
import { ItemVisitor } from "./item-visitor";
import { Hero } from "../hero/hero";
import { gameBus } from "../../eventBus/game-bus";
import { logPublished } from "../../events";
import { EffectTarget } from "../effects/definitions";

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

export class Potion extends Item implements ItemArgument {
    effect: (t:Hero) => ({});
    static colors: string[] = _.shuffle(_.cloneDeep(PotionColors));
    static mystery: any = {};
    static identified: any = {};
    constructor(args: any) {
        super(args);
        this.effect = args.effect;
        if (!Potion.mystery[this._name]) {
            Potion.mystery[this._name] = this.randomColor();
        }
        this.skin = Potion.mystery[this._name];
        this.keyMapping['q'] = this.use.bind(this);
        this.keyDescription['q'] = '(q)uaff';
        //this.keyDescription['t'] = '(t)hrow';
    }
    get description () {
        if (! Potion.identified[this.getColor()]) {
            return `Drink this ${this.getColor()} potion to see what it does`;
        } else {
            return this._description;
        }
    }
    get name () {
        if (! Potion.identified[this.getColor()]) {
            return `${this.getColor()} potion`;
        } else {
            return this._name;
        }
    }
    getColor() {
        return this.skin.split('-')[1];
    }
    randomColor() {
        return 'potion-'+Potion.colors.pop();
    }
    use(target: any) {
        if(! Potion.identified[this.getColor()]) {
            Potion.identified[this.getColor()] = true;
            gameBus.publish(logPublished({data: `It was a ${this._name}`, level: 'neutral'}));
        }
        this.effect(target);
    }
    visit(visitor: ItemVisitor) {
        return visitor.visitPotion(this);
    }
    reveal() {
        Potion.identified[this.getColor()] = true;
        this.identified = true;
    }
    getArgumentForKey(key: string) {
        switch(key) {
            case 'q': return EffectTarget.Hero;
            case 'd':
            default : return EffectTarget.None;
        }
    }
}