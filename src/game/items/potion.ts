import { Item } from "../entitybase/item";
import * as _ from 'lodash';
import { IEffect } from "../effects/effects";
import { ItemVisitor } from "./item-visitor";
import { Hero } from "../hero/hero";
import { SkillNames } from "../hero/hero-skills";

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
        if (target instanceof Hero && target.heroSkills.getSkillLevel(SkillNames.Alchemist) > 0) {
            if (this.effect.turns) {
                this.effect.turns += 5 * target.heroSkills.getSkillLevel(SkillNames.Alchemist);
            }
        }
        Potion.identified[this.getColor()] = true;
        this.effect.cast(target);
        this.isUsed = true;
    }
    visit(visitor: ItemVisitor) {
        return visitor.visitPotion(this);
    }
    reveal() {
        Potion.identified[this.getColor()] = true;
        this.identified = true;
    }
}