import { Hero } from "../hero/hero";
import { Monster } from "../monsters/monster";
import { gameBus, itemEquiped, playerHealed, logPublished } from "../../eventBus/game-bus";
import { BuffDefinition } from "./effect";
import { SkillNames } from "../hero/hero-skills";
import { pickInRange } from "../utils/random";
import { microValidator } from "../utils/micro-validator";
import { doDamages } from "./spells";

export type AffectType = 
| 'thicc'
| 'ac'
| 'heal'
| 'dodge'
| 'stun'
| 'blind'
| 'wet'
| 'accurate'
| 'rage'
| 'bleed'
| 'poison'
| 'speed'
| 'slow'
| 'damage'
| 'shock'
| 'cold'
| 'fire'
| 'brave'
| 'health';

export class Affect {
    private _target!: Hero | Monster;
    private _turns: number = 1;
    private _isTemp: boolean = true;
    private _isStackable: boolean = false;
    private _start: any;
    private _end: any;
    private _tick: any;
    private _tags: string = '';
    private _source: string | null = null;
    private param1: any;
    private param2: any;
    private param3: any;
    private paramsNb: number = 0;
    constructor(type: AffectType) {
        this.affect(type);
    }

    private affect(type: AffectType) {
        const struct = this[type]();
        this.assign(struct);
    }
    params(p1: any, p2?: any, p3?: any) {
        this.param1 = p1;
        this.param2 = p2;
        this.param3 = p3;
        return this;
    }
    target(t: Hero | Monster) {
        this._target = t;
        return this;
    }
    turns(t: number) {
        this._turns = t;
        return this;
    }
    isTemp(b: boolean) {
        this._isTemp = b;
        return this;
    }
    isStackable(b: boolean) {
        this._isStackable = b;
        return this;
    }
    source(s: string) {
        this._source = s;
        return this;
    }

    public cast() {
        if (this.paramsNb === 1) {
            microValidator([this.param1]);
        }else if (this.paramsNb === 2) {
            microValidator([this.param1, this.param2]);
        }else if (this.paramsNb === 3) {
            microValidator([this.param1, this.param2, this.param3]);
        }
        this._target.addBuff({
            isTemp: this._isTemp,
            tags: this._tags,
            isStackable: this._isStackable,
            start: this._start,
            end: this._end,
            tick: this._tick,
            turns: this._turns,
            source: this._source
        });
    }
    public create(): BuffDefinition {
        if (this.paramsNb === 1) {
            microValidator([this.param1]);
        }else if (this.paramsNb === 2) {
            microValidator([this.param1, this.param2]);
        }else if (this.paramsNb === 3) {
            microValidator([this.param1, this.param2, this.param3]);
        }
        return {
            isTemp: this._isTemp,
            tags: this._tags,
            isStackable: this._isStackable,
            start: this._start,
            end: this._end,
            tick: this._tick,
            turns: this._turns,
            source: this._source
        }
    }

    private assign(o: any) {
        if (o.start) {
            this._start = o.start;
        }
        if (o.tick) {
            this._tick = o.tick;
        }
        if (o.end) {
            this._end = o.end;
        }
        if (o.tags) {
            this._tags = o.tags;
        }
    }
    private thicc() {
        return {
            start: (t: Hero|Monster) => {
                t.armour.baseAbsorb += 5;
                t.speed = t.speed * 2;
                gameBus.publish(itemEquiped({armour: t.armour}));
            },
            end: (t: Hero|Monster) => {
                t.armour.baseAbsorb -= 5;
                t.speed = t.speed / 2;
                gameBus.publish(itemEquiped({armour: t.armour}));
            },
            tags: 'thicc'
        }
    }
    private heal() {
        return {
            tick: (t: Hero) => {
                let bonus = pickInRange('10-20');
                bonus += 10 * t.heroSkills.getSkillLevel(SkillNames.Alchemist);
                t.health.take(-bonus);
                gameBus.publish(playerHealed({
                    baseHp: t.health.baseHp,
                    currentHp: t.health.currentHp
                }));
            },
            start: null,
            end: NullFunc,
            tags: 'heal'
        }
    }
    private dodge() {
        this.paramsNb = 1;
        return {
            start: (t: Hero|Monster) => {
                gameBus.publish(logPublished({level: 'success', data:`${t.name} feels more agile`}));
                t.enchants.setAgile(true);
                t.dodge += this.param1
            },
            end: (t: Hero|Monster) => {
                t.dodge -= this.param1
                t.enchants.setAgile(false);
            },
            tags: 'dodge'
        };
    }
    private stun() {
        return {
            start: (t: Hero|Monster) => {
                t.enchants.setStuned(true);
            },
            tick: (t: Hero|Monster) => {
                gameBus.publish(logPublished({level: 'warning', data: `${t.name} is stuned`}))
            },
            end: (t: Hero|Monster) => t.enchants.setStuned(false),
            tags: 'stun'
        }
    }
    private blind() {
        this.paramsNb = 1;
        return {
            start: (t: Hero|Monster) => {
                t.enchants.setBlind(true);
                t.sight -= this.param1;
            },
            end: (t: Hero|Monster) => { 
                t.enchants.setBlind(false);
                t.sight += this.param1;
            }
        }
    }
    private wet() {
        return {
            start: (t: Hero|Monster) => t.enchants.setWet(true),
            end: (t: Hero|Monster) => t.enchants.setWet(false),
            tags: 'wet'
        }
    }

