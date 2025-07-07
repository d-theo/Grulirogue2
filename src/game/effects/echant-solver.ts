import { Hero } from "../hero/hero";
import { gameBus } from "../../infra/events/game-bus";
import { DamageResolution } from "../fight/damages";
import { Conditions } from "../../content/conditions/conditions";
import { Buff2 } from "../entitybase/buff";
import { Monster } from "../entitybase/monsters/monster";
import { logPublished, playerHealed, monsterTookDamage } from "../events";

export class EnchantSolver {
  constructor(private t: Hero | Monster) {}

  solve() {
    if (this.t.enchants.getWet()) {
      this.t.buffs.cleanBuffType("burn");
    }
    if (this.t.enchants.getBurned()) {
      gameBus.publish(
        logPublished({ level: "warning", data: `${this.t.name} is burning` })
      );
      new DamageResolution(null, this.t, 1, "burning");
    }
    if (this.t.enchants.getBurned() && this.t.enchants.getPoisoned()) {
      this.t.addBuff(
        Buff2.create(Conditions.bleed).setTurns(1).setIsStackable(true)
      );
    }
    if (this.t.enchants.getFloral() && this.t.enchants.getWet()) {
      this.t.health.take(-1);
      if (this.t instanceof Hero) {
        gameBus.publish(
          playerHealed({
            baseHp: this.t.health.baseHp,
            currentHp: this.t.health.currentHp,
          })
        );
      } else {
        gameBus.publish(
          monsterTookDamage({
            monster: this.t,
            amount: -1,
            baseHp: this.t.health.baseHp,
            currentHp: this.t.health.currentHp,
          })
        );
      }
    }
  }
}
