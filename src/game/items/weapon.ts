import { pickInRange } from "../utils/random";
import { ItemVisitor } from "../items/item-visitor";
import { EffectTarget } from "../effects/spells";
import { Item, ItemArgument } from "../entitybase/item";
import { BuffDefinition } from "../effects/effect";
import { Hero } from "../hero/hero";
import { Affect } from "../effects/affects";
import * as _ from 'lodash';

export class Weapon extends Item implements ItemArgument {
    baseDamage: string;
    additionnalDmg: number = 0;
    additionnalEffects: {chance: number, effect: BuffDefinition, target: 'attacker' | 'target'}[] = [];
    additionalDescription: string[]=[];

    private additionnalBuff: BuffDefinition[] = []; // pas oublier le sourceID !

    additionalName: string[]=[];
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
        let str = '';
        if (this.identified) {
            str += "\n";
            str += "kind: "+this.skin;
            str += "\n";
            str += `damages: ${this.baseDamage} + ${this.additionnalDmg}`;
            str += "\n";
            str += `range: ${this.maxRange}`;
            str += "\n";
            str += "\n";
            this.additionalDescription.forEach(d => {
                str += '* '+d;
                str += "\n";
                str += "\n";
            });
        } else {
            str += "\n";
            str += "kind: "+this.skin;
            str += "\n";
            str += `damages: ${this.baseDamage}`;
            str += "\n";
            str += `range: ${this.maxRange}`;
            str += "\n";
        }
        return str;
    }
    get name() {
        if (this.identified) {
            let str = this._name;
            if (this.additionalName.length > 0) {
                str += ' of ';
                str += this.additionalName.join(' and ');
                str += ' + ' + this.additionnalDmg;
            }
            return str;
        } else {
            return `${this.skin} (unidentified)`;
        }
    }
    onUnEquip(target: Hero) {
        this.additionnalBuff.forEach(b => target.buffs.cleanBuffSource(this.id));
    }
    deal() {
        return pickInRange(this.baseDamage)+this.additionnalDmg;
    }
    use(target: Hero) {
        target.equip(this);
        this.additionnalBuff.forEach(b => {
            b.source = this.id;
            target.buffs.addBuff(_.cloneDeep(b));
        });
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

export const NullWeapon = new Weapon({baseDamage: '0-0', maxRange: 1, name: 'Fist', description: '-', kind: '-'});