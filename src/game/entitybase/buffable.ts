import { Buff2 } from './buff';

export class Buffs {
  buffs: Buff2[] = [];

  addBuff(buff: Buff2) {
    let ok = true;
    for (let b of this.buffs) {
      if (b.tags === buff.tags) {
        if (b.isStackable === false && buff.isStackable === false) {
          if (b.turns == Infinity || b.turns < buff.turns) {
            b.turns = 0;
          } else {
            ok = false;
          }
        }
      }
    }
    if (ok) {
      this.buffs.push(buff);
    }
  }

  cleanBuff() {
    this.buffs.forEach((buf) => {
      if (buf.turns != Infinity) buf.turns = 0;
    });
  }

  cleanBuffType(type: string) {
    this.buffs.forEach((b) => {
      if (b.tags.indexOf(type) > -1) {
        b.turns = 0;
      }
    });
  }

  cleanBuffSource(sourceId: string) {
    this.buffs.forEach((b) => {
      if (b.source === sourceId) {
        b.turns = 0;
      }
    });
  }

  apply(target: any) {
    const nextTurn: Buff2[] = [];
    for (let buff of this.buffs) {
      if (buff.turns <= 0) {
        buff.condition.onRemove(target);
        continue;
      }
      if (!buff.started && buff.condition.onApply) {
        buff.condition.onApply(target);
        buff.started = true;
        buff.turns -= 1;
        nextTurn.push(buff);
        continue;
      }
      if (buff.condition.onTick != null) {
        buff.condition.onTick(target);
      }
      buff.turns -= 1;
      nextTurn.push(buff);
    }
    this.buffs = nextTurn;
  }
}
