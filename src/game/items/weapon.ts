import { pickInRange } from "../utils/random";
import { ItemVisitor } from "../items/item-visitor";
import { IEffect, EffectTarget } from "../effects/effects";
import { Item, ItemArgument } from "../entitybase/item";

export class Weapon extends Item implements ItemArgument {
    baseDamage: string;
    additionnalDmg: number = 0;
    additionnalEffects: {chance: number, effect: IEffect, target: 'attacker' | 'target'}[] = [];
    additionalDescription: string[]=[];
    maxRange: number;
    constructor(arg: any) { // FIXME
        super(arg);
        this.isConsumable = false;
        this.baseDamage = arg.baseDamage;
        this.maxRange = arg.maxRange || 1;
        this.keyMapping['w'] = this.use.bind(this);
        this.keyDescription['w'] = '(w)ield';
    }

    get description () {
        if (this.identified) {
            return `
            kind: ${this.skin}
            dammages: ${this.baseDamage} + ${this.additionnalDmg}
            range: ${this.maxRange}
            ${this.additionalDescription.join('\n')}`;
        } else {
            return `
            kind: ${this.skin}
            dammages: ${this.baseDamage}
            range: ${this.maxRange}`;
        }
    }
    get name() {
        if (this.identified) {
            return this._name;
        } else {
            return `${this.skin} (unidentified)`;
        }
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
    reveal() {
        this.identified = true;
    }
    getArgumentForKey(key: string) {
        return EffectTarget.Hero;
    }
}