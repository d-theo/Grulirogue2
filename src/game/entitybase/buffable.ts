import { BuffDefinition } from "../effects/effect";
import { Hero } from "../hero/hero";

export class Buffs {
    buffs: BuffDefinition[] = [];

    addBuff(buff: BuffDefinition) {
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
        this.buffs.forEach(buf => {
            if (buf.turns != Infinity)  buf.turns = 0
        });
    }
    cleanBuffType(type: string) {
        this.buffs.forEach(b => {
            if (b.tags.indexOf(type) > -1) {
                b.turns = 0;
            }
        });
    }
    cleanBuffSource(sourceId: string) {
        this.buffs.forEach(b => {
            if (b.source === sourceId) {
                b.turns = 0;
            }
        });
    }
    apply(target: any) {
        const nextTurn: BuffDefinition[] = []
        for (let buff of this.buffs) {
            if (buff.turns <= 0) {
                buff.end(target);
                continue;
            }
            if (buff.start != null) {
                buff.start(target);
                buff.start = null;
                buff.turns -= 1;
                nextTurn.push(buff);
                continue;
            }
            if (buff.tick != null) {
                buff.tick(target);
            }
            buff.turns -= 1;
            nextTurn.push(buff);
            
        }
        this.buffs = nextTurn;
    }
}