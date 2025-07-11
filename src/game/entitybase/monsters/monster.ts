import { Health } from '../health';
import { Coordinate } from '../../../utils/coordinate';
import { Buffs } from '../buffable';
import { pickInRange } from '../../../utils/random';
import { microValidator } from '../../../utils/micro-validator';
import { Armour } from '../items/armour';
import { Weapon } from '../items/weapon';
import { Entity } from '../entity';
import { Spell } from '../../effects/spells';
import * as _ from 'lodash';
import { DamageResolution } from '../../fight/damages';
import { Afflictions } from '../afflictions';
import { EnchantSolver } from '../../effects/echant-solver';
import { Behavior, BehaviorType } from '../../ia/ai';

let short = require('short-uuid');

export class Monster extends Entity {
  id = short.generate();
  precision: number = 0;
  health!: Health;
  armour: Armour = new Armour({ absorbBase: 0 });
  weapon!: Weapon;
  pos!: Coordinate;
  xp!: number;
  behavior!: Behavior;
  buffs: Buffs = new Buffs();
  enchants = new Afflictions();
  name!: string;
  level: number = 1;
  asSeenHero: boolean = false;
  sight = 8;
  speed = 1;
  dodge: number = 0.15;
  enchantSolver: EnchantSolver;
  spells: Spell[] = [];
  aligment: 'bad' | 'good' = 'bad';
  behaviorsRegistry: Map<BehaviorType, Behavior>;

  private constructor(AIBehaviorsRegistry: Map<BehaviorType, Behavior>) {
    super();
    this.behaviorsRegistry = AIBehaviorsRegistry;
    this.enchantSolver = new EnchantSolver(this);
  }

  setXp(xp: number) {
    this.xp = xp;
    this.level = Math.floor(this.xp / 5);
    return this;
  }

  setAligment(value: 'good' | 'bad') {
    this.aligment = value;
    if (this.aligment === 'good') {
      this.setBehavior('friendly');
    } else if (this.aligment === 'bad') {
      this.setBehavior('default');
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
    this.dodge = n;
    return this;
  }

  setBehavior(type: BehaviorType) {
    this.behavior = this.behaviorsRegistry.get(type);
    return this;
  }

  setSpeed(speed: number) {
    this.speed = speed;
    return this;
  }

  setSpells(spells: Spell[]) {
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
    const { AIBehaviorsRegistry, speed, kind, danger, hp, damage, range, pos, dodge, onHit, spells } = arg;
    microValidator([kind, danger, hp, damage, range, pos, AIBehaviorsRegistry], 'makeMonster');

    const monster = new Monster(AIBehaviorsRegistry);

    if (speed) {
      monster.setSpeed(speed);
    }

    monster
      .setHealth(new Health(pickInRange(hp)))
      .setWeapon(new Weapon({ baseDamage: damage, maxRange: range }))
      .setXp(danger)
      .setName(kind)
      .setPos(pos)
      .setDodge(dodge)
      .setBehavior('default');

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
