import { Entity } from "../entitybase/entity";

export type Hit = {
    attacker: Entity,
    target: Entity;
    damage: number;
}
export class Attack {
    constructor(private attacker: Entity, private target: Entity) {}
    do() {
        let dodge = this.target.dodge;
        dodge += (this.attacker.level - this.target.level) * 0.10;
        dodge += this.attacker.precision;
        if (Math.random() < dodge) {
            return 0;
        }
        const weapon = this.attacker.weapon;
        const armour = this.target.armour;
        let dealt = weapon.deal();

        const hit = {
            attacker: this.attacker,
            target: this.target,
            damage: Math.max(0, dealt - armour.absorb)
        };

        this.attacker.onHit(hit);
        this.target.onBeHit(hit);
    }
}