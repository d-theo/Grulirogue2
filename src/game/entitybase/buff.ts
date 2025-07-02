import {Entity} from "./entity";
import {Condition} from "./condition";

// A buff is a Condition with time & extra data
export class Buff2 {
  condition: Condition;
  turns: number;
  source?: string | null;
  isTemp: boolean;
  isStackable: boolean;
  started = false;

  get tags() {
    return this.condition.tags;
  }

  static create(c: () => Condition) {
    const buff = new Buff2();
    buff.condition = c();
    return buff;
  }

  public setTurns(t: number) {
    this.turns = t;
    return this;
  }

  public setSource(s: string) {
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

export function applyBuff2(b: Buff2, target: Entity) {
  // b.setSource(b);
  // fixme target.addBuff(b);
}