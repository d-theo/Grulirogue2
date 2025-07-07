import { gameBus } from "../../infra/events/game-bus";
import { enchantChanged } from "../events";

// Afflictions class to manage various status effects on entities
export class Afflictions {
  private stuned = 0;
  private bleeding = 0;
  private invisibility = 0;
  private poisoned = 0;
  private stupid = 0;
  private speed = 0;
  private agile = 0;
  private confident = 0;
  private moreDamage = 0;
  private lessDamage = 0;
  private moreVulnerable = 0;
  private wet = 0;
  private blind = 0;
  private burned = 0;
  private cold = 0;
  private shocked = 0;
  private floral = 0;
  private slow = 0;

  constructor(private readonly notif: boolean = false) {}

  setFloral(x: number) {
    this.floral += x;
    this.update();
  }

  getFloral() {
    return this.floral;
  }

  setChocked(x: number) {
    this.shocked += x;
    this.update();
  }

  setCold(x: number) {
    this.cold += x;
    this.update();
  }

  setStuned(x: number) {
    this.stuned += x;
    this.update();
  }

  setBleeding(x: number) {
    this.bleeding += x;
    this.update();
  }

  setInvisitility(x: number) {
    this.invisibility += x;
    this.update();
  }

  setPoisoned(x: number) {
    this.poisoned += x;
    this.update();
  }

  setStupid(x: number) {
    this.stupid += x;
    this.update();
  }

  setSpeed(x: number) {
    this.speed += x;
    this.update();
  }

  setAgile(x: number) {
    this.agile += x;
    this.update();
  }

  setConfident(x: number) {
    this.confident += x;
    this.update();
  }

  setMoreDamage(x: number) {
    this.moreDamage += x;
    this.update();
  }

  setMoreVulnerable(x: number) {
    this.moreVulnerable += x;
    this.update();
  }

  setBlind(x: number) {
    this.blind += x;
    this.update();
  }

  setWet(x: number) {
    this.wet += x;
    this.update();
  }

  setBurned(x: number) {
    this.burned += x;
    this.update();
  }

  setAbsorb(x: number) {
    this.lessDamage += x;
    this.update();
  }

  setSlow(x: number) {
    this.slow += x;
    this.update();
  }

  getSlow() {
    return this.slow > 0;
  }

  getAbsorb() {
    return this.lessDamage > 0;
  }

  getCold() {
    return this.cold > 0;
  }

  getShocked() {
    return this.shocked > 0;
  }

  getStuned() {
    return this.stuned > 0;
  }

  getBleeding() {
    return this.bleeding > 0;
  }

  getInvisitility() {
    return this.invisibility > 0;
  }

  getPoisoned() {
    return this.poisoned > 0;
  }

  getStupid() {
    return this.stupid > 0;
  }

  getSpeed() {
    return this.speed > 0;
  }

  getAgile() {
    return this.agile > 0;
  }

  getConfident() {
    return this.confident > 0;
  }

  getWet() {
    return this.wet > 0;
  }

  getBurned() {
    return this.burned > 0;
  }

  report() {
    let r = [];
    if (this.stuned) {
      r.push("Stuned");
    }
    if (this.bleeding) {
      r.push("Bleeding");
    }
    if (this.invisibility) {
      r.push("Invisible");
    }
    if (this.poisoned) {
      r.push("Poisoned");
    }
    if (this.stupid) {
      r.push("Intel-");
    }
    if (this.speed) {
      r.push("Movement+");
    }
    if (this.slow) {
      r.push("Movement-");
    }
    if (this.agile) {
      r.push("Dodge+");
    }
    if (this.confident) {
      r.push("Range+");
    }
    if (this.moreVulnerable) {
      r.push("Absorb-");
    }
    if (this.lessDamage) {
      r.push("Absorb+");
    }
    if (this.moreDamage) {
      r.push("Dmg+");
    }
    if (this.blind) r.push("Sight-");
    if (this.wet) r.push("Wet");
    if (this.burned) r.push("Burned");
    return r;
  }

  clean() {
    this.stuned = 0;
    this.bleeding = 0;
    this.invisibility = 0;
    this.poisoned = 0;
    this.stupid = 0;
    this.speed = 0;
    this.agile = 0;
    this.confident = 0;
    this.moreDamage = 0;
    this.moreVulnerable = 0;
    this.wet = 0;
    this.blind = 0;
    this.burned = 0;
    this.update();
  }

  update() {
    if (this.notif === false) return;
    gameBus.publish(enchantChanged({ report: this.report().join("\n") }));
  }
}
