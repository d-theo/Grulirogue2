import { Hero } from '../hero/hero';
import { Entity } from '../entitybase/entity';

export class Attack {
  constructor(
    private attacker: Entity,
    private target: Entity
  ) {}
  do() {
    let dodge = this.target.dodge;
    dodge += (this.attacker.level - this.target.level) * 0.1;
    dodge -= this.target.armour.bulky;
    dodge += this.attacker.precision;

    if (Math.random() < dodge) {
      return 0;
    }

    const weapon = this.attacker.weapon;
    const armour = this.target.armour;
    let dealt = weapon.deal();

    for (const addition of weapon.additionnalEffects) {
      if (addition.target === 'target' && (this.target as any).addBuff && Math.random() <= addition.chance) {
        this.target.buffs.addBuff(addition.effect);
      }
    }

    if (this.attacker instanceof Hero) {
      if (this.attacker.fightModifier.additionnalDmg) {
        dealt += this.attacker.fightModifier.additionnalDmg;
      }
      if (this.attacker.fightModifier.fistAdditionnalDmg && this.attacker.weapon.skin === 'Fist') {
        dealt += this.attacker.fightModifier.fistAdditionnalDmg;
      }
    }
    return Math.max(0, dealt - armour.absorb);
  }
}
