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

export class Hero implements Movable, Killable, Fighter, Enchantable {
    health: Health;
    armour: Armour;
    weapon: Weapon;
    pos: Coordinate;
    enchants: EnchantTable = new EnchantTable();
    xp: number;
    buffs: Buffs = new Buffs();
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
    addBuff(buff: BuffEffect) {
        this.buffs.addBuff(buff);
    }
}