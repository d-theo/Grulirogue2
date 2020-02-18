import { Entity } from "../entitybase/entity";
import { Killable } from "../entitybase/killable";
import { Fighter } from "../entitybase/fighter";
import { Health } from "../entitybase/health";
import { Armour } from "../entitybase/armour";
import { Weapon } from "../entitybase/weapon";

export class Hero extends Entity implements Killable, Fighter {
    health: Health;
    armour: Armour;
    weapon: Weapon;
    constructor() {
        super();
        this.health = new Health(20);
        this.armour = new Armour({absord: 3});
        this.weapon = new Weapon({});
    }
}