type Context = any;

export type Trigger = "onHit"
  | "onMove"
  | "onEquip"
  | "onBeHit"

// Enchant is something that can be applied to an Entity when a trigger occurs.
export type Enchant = {
  id: string;
  onHit?: (ctx: Context) => void;
  onMove?: (ctx: Context) => void;
  onEquip?: (ctx: Context) => void;
  onBeHit?: (ctx: Context) => void;
}

class EnchantSystem {
  private enchants: Enchant[] = [];

  add(e: Enchant) {
    this.enchants.push(e);
  }

  trigger<K extends keyof Enchant>(type: Trigger, ctx: Context) {
    for (const e of this.enchants) {
      e[type]?.(ctx);
    }
  }

  get(type: Trigger) {
    return this.enchants.filter(e => typeof e[type] === 'function');
  }
}