import { Killable } from "../entitybase/killable";
import { Fighter } from "../entitybase/fighter";
import { Health } from "../entitybase/health";
import { Armour } from "../entitybase/armour";
import { Weapon } from "../entitybase/weapon";
import { Coordinate } from "../utils/coordinate";
import { Movable } from "../entitybase/movable";
import { Monster } from "../monsters/monster";
import { Buffs } from "../entitybase/buffable";
import { EnchantTable, Enchantable } from "../entitybase/enchantable";
import { Inventory } from "./inventory";
import { BuffDefinition } from "../effects/effect";
import { Item } from "../entitybase/item";

export class Hero implements Movable, Killable, Fighter, Enchantable {
    name: string;
    health: Health;
    armour: Armour;
    weapon: Weapon;
    pos!: Coordinate;
    enchants: EnchantTable = new EnchantTable();
    xp: number;
    buffs: Buffs = new Buffs();
    level: number = 1;
    private inventory = new Inventory();
    constructor() {
        this.name = "grul le brave";
        this.health = new Health(15);
        this.armour = new Armour({baseAbsorb: 0, name: 'pyjama', description: 'your favorite pyjama for spleeping'});
        this.weapon = new Weapon({baseDamage: '2-4', maxRange: 1, name: 'fist', description: 'your fists are not prepared for this'});
        this.xp = 0;
        this.addToBag(this.armour);
        this.addToBag(this.weapon);
        this.equip(this.armour);
        this.equip(this.weapon);
    }
    openBag() {
        return this.inventory.openBag();
    }
    addToBag(item: Item) {
        this.inventory.add(item);
    }
    equip(item: Item) {
        this.inventory.flagEquiped(item);
    }
    gainXP(monster: Monster) {
        this.xp += monster.xp;
    }
    addBuff(buff: BuffDefinition) {
        this.buffs.addBuff(buff);
    }
    resolveBuffs() {
        this.buffs.apply(this);
    }
    levelUp() {}
}