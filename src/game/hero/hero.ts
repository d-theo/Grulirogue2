import { Zapper } from './zap/zaper';
import { SkillManager } from './skill-manager';
import { Health } from "../entitybase/health";
import { BuffDefinition } from "../effects/effect";
import { Item } from "../entitybase/item";
import { Armour, NullArmour } from "../items/armour";
import { Weapon, NullWeapon } from "../items/weapon";
import { Entity } from "../entitybase/entity";;
import { IdentifiySpell } from "../effects/spells";
import { gameBus } from "../../eventBus/game-bus";
import { itemPickedUp, itemEquiped, playerTookDammage } from "../../events";
import { SpellBook } from '../effects/spell-book';
import { Monster } from '../monsters/monster';
import { Hit } from '../fight/fight';


export class Hero extends Entity {
    pastStates = [];
    zapper: Zapper;
    constructor() {
        super();
        this.name = "Grulito le brave";
        this.health = new Health(15);
        this.armour = new Armour({baseAbsorb: 0, name: 'Pyjamas', description: 'Your favorite pair of pyjamas for spleeping'});
        this.weapon = new Weapon({baseDamage: '2-4', maxRange: 1, name: 'Fist', description: 'Your fists are not prepared for this', kind: "Fist", skin: "Fist"});
        this._sight = 8;
        this.addToBag(this.armour);
        this.addToBag(this.weapon);
        this.equip(this.armour);
        this.equip(this.weapon);
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
            this.weapon = NullWeapon;
        }
        if (item instanceof Armour) {
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
        this.resolveBuffs();
        this.regenHealth();
        this.updateInventory();
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
            const identify = SpellBook.IdentifiySpell as IdentifiySpell;
            identify.cast(this.weapon);
        }
        if (this.armour.hitBeforeIdentified === 0 && !this.armour.identified) {
            const identify = SpellBook.IdentifiySpell as IdentifiySpell;;
            identify.cast(this.armour);
        }
    }
    onBeHit(hit: Hit) {
        this.buffs.forEachBuff(buf => buf.magic.onBeHit(hit));
        this.inventory.forEachEquiped(item => item.magic.onBeHit(hit));
        const report = this.health.take(hit.damage);
        gameBus.publish(playerTookDammage({
            monster: hit.attacker as any as Monster,
            amount: hit.damage,
            source: hit.attacker.name,
            baseHp: this.maxhp,
            currentHp: this.hp,
        }));
    }
    onHit(hit: Hit) {
        this.buffs.forEachBuff(buf => buf.magic.onHit(hit));
        this.inventory.forEachEquiped(buf => buf.magic.onHit(hit));
    }
    takeDamage(damage: number, reason: string) {
        const report = this.health.take(damage);
        gameBus.publish(playerTookDammage({
            monster: null,
            amount: damage,
            source: reason,
            baseHp: this.maxhp,
            currentHp: this.hp,
        }));
    }
    getAligment(): 'good'|'bad' {
        return 'good';
    }
}