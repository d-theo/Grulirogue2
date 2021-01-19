import { BuffDefinition } from "../effects/effect";

export class Buffs {
    buffs: BuffDefinition[] = [];

    forEachBuff(func: (b: BuffDefinition) => void) {
        this.buffs.forEach(bu => func(bu));
    }
    addBuff(buff: BuffDefinition) {
        this.buffs.push(buff);
    }
    cleanBuff() {
        this.buffs.forEach(buf => {
            if (buf.turns != Infinity)  buf.turns = 0
        });
    }
    update(target: any) {
        const nextTurn: BuffDefinition[] = []
        for (let buff of this.buffs) {
            if (buff.turns <= 0) {
                buff.end && buff.end(target);
                continue;
            }
            buff.turns -= 1;
            nextTurn.push(buff);
        }
        this.buffs = nextTurn;
    }
}