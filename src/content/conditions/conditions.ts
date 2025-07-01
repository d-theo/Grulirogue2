import { gameBus } from "../../eventBus/game-bus";
import { logPublished } from "../../events";
import { NullFunc } from "../../game/effects/affects";
import { DamageResolution } from "../../game/fight/damages";
import { Hero } from "../../game/hero/hero";
import { Monster } from "../../game/monsters/monster";
import { pickInRange } from "../../game/utils/random";

// onApply onTick onRemove

// buff is a condition with time & etra data

// effect is one Shot action 
// interface Effect { apply(target) }

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
