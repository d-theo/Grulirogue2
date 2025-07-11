import * as _ from 'lodash';
import { ItemVisitor } from './item-visitor';
import { logPublished } from '../../events';
import { gameBus } from '../../../infra/events/game-bus';
import { SpellTarget } from '../../effects/spells';
import { Hero } from '../../hero/hero';
import { Item, ItemArgument } from '../item';

export const PotionColors = ['blue', 'dark', 'red', 'brown', 'pink', 'orange', 'yellow', 'green', 'purple', 'white'];

export class Potion extends Item implements ItemArgument {
  effect: (t: Hero) => {};
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

  get description() {
    if (!Potion.identified[this.getColor()]) {
      return `Drink this ${this.getColor()} potion to see what it does`;
    } else {
      return this._description;
    }
  }

  get name() {
    if (!Potion.identified[this.getColor()]) {
      return `${this.getColor()} potion`;
    } else {
      return this._name;
    }
  }

  getColor() {
    return this.skin.split('-')[1];
  }

  randomColor() {
    return 'potion-' + Potion.colors.pop();
  }

  use(target: any) {
    /*if (target instanceof Hero && target.heroSkills.getSkillLevel(SkillNames.Alchemist) > 0) {
        if (this.effect.turns) {
            this.effect.turns += 5 * target.heroSkills.getSkillLevel(SkillNames.Alchemist);
        }
    } FIXME */
    if (!Potion.identified[this.getColor()]) {
      Potion.identified[this.getColor()] = true;
      gameBus.publish(logPublished({ data: `It was a ${this._name}`, level: 'neutral' }));
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
    switch (key) {
      case 'q':
        return SpellTarget.Hero;
      case 'd':
      default:
        return SpellTarget.None;
    }
  }
}
