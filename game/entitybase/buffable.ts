import { BuffEffect } from "./effect";
const shortid = require('shortid');

export class Buffs {
    buffs = new Map<string, BuffEffect>();
    addBuff(buff: BuffEffect) {
        this.buffs.set(shortid.generate(), buff);
    }
    detachBuff(buff: BuffEffect) {
        
    }
    cleanBuff() {
        this.buffs.clear();
    }
    apply(target: any) {
        
    }
}