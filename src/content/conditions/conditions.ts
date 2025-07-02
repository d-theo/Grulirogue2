import { gameBus } from "../../eventBus/game-bus";
import { logPublished } from "../../events";
import { NullFunc } from "../../game/effects/affects";
import { DamageResolution } from "../../game/fight/damages";
import { Hero } from "../../game/hero/hero";
import { Monster } from "../../game/monsters/monster";
import { pickInRange } from "../../game/utils/random";

// a Condition has => onApply onTick onRemove
// a Buff is a Condition with time & extra data
// an Effect is one Shot action with interface Effect { apply(target) }
// an Enchant is a Condition with onHit, onMove, handler...
/**
 * interface Enchant {
 *   id: string;
 *   onHit?: (ctx: Context) => void;
 *   onMove?: (ctx: Context) => void;
 *   // etc
 * }
 *
 * const poisonOnHit: Enchant = {
 *   id: "poisonOnHit",
 *   onHit(ctx) {
 *     // apply poison buff
 *   }
 * };
 *
 * class EnchantSystem {
 *   // ctx : world
 *   private enchants: Enchant[] = [];
 *
 *   add(e: Enchant) {
 *     this.enchants.push(e);
 *   }
 *
 *   trigger<K extends keyof Enchant>(type: K, ctx: Context) {
 *     for (const e of this.enchants) {
 *       e[type]?.(ctx);
 *     }
 *   }
 *
 *   get(type: keyof Enchant) {
 *     return this.enchants.filter(e => typeof e[type] === 'function');
 *   }
 * }
 */


// EnchantTable should be renamed => Afflictions

// Entities should have a list of Afflictions, Enchants and Buffs.

export type Condition = {
  start?: (entity: Hero | Monster) => void;
  tick?: (entity: Hero | Monster) => void;
  end?: (entity: Hero | Monster) => void;
  tags?: string;
};

export const Conditions = {
  bleed: () => ({
    start: (t: Hero | Monster) => {
      t.enchants.setBleeding(true);
      gameBus.publish(
        logPublished({ level: "danger", data: `${t.name} starts bleeding` })
      );
    },
    tick: (t: Hero | Monster) => {
      new DamageResolution(null, t, 4 + t.level, "bleeding");
    },
    end: (t: Hero | Monster) => t.enchants.setBleeding(false),
    tags: "bleed",
  }),
  damage: ({ procChance, maxDmg, cause }) => ({
    start: null,
    tick: (t: Hero | Monster) => {
      if (procChance > Math.random()) return;
      const dmg = pickInRange(maxDmg);
      new DamageResolution(null, t, dmg, cause);
    },
    end: NullFunc,
  }),
};
