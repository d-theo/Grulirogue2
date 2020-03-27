import { Killable } from "../entitybase/killable";
import { Health } from "../entitybase/health";
import { Weapon } from "../entitybase/weapon";
import { Armour } from "../entitybase/armour";
import { Fighter } from "../entitybase/fighter";
import { Movable } from "../entitybase/movable";
import { Coordinate } from "../utils/coordinate";
import { Buffs } from "../entitybase/buffable";
import { Enchantable, EnchantTable } from "../entitybase/enchantable";
import { Behavior, AIBehavior } from "./ai";
import { pickInRange, pickInArray } from "../utils/random";
import { microValidator } from "../utils/micro-validator";
import { BuffDefinition } from "../effects/effect";
let short = require('short-uuid');
 
export class Monster implements Movable, Killable, Fighter, Enchantable {
    id = short.generate();
    health!: Health;
    armour: Armour = new Armour({absorbBase: 0});
    weapon!: Weapon;
    pos!: Coordinate;
    xp!: number;
    behavior!: Behavior;
    buffs: Buffs = new Buffs();
    enchants = new EnchantTable();
    name!: string;
    level: number = 1;
    asSeenHero: boolean = false;
    private constructor() {
        // this.behavior = arg.behavior;
    }
    setXp(xp: number) {
        this.xp = xp;
        return this;
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
    setBehavior(f: Behavior) {
        this.behavior = f;
        return this;
    }
    addBuff(buff: BuffDefinition) {
        this.buffs.addBuff(buff);
    }
    play() {
        this.behavior(this);
    }
    static makeMonster(arg: any) : Monster {
        const {kind, danger, hp, damage, range, pos} = arg;
        microValidator([kind, danger, hp, damage, range, pos], 'makeMonster');
        
        const monster = new Monster();
        return monster
            .setHealth(new Health(pickInRange(hp)))
            .setWeapon(new Weapon({baseDamage: damage, maxRange: range}))
            .setXp(danger)
            .setName(kind)
            .setPos(pos)
            .setBehavior(AIBehavior.Default());
    }
}