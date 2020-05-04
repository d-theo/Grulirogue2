import { BuffDefinition } from "../effects/effect";

export class Buffs {
    buffs: BuffDefinition[] = [];
    armourBuff: BuffDefinition[] = [];
    // ringBuff

    setArmourBuff(buffs: BuffDefinition[]) {
        this.armourBuff = buffs;
    }
    addBuff(buff: BuffDefinition) {
        this.buffs.push(buff);
    }
    detachBuff(buff: BuffDefinition) {
        this.buffs.filter(b => b !== buff);
    }
    cleanBuff() {
        this.buffs.forEach(buf => buf.turns = 0);
    }
    apply(target: any) {
        this.applyOnCarryBuffs(target);
        this.applyTempBuffs(target);
    }
    applyTempBuffs(target: any) {
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

    applyOnCarryBuffs(target: any) {
        for (let buff of this.buffs) {
            if (buff.turns <= 0) {
                buff.end(target);
                continue;
            }
            if (buff.start !== null) {
                buff.start(target);
                buff.start = null;
                continue;
            }
            if (buff.tick != null) {
                buff.tick(target);
            }
        }
    }
}