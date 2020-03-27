import { BuffDefinition } from "../effects/effect";

const shortid = require('shortid');

export class Buffs {
    buffs = new Map<string, BuffDefinition>();
    addBuff(buff: BuffDefinition) {
        this.buffs.set(shortid.generate(), buff);
    }
    detachBuff(buff: BuffDefinition) {
        
    }
    cleanBuff() {
        this.buffs.clear();
    }
    apply(target: any) {
        
    }
}