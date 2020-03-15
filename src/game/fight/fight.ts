import { Fighter } from "../entitybase/fighter";
import { Killable } from "../entitybase/killable";

export class Attack {
    constructor(private attacker: Fighter, private target: Killable) {}
    do() {
        const weapon = this.attacker.weapon;
        const armour = this.target.armour;
        return weapon.deal() - armour.absorbBase;
    }
}