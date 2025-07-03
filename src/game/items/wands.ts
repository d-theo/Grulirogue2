import {Item, ItemArgument} from "../entitybase/item";
import {ItemVisitor} from "./item-visitor";
import * as _ from 'lodash';
import {gameBus} from "../../eventBus/game-bus";
import {Spell, SpellTarget} from "../effects/spells";
import {logPublished} from "../../events";

export class Wand extends Item implements ItemArgument {
  effect: Spell;
  cooldown = 500;
  currentCooldown = 0;
  isConsumable = false;

  constructor(args: any) {
    super(args);
    this.effect = args.effect();
    this.keyMapping['z'] = this.use.bind(this);
    this.keyDescription['z'] = '(z)ap';
    this.skin = args.skin;
    this.identified = true;
  }

  get description() {
    if (!this.identified) {
      return `A stick with stranges inscriptions on it`;
    } else {
      let str = this._description;
      str += "\n\n";
      str += "turns before next zap: " + this.currentCooldown;
      return str;
    }
  }

  get name() {
    if (this.identified) {
      return this._name;
    } else {
      return 'Colored stick';
    }
  }

  use(target: any) {
    if (this.currentCooldown > 0) {
      return;
    }
    if (!this.identified) {
      gameBus.publish(logPublished({data: `It was a ${this._name}`, level: 'neutral'}));
      this.reveal();
    }
    this.effect.cast(target);
    this.currentCooldown = this.cooldown;
    this.identified = true;
  }

  visit(visitor: ItemVisitor): any {
    return visitor.visitWand(this);
  }

  reveal() {
    this.identified = true;
  }

  getArgumentForKey(key: string) {
    switch (key) {
      case 'z':
        return this.effect.type;
      case 'd':
      default :
        return SpellTarget.None;
    }
  }

  update() {
    this.currentCooldown = Math.max(0, this.currentCooldown - 1);
  }
}