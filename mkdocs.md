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