import {Health} from "../entitybase/health";
import {Coordinate} from "../utils/coordinate";
import {Buffs} from "../entitybase/buffable";
import {Behavior, AIBehavior} from "./ai";
import {pickInRange} from "../utils/random";
import {microValidator} from "../utils/micro-validator";
import {Armour} from "../items/armour";
import {Weapon} from "../items/weapon";
import {Entity} from "../entitybase/entity";
import {EnchantSolver} from "../effects/affects";
import {IEffect} from "../effects/spells";
import * as _ from "lodash";
import {DamageResolution} from "../fight/damages";
import {Affictions} from "../entitybase/affictions";

let short = require("short-uuid");

export class Monster extends Entity {
  id = short.generate();
  precision: number = 0;
  health!: Health;
  armour: Armour = new Armour({absorbBase: 0});
  weapon!: Weapon;
  pos!: Coordinate;
  xp!: number;
  behavior!: Behavior;
  buffs: Buffs = new Buffs();
  enchants = new Affictions();
  name!: string;
  level: number = 1;
  asSeenHero: boolean = false;
  sight = 8;
  speed = 1;
  dodge: number = 0.15;
  enchantSolver: EnchantSolver;
  spells: IEffect[] = [];
  aligment: "bad" | "good" = "bad";

  private constructor() {
    super();
    this.enchantSolver = new EnchantSolver(this);
  }

  setXp(xp: number) {
    this.xp = xp;
    this.level = Math.floor(this.xp / 5);
    return this;
  }

  setAligment(value: "good" | "bad") {
    this.aligment = value;
    if (this.aligment === "good") {
      this.setBehavior(AIBehavior.friendlyAI());
    } else if (this.aligment === "bad") {
      this.setBehavior(AIBehavior.Default());
    }
    return this;
  }

  getAligment() {
    return this.aligment;
  }

  getFriendly() {
    return this.getAligment() === "good";
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
    this.dodge = n;
    return this;
  }

  setBehavior(f: Behavior) {
    this.behavior = f;
    return this;
  }

  setSpeed(speed: number) {
    this.speed = speed;
    return this;
  }

  setSpells(spells: IEffect[]) {
    this.spells = _.shuffle(spells);
    return this;
  }

  play() {
    this.behavior(this);
  }

  update() {
    this.resolveBuffs();
    this.enchantSolver.solve();
  }

  takeDamages(c: DamageResolution) {
    c.monsterTakesDamages(this);
  }

  static makeMonster(arg: any): Monster {
    const {
      speed,
      kind,
      danger,
      hp,
      damage,
      range,
      pos,
      dodge,
      onHit,
      spells,
    } = arg;
    microValidator([kind, danger, hp, damage, range, pos], "makeMonster");

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
      monster.weapon.additionnalEffects.push(onHit);
    }
    if (spells) {
      const sp = spells.map((s: Function) => s());
      monster.setSpells(sp);
    }
    return monster;
  }
}
