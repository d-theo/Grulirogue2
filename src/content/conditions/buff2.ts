import { Hero } from "../../game/hero/hero";
import { Monster } from "../../game/monsters/monster";
import { Condition, Conditions } from "./conditions";

export class Buff2 {
  condition: Condition;
  turns: number;
  source: Hero | Monster;
  isTemp: boolean;
  isStackable: boolean;

  static create(c: () => Condition) {
    const buff = new Buff2();
    buff.condition = c();
    return buff;
  }

  public setTurns(t: number) {
    this.turns = t;
    return this;
  }
  public setSource(s: Hero | Monster) {
    this.source = s;
    return this;
  }
  public setIsTemp(t: boolean) {
    this.isTemp = t;
    return this;
  }
  public setIsStackable(t: boolean) {
    this.isStackable = t;
    return this;
  }
}

/*
export function applyBuff(b: Buff2, target) {
  b.setSource(b);
  target.addBuff(b);
}
*/
