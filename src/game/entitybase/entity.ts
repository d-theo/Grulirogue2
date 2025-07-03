import {Coordinate} from "../utils/coordinate";
import {Health} from "./health";
import {Armour} from "../items/armour";
import {Weapon} from "../items/weapon";
import {Buffs} from "./buffable";
import {Afflictions} from "./afflictions";
import {DamageResolution} from "../fight/damages";
import {Buff2} from "./buff";

export abstract class Entity {
  health: Health;
  armour: Armour;
  dodge: number;

  pos: Coordinate;
  sight: number;

  weapon: Weapon;
  level: number;

  buffs: Buffs;
  enchants: Afflictions;

  precision: number;

  abstract takeDamages(c: DamageResolution);

  abstract getAligment(): "bad" | "good";

  abstract update();

  addBuff(buff: Buff2) {
    this.buffs.addBuff(buff);
  }

  resolveBuffs() {
    this.buffs.apply(this);
  }
}
