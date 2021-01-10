import { Zapper } from './zap/zaper';
import { SkillManager } from './skill-manager';
import { Health } from "../entitybase/health";
import { Coordinate } from "../utils/coordinate";
import { Buffs } from "../entitybase/buffable";
import { EnchantTable } from "../entitybase/enchantable";
import { Inventory } from "./inventory";
import { BuffDefinition, EffectMaker, SpellNames } from "../effects/effect";
import { Item } from "../entitybase/item";
import { FightModifier } from "../entitybase/fight-modifier";
import { Armour, NullArmour } from "../items/armour";
import { Weapon, NullWeapon } from "../items/weapon";
import { Entity } from "../entitybase/entity";
import { EnchantSolver } from "../effects/affects";
import { DamageResolution } from "../fight/damages";
import { IdentifiySpell } from "../effects/spells";
import { gameBus } from "../../eventBus/game-bus";
import { itemPickedUp, itemEquiped } from "../../events";

//const XP = [0, 30, 70, 130, 210, 300, 450, 700, 900];

export class Hero implements Entity {
    pastStates = [];

    name: string;
    health: Health;
    armour: Armour;
    dodge: number = 0.30;
    weapon: Weapon;
    pos!: Coordinate;
    precision: number = 0;
    enchants: EnchantTable = new EnchantTable(true);
    buffs: Buffs = new Buffs();
    private inventory = new Inventory();
    public sight: number;
    speed: number = 1;
    fightModifier = new FightModifier();
    enchantSolver: EnchantSolver;
    zapper: Zapper;

    skills: SkillManager;

    skillFlags = {
        regenHpOverTime: 0,
        gainHpPerLevel: 0,
        improvedPotionEffect: 0, // alchemist
        additionnalItemPerLevel: 0
    };
    constructor() {
        this.name = "Grulito le brave";
        this.health = new Health(15);
        this.armour = new Armour({baseAbsorb: 0, name: 'Pyjamas', description: 'Your favorite pair of pyjamas for spleeping'});
        this.weapon = new Weapon({baseDamage: '2-4', maxRange: 1, name: 'Fist', description: 'Your fists are not prepared for this', kind: "Fist", skin: "Fist"});
        this.sight = 8;
        this.addToBag(this.armour);
        this.addToBag(this.weapon);
        this.equip(this.armour);
        this.equip(this.weapon);
        this.enchantSolver = new EnchantSolver(this);
        this.skills = new SkillManager(this);
        this.zapper = new Zapper(this);
    }
    get level(): number {
        return this.skills.report().reduce((acc, cur) => {
            return acc+cur.level;
        }, 0);
    }
    openBag(filters?: string[]) {
        return this.inventory.openBag(filters);
    }
    addToBag(item: Item) {
        this.inventory.add(item);
        gameBus.publish(itemPickedUp({item: item}));
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
    gainXP(amount: number): void{
        this.skills.addXp(amount);
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
        this.updateInventory();
        this.enchantSolver.solve();
        this.zapper.update();
        this.saveState();
    }
    private saveState() {
        this.pastStates.push({
            hp: this.health.currentHp,
            pos: this.pos
        });
        if (this.pastStates.length > 10) {
            this.pastStates.shift();
        }
    }
    updateInventory() {
        this.weapon.hitBeforeIdentified --;
        this.armour.hitBeforeIdentified --;
        if (this.weapon.hitBeforeIdentified === 0 && !this.weapon.identified) {
            const identify = EffectMaker.createSpell(SpellNames.Identify) as IdentifiySpell;
            identify.cast(this.weapon);
        }
        if (this.armour.hitBeforeIdentified === 0 && !this.armour.identified) {
            const identify = EffectMaker.createSpell(SpellNames.Identify) as IdentifiySpell;;
            identify.cast(this.armour);
        }
    }
    takeDamages(fight: DamageResolution) {
        fight.heroTakesDamages();
    }
    getAligment(): 'good'|'bad' {
        return 'good';
    }
}