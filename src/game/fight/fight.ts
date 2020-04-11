import { Fighter } from "../entitybase/fighter";
import { Killable } from "../entitybase/killable";
import { Hero } from "../hero/hero";

export class Attack {
    constructor(private attacker: Fighter, private target: Killable) {}
    do() {
        let dodge = this.target.dodge;
        if ((this.target as any).level) {
            dodge += (this.attacker.level - (this.target as any).level) * 0.10;
        }
        if (Math.random() < dodge) {
            return 0;
        }

        const weapon = this.attacker.weapon;
        const armour = this.target.armour;
        let dealt = weapon.deal();
        for (const addition of weapon.additionnalEffects) {
            if (addition.target === 'target' && (this.target as any).addBuff) {
                addition.effect.cast(this.target);
            }
        }
        if (this.attacker instanceof Hero) {
            if (this.attacker.fightModifier.additionnalDmg) {
                dealt +=  this.attacker.fightModifier.additionnalDmg;
            }
            if (this.attacker.fightModifier.fistAdditionnalDmg &&
                this.attacker.weapon.skin.toLocaleLowerCase() === 'fist') {
                dealt += this.attacker.fightModifier.fistAdditionnalDmg;
            }
        }
        return Math.max(0, dealt - armour.baseAbsorb);
    }
}