import { Health, HealthStatus } from "../entitybase/health";
import { Coordinate } from "../utils/coordinate";
import { Buffs } from "../entitybase/buffable";
import { Behavior, AIBehavior } from "./ai";
import { pickInRange } from "../utils/random";
import { microValidator } from "../utils/micro-validator";
import { BuffDefinition } from "../effects/effect";
import { Armour } from "../items/armour";
import { Weapon } from "../items/weapon";
import { Entity } from "../entitybase/entity";
import * as _ from 'lodash';
import { gameBus } from "../../eventBus/game-bus";
import { monsterTookDamage, monsterDead, heroGainedXp } from "../../events";
import { Hit } from "../fight/fight";
import { Magic } from "../entitybase/magic";
import { IEffect } from "../effects/definitions";
import { NullSkillManager, SkillManager } from "../hero/skill-manager";
import { effectSolver } from "../effects/solver/solver";

let short = require('short-uuid');
 
export class Monster extends Entity {
    id = short.generate();
    health!: Health;
    armour: Armour = new Armour({absorbBase: 0});
    weapon!: Weapon;
    pos!: Coordinate;
    xp!: number;
    behavior!: Behavior;
    buffs: Buffs = new Buffs();
    name!: string;
    level: number = 1;
    asSeenHero: boolean = false;
    spells: IEffect[] = [];
    aligment: 'bad'|'good' = 'bad';
    private constructor() {
        super();
        this.skills = new NullSkillManager() as any as SkillManager;
    }
    setXp(xp: number) {
        this.xp = xp;
        this.level = Math.floor(this.xp / 5);
        return this;
    }
    setAligment(value: 'good'|'bad') {
        this.aligment = value;
        if (this.aligment === 'good') {
            this.setBehavior(AIBehavior.friendlyAI());
        } else if (this.aligment === 'bad') {
            this.setBehavior(AIBehavior.Default());
        }
        return this;
    }
    getAligment() {
        return this.aligment;
    }
    getFriendly() {
        return this.getAligment() === 'good';
    }
    setPos(pos: Coordinate) {
        this.pos = pos;
        return this;
    }
    setHealth(h: Health) {
        this.health = h;
        return this;
    }
    setWeapon(w: Weapon) {
        this.weapon = w;
        return this;
    }
    setName(n: string) {
        this.name = n;
        return this;
    }
    setDodge(n: number) {
        this._dodge = n;
        return this;
    }
    setBehavior(f: Behavior) {
        this.behavior = f;
        return this;
    }
    setSpeed(speed: number){
        this._speed = speed;
        return this;
    }
    setSpells(spells: IEffect[]) {
        this.spells = _.shuffle(spells);
        return this;
    }
    addBuff(buff: BuffDefinition) {
        this.buffs.addBuff(buff);
    }
    play() {
        this.behavior(this);
    }
    update() {
        console.log('update');
        this.buffs.forEachBuff(b => b.magic.onTurn(this));
        effectSolver(this);
        this.buffs.update(this);
    }
    heal(n: number, reason: string) {
        throw new Error("Method not implemented.");
    }
    onBeHit(hit: Hit) {
        this.buffs.forEachBuff(b => b.magic.onBeHit(hit));
        const report = this.health.take(hit.damage);
        gameBus.publish(monsterTookDamage({
            monster: this,
            amount: -hit.damage,
            baseHp: this.maxhp,
            currentHp: this.hp,
            externalSource: null,
        }));
        if (report.status === HealthStatus.Dead) {
            gameBus.publish(monsterDead({
                monster: this
            }));
            if (this.getAligment() === 'bad') {
                gameBus.publish(heroGainedXp({
                    amount: this.xp
                }));
            }
        }
    }
    onHit(hit: Hit) {
        this.buffs.forEachBuff(b => b.magic.onHit(hit));
    }
    takeDamage(dmg: number, reason?: string) {
        const report = this.health.take(dmg);
        gameBus.publish(monsterTookDamage({
            monster: this,
            amount: -dmg,
            baseHp: this.maxhp,
            currentHp: this.hp,
            externalSource: reason,
        }));
        if (report.status === HealthStatus.Dead) {
            gameBus.publish(monsterDead({
                monster: this
            }));
            if (this.getAligment() === 'bad') {
                gameBus.publish(heroGainedXp({
                    amount: this.xp
                }));
            }
        }
    }
    
    static makeMonster(arg: any) : Monster {
        const {speed, kind, danger, hp, damage, range, pos, dodge, onHit, spells} = arg;
        microValidator([kind, danger, hp, damage, range, pos], 'makeMonster');
        
        const monster = new Monster();

        if (speed) {
            monster.setSpeed(speed);
        }

        monster
            .setHealth(new Health(pickInRange(hp)))
            .setWeapon(new Weapon({baseDamage: damage, maxRange: range}))
            .setXp(danger)
            .setName(kind)
            .setPos(pos)
            .setDodge(dodge)
            .setBehavior(AIBehavior.Default());

        if (onHit) {
            monster.addBuff({
                magic: new Magic({onHit: onHit}),
                turns: Infinity
            });
        }
        if (spells) {
            const sp = spells.map((s: Function) => s());
            monster.setSpells( sp );
        }
        
        return monster;
    }
}