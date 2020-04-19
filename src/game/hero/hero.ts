import { Killable } from "../entitybase/killable";
import { Fighter } from "../entitybase/fighter";
import { Health } from "../entitybase/health";
import { Armour } from "../entitybase/armour";
import { Weapon } from "../entitybase/weapon";
import { Coordinate } from "../utils/coordinate";
import { Movable } from "../entitybase/movable";
import { Buffs } from "../entitybase/buffable";
import { EnchantTable, Enchantable } from "../entitybase/enchantable";
import { Inventory } from "./inventory";
import { BuffDefinition } from "../effects/effect";
import { Item } from "../entitybase/item";
import { FightModifier } from "../entitybase/fight-modifier";
import  HeroSkills from "./hero-skills";
import { gameBus, itemEquiped, enchantChanged } from "../../eventBus/game-bus";

const XP = [0, 30, 70, 115, 200, 300, 450, 700, 900];

export class Hero implements Movable, Killable, Fighter, Enchantable {
    name: string;
    health: Health;
    armour: Armour;
    dodge: number = 0.30;
    weapon: Weapon;
    pos!: Coordinate;
    enchants: EnchantTable = new EnchantTable(true);
    xp: number;
    nextXp!: number;
    buffs: Buffs = new Buffs();
    level: number = 1;
    private inventory = new Inventory();
    sight: number;
    speed: number = 1;
    fightModifier = new FightModifier();
    skillFlags = {
        regenHpOverTime: 0,
        gainHpPerLevel: 0,
        improvedPotionEffect: 0, // alchemist
        additionnalItemPerLevel: 0
    };
    heroSkills: HeroSkills;
    constructor() {
        this.name = "Grulito le brave";
        this.health = new Health(15);
        this.armour = new Armour({baseAbsorb: 0, name: 'Pyjamas', description: 'Your favorite pair of pyjamas for spleeping'});
        this.weapon = new Weapon({baseDamage: '2-4', maxRange: 1, name: 'Fist', description: 'Your fists are not prepared for this'});
        this.xp = 0;
        this.calcNextXp();
        this.sight = 8;
        this.addToBag(this.armour);
        this.addToBag(this.weapon);
        this.equip(this.armour);
        this.equip(this.weapon);
        this.heroSkills = new HeroSkills(this);
    }
    calcNextXp() {
        this.nextXp = XP[this.level] - XP[this.level-1];
    }
    openBag(filters?: string[]) {
        return this.inventory.openBag(filters);
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
        if (item instanceof Armour) {
            if (this.armour) {
                this.inventory.flagUnEquiped(this.armour);
            }
            this.armour = item;
        }
        gameBus.publish(itemEquiped({
            weapon: this.weapon,
            armour: this.armour
        }));
        this.inventory.flagEquiped(item);
    }
    gainXP(amount: number): {total: number, current: number, status: 'xp_gained' | 'level_up'} {
        let status: 'xp_gained' | 'level_up' = 'xp_gained';
        this.xp += amount;
        if (this.nextXp <= this.xp) {
            this.levelUp();
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
    levelUp() {
        this.level ++;
        this.calcNextXp();
        this.xp = 0;
        this.health.getStronger(this.skillFlags.gainHpPerLevel);
    }
    consumeItem(item: Item) {
        if (item.isUsed) {
            this.inventory.remove(item);
        }
    }
    regenHealth() {
        this.health.regenHealth();
    }
}