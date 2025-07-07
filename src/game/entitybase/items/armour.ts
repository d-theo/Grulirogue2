import { SpellTarget } from '../../effects/spells';
import { Hero } from '../../hero/hero';
import { Buff2 } from '../buff';
import { Item, ItemArgument } from '../item';
import { ItemVisitor } from '../items/item-visitor';

export class Armour extends Item implements ItemArgument {
  private baseAbsorb: number;
  private additionalAbsorb: number = 0;
  public additionalName: string[] = [];
  public additionalDescription: string[] = [];
  public bulky: number;
  public onEquipBuffs: Buff2[] = []; // TODO enchant system
  public hitBeforeIdentified = 200;

  constructor(arg: any) {
    // Todo
    super(arg);
    this.isConsumable = false;
    this.baseAbsorb = arg.baseAbsorb || 0;
    this.bulky = arg.bulky || 0;
    this.keyMapping['w'] = this.use.bind(this);
    this.keyDescription['w'] = '(w)ear';
    this.onEquipBuffs = arg.onEquipBuffs || [];
  }

  get description(): string {
    if (this.identified) {
      let s = '';
      s += `Armour class: ${this.baseAbsorb} ${this.formatAbsorbBonus()}`;
      s += '\n\n';
      s += `${this.additionalDescription.join('\n')}`;
      return s;
    } else {
      return `An unidentified ${this._name}`;
    }
  }

  get name() {
    if (this.identified) {
      return this._name + ' ' + this.additionalName.join(' ') + ' ' + this.formatAbsorbBonus();
    } else {
      return `An unidentified ${this._name}`;
    }
  }

  get absorb() {
    return this.baseAbsorb + this.additionalAbsorb;
  }

  private formatAbsorbBonus(): string {
    if (this.additionalAbsorb === 0) return '';
    else if (this.additionalAbsorb > 0) return '+' + this.additionalAbsorb;
    else if (this.additionalAbsorb < 0) return '' + this.additionalAbsorb;
  }

  public modifyAbsorb(modifier: number) {
    this.baseAbsorb += modifier;
  }

  public addAbsorbEnchant(add: number) {
    this.additionalAbsorb += add;
  }

  public use(target: Hero) {
    target.equip(this);
    this.onEquipBuffs.forEach((b) => {
      b.source = this.id;
      target.addBuff(b);
    });
  }

  onUnEquip(target: Hero) {
    this.onEquipBuffs.forEach((b) => target.buffs.cleanBuffSource(this.id));
  }

  visit(itemVisitor: ItemVisitor) {
    return itemVisitor.visitArmor(this);
  }

  reveal() {
    this.identified = true;
  }

  getArgumentForKey(key: string) {
    return SpellTarget.Hero;
  }
}

export const NullArmour = new Armour({
  baseAbsorb: 0,
  name: '',
  description: '',
});
