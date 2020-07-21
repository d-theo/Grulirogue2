import { Health } from "../entitybase/health";
import { Coordinate } from "../utils/coordinate";
import { Buffs } from "../entitybase/buffable";
import { EnchantTable } from "../entitybase/enchantable";
import { Inventory } from "./inventory";
import { BuffDefinition } from "../effects/effect";
import { Item } from "../entitybase/item";
import { FightModifier } from "../entitybase/fight-modifier";
import  HeroSkills from "./hero-skills";
import { gameBus, itemEquiped } from "../../eventBus/game-bus";
import { Armour, NullArmour } from "../items/armour";
import { Weapon, NullWeapon } from "../items/weapon";
import { Entity } from "../entitybase/entity";
import { EnchantSolver } from "../effects/affects";
import { DamageResolution } from "../fight/damages";

const XP = [0, 30, 70, 130, 210, 300, 450, 700, 900];

export class Hero implements Entity {
    name: string;
    health: Health;
    armour: Armour;
    dodge: number = 0.30;
    weapon: Weapon;
    pos!: Coordinate;
    precision: number = 0;
    enchants: EnchantTable = new EnchantTable(true);
    xp: number;
    nextXp!: number;
    buffs: Buffs = new Buffs();
    level: number = 1;
    private inventory = new Inventory();
    public sight: number;
    speed: number = 1;
    fightModifier = new FightModifier();
    enchantSolver: EnchantSolver;
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
        this.weapon = new Weapon({baseDamage: '2-4', maxRange: 1, name: 'Fist', description: 'Your fists are not prepared for this', kind: "Fist", skin: "Fist"});
        this.xp = 0;
        this.calcNextXp();
        this.sight = 8;
        this.addToBag(this.armour);
        this.addToBag(this.weapon);
        this.equip(this.armour);
        this.equip(this.weapon);
        this.heroSkills = new HeroSkills(this);
        this.enchantSolver = new EnchantSolver(this);
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
        const wasEquiped = this.inventory.flagUnEquiped(item);
        this.inventory.remove(item);
        wasEquiped && this.unEquip(item);
    }
    unEquip(item: Item) {
        if (item instanceof Weapon) {
            item.onUnEquip(this);
            this.weapon = NullWeapon;
        }
        if (item instanceof Armour) {
            item.onUnEquip(this);
            this.armour = NullArmour;
        }
    }
    equip(item: Item) {
        if (item instanceof Weapon) {
            if (this.weapon) {
                this.inventory.flagUnEquiped(this.weapon);
                this.unEquip(this.weapon);
            }
            this.weapon = item;
        }
        if (item instanceof Armour) {
            if (this.armour) {
                this.inventory.flagUnEquiped(this.armour);
                this.unEquip(this.armour);
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
        if (item.isConsumable) {
            this.inventory.remove(item);
        }
    }
    regenHealth() {
        this.health.regenHealth();
    }
    update() {
        this.regenHealth();
        this.resolveBuffs();
        this.enchantSolver.solve();
    }
    takeDamages(fight: DamageResolution) {
        fight.heroTakesDamages();
    }
    getAligment(): 'good'|'bad' {
        return 'good';
    }
}