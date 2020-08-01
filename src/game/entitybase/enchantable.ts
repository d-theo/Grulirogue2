import { Buffs } from "./buffable";
import { gameBus, enchantChanged } from "../../eventBus/game-bus";
import { timingSafeEqual } from "crypto";

export class EnchantTable {
    private stuned = false;
    private bleeding = false;
    private invisibility = false;
    private poisoned = false;
    private stupid=false;
    private speed=false;
    private agile = false;
    private confident = false;
    private moreDamage = false;
    private lessDamage = false;
    private moreVulnerable = false;
    private wet = false;
    private blind = false;
    private burned = false;
    private cold = false;
    private shocked = false;
    private floral = false;

    constructor(private readonly notif: boolean = false) {}
    setFloral(x: boolean) {
        this.floral = x;
        this.update();
    }
    getFloral() {
        return this.floral;
    }
    setChocked(x:boolean) {
        this.shocked=x;
        this.update();
    }
    setCold(x:boolean) {
        this.cold=x;
        this.update();
    }
    setStuned(x: boolean) {
        this.stuned = x;
        this.update();
    }
    setBleeding(x: boolean) {
        this.bleeding = x;
        this.update();
    }
    setInvisitility(x: boolean) {
        this.invisibility = x;
        this.update();
    }
    setPoisoned(x: boolean) {
        this.poisoned = x;
        this.update();
    }
    setStupid(x: boolean) {
        this.stupid = x;
        this.update();
    }
    setSpeed(x: boolean) {
        this.speed = x;
        this.update();
    }
    setAgile(x: boolean) {
        this.agile = x;
        this.update();
    }
    setConfident(x: boolean) {
        this.confident = x;
        this.update();
    }
    setMoreDamage(x: boolean) {
        this.moreDamage = x;
        this.update();
    }
    setMoreVulnerable(x: boolean) {
        this.moreVulnerable = x;
        this.update();
    }
    setBlind(x: boolean) {
        this.blind = x;
        this.update();
    }
    setWet(x: boolean) {
        this.wet = x;
        this.update();
    }
    setBurned(x: boolean) {
        this.burned = x;
        this.update();
    }
    setAbsorb(x: boolean) {
        this.lessDamage = x;
        this.update();
    }
    getAbsorb() {
        return this.lessDamage;
    }
    getCold() {
        return this.cold;
    }
    getShocked() {
        return this.shocked;
    }
    getStuned() {
        return this.stuned;
    }
    getBleeding() {
        return this.bleeding;
    }
    getInvisitility() {
        return this.invisibility;
    }
    getPoisoned() {
        return this.poisoned ;
    }
    getStupid() {
        return this.stupid;
    }
    getSpeed() {
        return this.speed ;
    }
    getAgile() {
        return this.agile;
    }
    getConfident() {
        return this.confident;
    }
    getWet() {
        return this.wet;
    }
    getBurned() {
        return this.burned;
    }
    report(): string[] {
        let r = [];
        if (this.stuned) {
            r.push('Stuned');
        }
        if (this.bleeding) {
            r.push('Bleeding');
        }
        if (this.invisibility) {
            r.push('Invisible');
        }
        if (this.poisoned) {
            r.push('Poisoned');
        }
        if (this.stupid) {
            r.push('Intel-');
        }
        if (this.speed) {
            r.push('Movement+');
        }
        if (this.agile) {
            r.push('Dodge+')
        }
        if(this.confident) {
            r.push('Range+')
        }
        if (this.moreVulnerable) {
            r.push('Absorb-');
        }
        if (this.lessDamage) {
            r.push('Absorb+');
        }
        if (this.moreDamage) {
            r.push('Dmg+');
        }
        if (this.blind) r.push('Sight-');
        if (this.wet) r.push('Wet');
        if (this.burned) r.push('Burned');
        return r;
    }
    clean() {
        this.stuned = false;
        this.bleeding = false;
        this.invisibility = false;
        this.poisoned = false;
        this.stupid=false;
        this.speed=false;
        this.agile = false;
        this.confident = false;
        this.moreDamage = false;
        this.moreVulnerable = false;
        this.wet = false;
        this.blind = false;
        this.burned = false;
        this.update();
    }
    update() {
        if (this.notif === false) return;
        gameBus.publish(enchantChanged({report: this.report().join("\n")}));
    }
}