    private accurate() {
        return {
            start: (t: Hero|Monster) => {
                gameBus.publish(logPublished({level: 'success', data: `${t.name} feels more confident`}));
                t.enchants.setConfident(true);
                t.weapon.maxRange += 1;
            },
            end: (t: Hero|Monster) => {
                t.enchants.setConfident(false);
                t.weapon.maxRange -= 1
            },
        };
    }
    private rage() {
        const rageLevel = pickInRange('3-5');;
        return {
            start: (t: Hero|Monster) => {
                t.armour.baseAbsorb -= rageLevel;
                t.weapon.additionnalDmg += rageLevel;
                t.enchants.setMoreDamage(true);
                t.enchants.setMoreVulnerable(true);
            },
            end: (t: Hero|Monster) => {
                t.enchants.setMoreDamage(false);
                t.enchants.setMoreVulnerable(false);
                t.weapon.additionnalDmg -= rageLevel;
                t.armour.baseAbsorb += rageLevel;
            },
        }
    }
    private bleed() {
        return {
            start: (t: Hero|Monster) => {
                t.enchants.setBleeding(true);
                gameBus.publish(logPublished({level: 'danger', data: `${t.name} starts bleeding`}));
            },
            tick: (t: Hero|Monster) => {
                doDamages(4+t.level, t, 'bleeding');
            },
            end: (t: Hero|Monster) => t.enchants.setBleeding(false),
            tags: 'bleed'
        }
    }
    private poison() {
        return {
            start: (t: Hero|Monster) => {
                gameBus.publish(logPublished({level: 'danger', data: `${t.name} feels poison in his veins`}));
                t.enchants.setPoisoned(true)
            },
            tick: (t: Hero|Monster) => doDamages(2, t, 'poisoning'),
            end: (t: Hero|Monster) => t.enchants.setPoisoned(false),
            tags: 'poison'
        }
    }
    private speed() {
        return {
            start: (t: Hero|Monster) => {
                gameBus.publish(logPublished({level: 'success', data:'you are boosted!'}));
                t.enchants.setSpeed(true);
                t.speed = t.speed/2;
            },
            end: (t: Hero|Monster) => {
                t.enchants.setSpeed(false);
                t.speed = t.speed * 2;
            },
            tags: 'speed'
        }
    }
    private slow() {
        return {
            start: (t: Hero|Monster) => {
                gameBus.publish(logPublished({level: 'success', data:'you are boosted!'}));
                t.enchants.setSpeed(true);
                t.speed = t.speed*2;
            },
            end: (t: Hero|Monster) => {
                t.enchants.setSpeed(false);
                t.speed = t.speed / 2;
            },
            tags: 'slow'
        }
    }
    private damage() {
        this.paramsNb = 3;
        return {
            start: null,
            tick: (t: Hero | Monster) => {
                if (this.param1 > Math.random()) return;
                const dmg = pickInRange(this.param2);
                doDamages(dmg, t, this.param3);
            },
            end: NullFunc
        }
    }
    private shock() {
        return {
            start: null,
            tick: (t: Hero | Monster) => {
                if (t.enchants.getWet()) {
                    doDamages(7, t, 'shock');
                }
                new Affect('stun')
                    .turns(1)
                    .target(t)
                    .cast();
                gameBus.publish(logPublished({level: 'warning', data: `${t.name} is stricken by a lightning bolt`}));
            },
            end: NullFunc,
        }
    }
    private cold() {
        return {
            start: null,
            tick: (t: Hero|Monster) => {
                new Affect('slow')
                    .turns(1)
                    .target(t)
                    .cast();
                if (t.enchants.getWet()) {
                    new Affect('stun')
                    .turns(1)
                    .target(t)
                    .cast();
                    gameBus.publish(logPublished({level: 'warning', data: `${t.name} is froze`}));
                }
            },
            end: NullFunc
        }
    }
    private fire() {
        return {
            start: (t: Hero|Monster) => {
                t.enchants.setBurned(true);
            },
            tick: (t: Hero|Monster) => {
                gameBus.publish(logPublished({level: 'warning', data: `${t.name} is burning`}));
                doDamages(1, t, 'burning');
            },
            end: (t: Hero|Monster) => { 
                t.enchants.setBurned(false);
            },
            tags: 'burn'
        }
    }
    private health() {
        this.paramsNb = 2;
        return {
            start: null,
            tick: (t: Hero|Monster) => {
                if (this.param2 > Math.random()) {
                    t.health.take(-this.param1);
                    gameBus.publish(playerHealed({
                        baseHp: t.health.baseHp,
                        currentHp: t.health.currentHp
                    }));
                }
            },
            end: NullFunc,
            tags: 'health'
        }
    }
    private brave() {
        return {
            start: null,
            tick: (t: Hero|Monster) => {
                if (t.health.currentHp < t.health.currentHp / 10) {
                    new Affect('ac').isStackable(true).turns(1).params(5).target(t).cast();
                }
            },
            end: NullFunc
        }
    }
    private ac() {
        this.paramsNb = 1;
        return {
            start: null,
            tick: (t: Hero|Monster) => t.armour.baseAbsorb += this.param1,
            end: (t: Hero|Monster) => t.armour.baseAbsorb -= this.param1,
        }
    }
}

export class EnchantSolver {
    constructor(private t: Hero|Monster) {}
    solve() {
        if (this.t.enchants.getWet()) {
            this.t.buffs.cleanBuffType('burn');
        }
        if (this.t.enchants.getBurned() && this.t.enchants.getPoisoned()) {
            new Affect('bleed').turns(1).target(this.t).cast();
        }
    }
}

export const NullFunc = () => ({});