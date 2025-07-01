import { Affect } from "../effects/affects";
import { XTable } from "../monsters/mob-table";
import { pickInRange } from "../utils/random";

export const Armours = {
  Classic: {
    name: "Light Armour",
    absorb: "1-1",
    description: "Does what it is supposed to do.",
    skin: "armour-light",
    bulky: 0,
  },
  Heavy: {
    name: "Heavy Armour",
    absorb: "2-3",
    description: "Absorb the dammage at the cost of being less agile",
    skin: "armour-heavy",
    bulky: 0.15,
  },
};

export const ArmourEnchants = [
  {
    effect: new Affect("wet").turns(Infinity).create(),
    name: "of moist",
    description: "This armour is strangely wet",
  },
  {
    effect: new Affect("dodge")
      .turns(Infinity)
      .params(0.05)
      .isStackable(true)
      .create(),
    name: "of illusion",
    description: "This armour looks strange and make ennemies miss more often",
  },
  {
    effect: new Affect("health")
      .turns(Infinity)
      .params(2, 0.01)
      .isStackable(true)
      .create(),
    name: "of life",
    description: "This armour is pulsing sometimes like it's alive",
  },
  {
    effect: new Affect("brave").turns(Infinity).create(),
    name: "of braveness",
    description: "This armour shines only when you need it",
  },
  {
    effect: new Affect("procChance")
      .turns(Infinity)
      .params("speed", 0.01, 5)
      .create(),
    name: "of speed",
    description: "This armour weight nothing",
  },
  {
    effect: new Affect("hp")
      .params(pickInRange("5-15"))
      .isStackable(true)
      .turns(Infinity)
      .create(),
    name: "of vitality",
    description: "this weapon grants you more vitality",
  },
];

export const armourLevel: XTable = [
  { type: -3, chance: 5 },
  { type: -2, chance: 15 },
  { type: -1, chance: 30 },
  { type: +1, chance: 30 },
  { type: +2, chance: 15 },
  { type: +3, chance: 5 },
];
