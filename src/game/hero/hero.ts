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
    dodge: number = 0.30;
    weapon: Weapon;
    pos!: Coordinate;
    enchants: EnchantTable = new EnchantTable();
    xp: number;
    nextXp: number;
    buffs: Buffs = new Buffs();
    level: number = 1;
    private inventory = new Inventory();
    sight: number;
    speed: number = 1;
    constructor() {
        this.name = "grul le brave";
        this.health = new Health(15);
        this.armour = new Armour({baseAbsorb: 0, name: 'pyjama', description: 'your favorite pyjama for spleeping'});
        this.weapon = new Weapon({baseDamage: /*'2-4'*/'15-15', maxRange: 10, name: 'fist', description: 'your fists are not prepared for this'});
        this.xp = 0;
        this.calcNextXp();
        this.sight = 8;
        this.addToBag(this.armour);
        this.addToBag(this.weapon);
        this.equip(this.armour);
        this.equip(this.weapon);
    }
    calcNextXp() {
        this.nextXp = (75*(this.level*this.level)) - (125*this.level) + (100);
    }
    openBag() {
        return this.inventory.openBag();
    }
    addToBag(item: Item) {
        this.inventory.add(item);
    }
    dropItem(item: Item) {
        item.pos = this.pos;
        this.inventory.flagEquiped(item);
        this.inventory.remove(item);
    }
    equip(item: Item) {
        if (item instanceof Weapon) {
            if (this.weapon) {
                this.inventory.flagUnEquiped(this.weapon);
            }
            this.weapon = item;
        }
        this.inventory.flagEquiped(item);
    }
    gainXP(monster: Monster): {total: number, current: number, status: 'xp_gained' | 'level_up'} {
        let status: 'xp_gained' | 'level_up' = 'xp_gained';
        this.xp += monster.xp;
        console.log(monster.xp);
        if (this.nextXp < this.xp) {
            this.level ++;
            this.calcNextXp();
            this.xp = 0;
            status = 'level_up';
        }
        return {
            total: this.nextXp,
            current: this.xp,
            status
        };
    }
    addBuff(buff: BuffDefinition) {
        this.buffs.addBuff(buff);
    }
    resolveBuffs() {
        this.buffs.apply(this);
    }
    getItem(item: Item) {
        return this.inventory.getItem(item);
    }
    levelUp() {}
    consumeItem(item: Item) {
        if (item.isUsed) {
            this.inventory.remove(item);
        }
    }
}