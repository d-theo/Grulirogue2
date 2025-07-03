import {XTable} from "../monsters/mob-table";
import {pickInRange} from "../utils/random";
import {Conditions} from "../../content/conditions/conditions";
import {Buff2} from "../entitybase/buff";

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
    effect: Buff2.create(Conditions.wet).setTurns(Infinity),
    name: "of moist",
    description: "This armour is strangely wet",
  },
  {
    effect: Buff2.create(() => Conditions.dodge({dodgeBonus: 0.05})).setTurns(Infinity).setIsStackable(true),
    name: "of illusion",
    description: "This armour looks strange and make ennemies miss more often",
  },
  {
    effect: Buff2.create(() => Conditions.health({
      amount: 2,
      procChance: 0.01
    })).setTurns(Infinity).setIsStackable(true),
    name: "of life",
    description: "This armour is pulsing sometimes like it's alive",
  },
  {
    effect: Buff2.create(Conditions.brave).setTurns(Infinity),
    name: "of braveness",
    description: "This armour shines only when you need it",
  },
  {
    effect: Buff2.create(() => Conditions.procChance({
      proc: 0.01,
      condition: Conditions.speed,
      turns: 5
    })).setTurns(Infinity),
    name: "of speed",
    description: "This armour weight nothing",
  },
  {
    effect: Buff2.create(() => Conditions.hp({bonusHp: pickInRange("5-15")})).setTurns(Infinity).setIsStackable(true),
    name: "of vitality",
    description: "this weapon grants you more vitality",
  },
];

export const armourLevel: XTable = [
  {type: -3, chance: 5},
  {type: -2, chance: 15},
  {type: -1, chance: 30},
  {type: +1, chance: 30},
  {type: +2, chance: 15},
  {type: +3, chance: 5},
];
