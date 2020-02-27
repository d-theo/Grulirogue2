import { Entity } from "../entitybase/entity";
import { Killable } from "../entitybase/killable";
import { Fighter } from "../entitybase/fighter";
import { Health } from "../entitybase/health";
import { Armour } from "../entitybase/armour";
import { Weapon } from "../entitybase/weapon";
import { Coordinate } from "../utils/coordinate";
import { Movable } from "../entitybase/movable";
import { Monster } from "../monsters/monster";

export class Hero implements Movable, Killable, Fighter {
    health: Health;
    armour: Armour;
    weapon: Weapon;
    pos: Coordinate;
    xp: number;
    constructor() {
        this.health = new Health(20);
        this.armour = new Armour({absord: 3});
        this.weapon = new Weapon({});
        this.pos = {x: 4, y: 0};
        this.xp = 0;
    }

    gainXP(monster: Monster) {
        this.xp += monster.xp;
    }
}