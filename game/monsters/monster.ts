import { Killable } from "../entitybase/killable";
import { Health } from "../entitybase/health";
import { Weapon } from "../entitybase/weapon";
import { Armour } from "../entitybase/armour";
import { Fighter } from "../entitybase/fighter";
import { Movable } from "../entitybase/movable";
import { Coordinate } from "../utils/coordinate";
import { Buffs } from "../entitybase/buffable";
import { BuffEffect } from "../entitybase/effect";
import { Enchantable, EnchantTable } from "../entitybase/enchantable";

export class Monster implements Movable, Killable, Fighter, Enchantable {
    health: Health;
    armour: Armour;
    weapon: Weapon;
    pos: Coordinate;
    xp: number;
    behaviors: Map<string, Function> = new Map();
    buffs: Buffs;
    enchants = new EnchantTable();
    constructor(arg: {x?: number, y?: number}) {
        this.pos = {
            x: arg.x || 2,
            y: arg.y || 2,
        };
        this.buffs = new Buffs();
        this.health = new Health(10);
        this.armour = new Armour({absorbBase: 1});
        this.weapon = new Weapon({});
        this.xp = 100;
    }
    addBuff(buff: BuffEffect) {
        this.buffs.addBuff(buff);
    }
}