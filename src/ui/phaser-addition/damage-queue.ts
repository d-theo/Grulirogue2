import { UIDamages } from "../entities";

export class DamageQueue {
  private queue: UIDamages[] = [];
  constructor() {}
  add(damage: UIDamages) {
    this.queue.push(damage);
  }
  resolve() {
    for (let i = 0; i < this.queue.length; i++) {
      this.queue[i].addOffset(i);
    }
    this.queue.forEach((q) => q.showDamage({ delay: 150 }));
    this.queue = this.queue.filter((dmg) => dmg.markAsPlayed === false);
  }
}
