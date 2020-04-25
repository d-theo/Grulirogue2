import { Item, ItemArgument } from "../entitybase/item";
import { ItemVisitor } from "./item-visitor";
import { IEffect, EffectTarget } from "../effects/effects";
import * as _ from 'lodash';
import { gameBus, logPublished } from "../../eventBus/game-bus";

export const ScrollType = [
    'RFDFTY',
    'HKLUZRIJLI',
    'LKUFJBH',
    'UKYJHB LFK',
    'NKHVC',
    'RRHEIPV',
    'DFIONV YHE PO',
    'DFGBIKN',
];

export class Scroll extends Item implements ItemArgument {
    effect: IEffect
    target: any;
    static scrollType: string[] = _.shuffle(_.cloneDeep(ScrollType));
    static mystery: any = {};
    static identified: any = {};
    constructor(args: any) {
        super(args);

        if (!Scroll.mystery[this._name]) {
            Scroll.mystery[this._name] = this.randomFormula();
        }

        this.effect = args.effect;
        this.keyMapping['r'] = this.use.bind(this);
        this.keyDescription['r'] = '(r)ead';
        this.skin = 'scroll';
    }
    setTarget(target: any) {
        this.target = target;
        return this;
    }
    get description () {
        if (! Scroll.identified[this.getFormula()]) {
            return `A strange scroll with ${this.getFormula()} written on it. Read the scroll to unleash its magic...`;
        } else {
            return this._description;
        }
    }
    get name () {
        if (Scroll.identified[this.getFormula()]) {
            return this._name;
        } else {
            return `${this.getFormula()} scroll`;
        }
    }
    getFormula() {
        return Scroll.mystery[this._name].split('-')[1];
    }
    randomFormula() {
        return 'scroll-'+Scroll.scrollType.pop();
    }
    use(target: any) {
        if (!Scroll.identified[this.getFormula()]) {
            gameBus.publish(logPublished({data: `It was a ${this._name}`, level: 'neutral'}));
            this.reveal();
        }
        this.isUsed = true;
        this.effect.cast(target);
    }
    visit(visitor: ItemVisitor) {
        return visitor.visitScroll(this);
    }
    reveal() {
        Scroll.identified[this.getFormula()] = true;
        this.identified = true;
    }

    getArgumentForKey(key: string) {
        switch(key) {
            case 'r': return this.effect.type
            case 'd': 
            default : return EffectTarget.None;
        }
    }
}