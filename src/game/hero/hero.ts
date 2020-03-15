import { Killable } from "../entitybase/killable";
import { Fighter } from "../entitybase/fighter";
import { Health } from "../entitybase/health";
import { Armour } from "../entitybase/armour";
import { Weapon } from "../entitybase/weapon";
import { Coordinate } from "../utils/coordinate";
import { Movable } from "../entitybase/movable";
import { Monster } from "../monsters/monster";
import { Buffs } from "../entitybase/buffable";
import { BuffEffect } from "../entitybase/effect";
import { EnchantTable, Enchantable } from "../entitybase/enchantable";
import { Inventory } from "./inventory";

export class Hero implements Movable, Killable, Fighter, Enchantable {
    health: Health;
    armour: Armour;
    weapon: Weapon;
    pos: Coordinate;
    enchants: EnchantTable = new EnchantTable();
    xp: number;
    buffs: Buffs = new Buffs();
    level: number = 1;
    inventory = new Inventory();
    constructor() {
        this.health = new Health(15);
        this.armour = new Armour({absord: 1});
        this.weapon = new Weapon({baseDamage: '3-5', range: 2});
        this.xp = 0;
    }

    gainXP(monster: Monster) {
        this.xp += monster.xp;
    }
    addBuff(buff: BuffEffect) {
        this.buffs.addBuff(buff);
    }
}