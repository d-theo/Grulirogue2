import { Killable } from "../entitybase/killable";
import { Health } from "../entitybase/health";
import { Weapon } from "../entitybase/weapon";
import { Armour } from "../entitybase/armour";
import { Fighter } from "../entitybase/fighter";
import { Movable } from "../entitybase/movable";
import { Coordinate } from "../utils/coordinate";

export class Monster implements Movable, Killable, Fighter {
    health: Health;
    armour: Armour;
    weapon: Weapon;
    pos: Coordinate;
    xp: number;
    behaviors: Map<string, Function> = new Map();

    constructor(arg: {x?: number, y?: number}) {
        this.pos = {
            x: arg.x || 2,
            y: arg.y || 2,
        };
        this.health = new Health(10);
        this.armour = new Armour({absorbBase: 1});
        this.weapon = new Weapon({});
        this.xp = 100;
    }

    play() {

    }
}