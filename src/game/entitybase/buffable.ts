import { BuffDefinition } from "../effects/effect";

export class Buffs {
    buffs: BuffDefinition[] = [];
    addBuff(buff: BuffDefinition) {
        this.buffs.push(buff);
    }
    detachBuff(buff: BuffDefinition) {
        
    }
    cleanBuff() {
        this.buffs.forEach(buf => buf.turns = 0);
    }
    apply(target: any) {
        const nextTurn: BuffDefinition[] = []
        for (let buff of this.buffs) {
            if (buff.turns <= 0) {
                buff.end(target);
                continue;
            }
            if (buff.start !== null) {
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