import {pickInRange} from "../utils/random";
import {ItemVisitor} from "./item-visitor";
import {SpellTarget} from "../effects/spells";
import {Item, ItemArgument} from "../entitybase/item";
import {Hero} from "../hero/hero";
import * as _ from 'lodash';
import {Buff2} from "../entitybase/buff";

export class Weapon extends Item implements ItemArgument {
  private baseDamage: string; // eg : '2-4'
  private additionnalDmg: number = 0;

  additionnalEffects: { chance: number, effect: Buff2, target: 'attacker' | 'target' }[] = [];
  additionalDescription: string[] = [];
  onEquipBuffs: Buff2[];
  additionalName: string[] = [];
  maxRange: number;
  public hitBeforeIdentified = 200;

  constructor(arg: any) { // FIXME
    super(arg);
    this.isConsumable = false;
    this.baseDamage = arg.baseDamage;
    this.maxRange = arg.maxRange || 1;
    this.keyMapping['w'] = this.use.bind(this);
    this.keyDescription['w'] = '(w)ield';
    this.onEquipBuffs = arg.onEquipBuffs || [];
  }

  get description() {
    let str = '';
    if (this.identified) {
      str += "\n";
      str += "kind: " + this.skin;
      str += "\n";
      str += `damages: ${this.baseDamage} ${this.formatAdditionnalDmg()}`;
      str += "\n";
      str += `range: ${this.maxRange}`;
      str += "\n";
      str += "\n";
      this.additionalDescription.forEach(d => {
        str += '* ' + d;
        str += "\n";
        str += "\n";
      });
    } else {
      str += "\n";
      str += "kind: " + this.skin;
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
        str += ` ${this.formatAdditionnalDmg()}`;
      }
      return str;
    } else {
      return `${this.skin} (unidentified)`;
    }
  }

  modifyAdditionnalDmg(modifier: number) {

  }

  formatAdditionnalDmg(): string {
    if (this.additionnalDmg === 0) return '';
    else if (this.additionnalDmg > 0) return '+' + this.additionnalDmg;
    else if (this.additionnalDmg < 0) return '' + this.additionnalDmg;
  }

  onUnEquip(target: Hero) {
    this.onEquipBuffs.forEach(b => target.buffs.cleanBuffSource(this.id));
  }

  deal() {
    return pickInRange(this.baseDamage) + this.additionnalDmg;
  }

  use(target: Hero) {
    target.equip(this);
    this.onEquipBuffs.forEach(b => {
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
    return SpellTarget.Hero;
  }
}

export const NullWeapon = new Weapon({baseDamage: '0-0', maxRange: 1, name: 'Fist', description: '-', kind: '-'});