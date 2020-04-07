import { Fighter } from "../entitybase/fighter";
import { Killable } from "../entitybase/killable";

export class Attack {
    constructor(private attacker: Fighter, private target: Killable) {}
    do() {
        let dodge = this.target.dodge;
        if ((this.target as any).level) {
            console.log('??',(this.attacker.level - (this.target as any).level));
            dodge += (this.attacker.level - (this.target as any).level) * 0.10;
        }
        console.log(dodge);
        if (Math.random() < dodge) {
            return 0;
        }

        const weapon = this.attacker.weapon;
        const armour = this.target.armour;
        const dealt = weapon.deal();
        return Math.max(0, dealt - armour.baseAbsorb);
    }
}