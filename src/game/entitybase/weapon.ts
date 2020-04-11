import { Item } from "./item";
import { GameRange } from "../utils/range";
import { pickInRange } from "../utils/random";
import { ItemVisitor } from "../items/item-visitor";
import { IEffect } from "../effects/effects";

export class Weapon extends Item {
    baseDamage: string;
    additionnalDmg: number = 0;
    additionnalEffects: {effect: IEffect, target: 'attacker' | 'target'}[] = [];
    maxRange: number;
    constructor(arg: any) { // TODO
        super(arg);
        this.baseDamage = arg.baseDamage;
        this.maxRange = arg.maxRange || 1;
        this.keyMapping['w'] = this.use.bind(this);
        this.keyDescription['w'] = '(w)ield';
        this.description = `
kind: ${this.skin}
dammages: ${this.baseDamage} + ${this.additionnalDmg}
range: ${this.maxRange}`
    }

    deal() {
        return pickInRange(this.baseDamage)+this.additionnalDmg;
    }
    use(target: any) {
        target.equip(this);
    }
    visit(itemVisitor: ItemVisitor) {
        return itemVisitor.visitWeapon(this);
    }
}