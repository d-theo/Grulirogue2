import { Entity } from "../entitybase/entity";
import { Killable } from "../entitybase/killable";
import { Health } from "../entitybase/health";
import { Weapon } from "../entitybase/weapon";
import { Armour } from "../entitybase/armour";
import { Fighter } from "../entitybase/fighter";

export class Monster extends Entity implements Killable, Fighter {
    health: Health;
    armour: Armour;
    weapon: Weapon;
    constructor() {
        super();
        this.health = new Health(10);
        this.armour = new Armour({absorbBase: 1});
        this.weapon = new Weapon({});
    }
}