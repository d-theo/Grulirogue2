import { Coordinate } from "../utils/coordinate";
import { Health } from "./health";
import { Armour } from "../items/armour";
import { Weapon } from "../items/weapon";
import { Buffs } from "./buffable";
import { SkillManager } from "../hero/skill-manager";
import { ChargingPassiveSkill } from "../hero/skills/charging";
import { Inventory } from "../hero/inventory";
import { ArmourPassiveSkill } from "../hero/skills/armour";
import { BatteryPassiveSkill } from "../hero/skills/battery";
import { DamagePassiveSkill } from "../hero/skills/damage";
import { DodgePassiveSkill } from "../hero/skills/dodge";
import { HealthPassiveSkill } from "../hero/skills/health";
import { RegenPassiveSkill } from "../hero/skills/regen";
import { Hit } from "../fight/fight";
import { BuffDefinition } from "../effects/effect";
import { gameBus } from "../../eventBus/game-bus";
import { logPublished } from "../../events";

export abstract class Entity {
    public name: string;
    public pos!: Coordinate;
    public skills: SkillManager;
    public weapon: Weapon;
    public armour: Armour;

    protected buffs: Buffs = new Buffs();
    protected _dodge: number = 0.30;
    protected _precision: number = 0;
    protected health: Health;
    protected _sight: number;
    protected _speed: number = 1;
    protected _energy = 10;
    protected inventory = new Inventory();

    abstract getAligment(): 'bad'|'good';
    abstract level: number;
    abstract onHit(hit: Hit);
    abstract onBeHit(hit: Hit);
    abstract takeDamage(n: number, reason: string);
    abstract heal(n: number, reason: string);

    public addBuff(buff: BuffDefinition) {
        this.buffs.addBuff(buff);
    }
    public cleanse() {
        this.buffs.cleanBuff();
        gameBus.publish(logPublished({level: 'success', data:`${this.name} looks purified`}));
    }
    get ac(): number {
        let ac = 0;
        ac += this.skills.valueOfSkill(ArmourPassiveSkill);
        this.inventory.forEachEquiped(item=> ac += item.magic.ac);
        this.buffs.forEachBuff(b => ac += b.magic.ac);
        return ac;
    }
    get basehp () {
        return this.health._baseHp;
    }
    get maxhp() {
        let maxhp = this.health.baseHp;
        maxhp += this.skills.valueOfSkill(HealthPassiveSkill);
        this.inventory.forEachEquiped(item=> maxhp += item.magic.maxhp);
        this.buffs.forEachBuff(b => maxhp += b.magic.maxhp);
        return maxhp;
    }
    get hp() {
        return this.health.currentHp;
    }
    get precision() {
        let precision = this._precision;
        this.inventory.forEachEquiped(item=> precision += item.magic.precision);
        this.buffs.forEachBuff(b => precision += b.magic.precision);
        return precision;
    }
    get dodge() {
        let dodge = this._dodge;
        dodge += this.skills.valueOfSkill(DodgePassiveSkill);
        dodge -= this.armour.bulky;
        this.inventory.forEachEquiped(item=> dodge += item.magic.dodge);
        this.buffs.forEachBuff(b => dodge += b.magic.dodge);
        return dodge;
    }
    get speed() {
        let speed = this._speed;
        this.inventory.forEachEquiped(item=> speed += item.magic.speed);
        this.buffs.forEachBuff(b => speed += b.magic.speed);
        return speed;
    }
    get sight() {
        let sight = this._sight;
        this.inventory.forEachEquiped(item=> sight += item.magic.sigth);
        this.buffs.forEachBuff(b => sight += b.magic.sigth);
        return sight;
    }
    get dam() {
        let dam = 0;
        dam += this.skills.valueOfSkill(DamagePassiveSkill);
        this.inventory.forEachEquiped(item=> dam += item.magic.dam);
        this.buffs.forEachBuff(b => dam += b.magic.dam);
        return dam;
    }
    get regenHp () {
        let hpRegen = 0;
        hpRegen += this.skills.valueOfSkill(RegenPassiveSkill);
        this.inventory.forEachEquiped(item=> hpRegen += item.magic.hpRegen);
        this.buffs.forEachBuff(b => hpRegen += b.magic.hpRegen);
        return hpRegen;
    }
    get regenEnergy() {
        let r = 0;
        r += this.skills.valueOfSkill(ChargingPassiveSkill);
        this.inventory.forEachEquiped(item=> r += item.magic.energyRegen);
        this.buffs.forEachBuff(b => r += b.magic.energyRegen);
        return r;
    }
    get energy() {
        let energy = this._energy;
        energy += this.skills.valueOfSkill(BatteryPassiveSkill);
        this.inventory.forEachEquiped(item=> energy += item.magic.energy);
        this.buffs.forEachBuff(b => energy += b.magic.energy);
        return energy;
    }
    get isWet() {
        this.buffs.forEachBuff(b => {if (b.magic.wet) {return true}});
        return false;
    }
    get isInBushes() {
        this.buffs.forEachBuff(b => {if (b.magic.inBushes) {return true}});
        return false;
    }
    get isBurning() {
        this.buffs.forEachBuff(b => {if (b.magic.burn) {return true}});
        return false;
    }
    get isPoisonned() {
        this.buffs.forEachBuff(b => {if (b.magic.poison) {return true}});
        return false;
    }
    get isBleeding() {
        this.buffs.forEachBuff(b => {if (b.magic.bleed) {return true}});
        return false;
    }
    get isStun() {
        this.buffs.forEachBuff(b => {if (b.magic.stun) {return true}});
        return false;
    }
    get chance() {
        let chance = 0;
        this.inventory.forEachEquiped(item => chance += item.magic.chance);
        return chance;
    }

    stopBurning() {
        this.buffs.forEachBuff(b => b.magic.burn = false );
    }
}