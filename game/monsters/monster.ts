import { Entity } from "../entitybase/entity";
import { Killable } from "../entitybase/killable";
import { Health } from "../entitybase/health";
import { Weapon } from "../entitybase/weapon";
import { Armour } from "../entitybase/armour";
import { Fighter } from "../entitybase/fighter";

export class Monster implements Movable, Killable, Fighter {
    health: Health;
    armour: Armour;
    weapon: Weapon;
    pos: Coordinate;
    constructor(arg: {x?: number, y?: number}) {
        this.pos = {
            x: arg.x || 2,
            y: arg.y || 2,
        };
        this.health = new Health(10);
        this.armour = new Armour({absorbBase: 1});
        this.weapon = new Weapon({});
    }
}