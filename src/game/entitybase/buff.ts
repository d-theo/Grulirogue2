import { Entity } from './entity';
import { Condition } from './condition';

// A buff is a Condition with time & extra data
export class Buff2 {
  condition: Condition;
  turns: number;
  source?: string | null;
  isTemp: boolean = true;
  isStackable: boolean = false;
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
