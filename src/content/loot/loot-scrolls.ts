import {SpellMaker, SpellNames} from "../../content/spells/spell-factory";

export const Scrolls = {
  Blink: {
    name: "Scroll of blink",
    description: "Allow you to teleport for a short distance",
    effect: () => SpellMaker.createSpell(SpellNames.Blink),
  },
  Teleportation: {
    name: "Scroll of teleportation",
    description: "Randomly teleport you in the level",
    effect: () => SpellMaker.createSpell(SpellNames.Teleportation),
  },
  EnchantWeapon: {
    name: "Scroll of weapon improvement",
    description: "Improve a weapon",
    effect: () => SpellMaker.createSpell(SpellNames.EnchantWeapon),
  },
  EnchantArmour: {
    name: "Scroll of armour immprovement",
    description: "Improve your armour",
    effect: () => SpellMaker.createSpell(SpellNames.EnchantArmour),
  },
  Identification: {
    name: "Scroll of identification",
    description: "Identify an unknow item",
    effect: () => SpellMaker.createSpell(SpellNames.Identify),
  },
  Knowledge: {
    name: "Scroll of knowledge",
    description: "Reveal the stage",
    effect: () => SpellMaker.createSpell(SpellNames.Knowledge),
  },
  Fear: {
    name: "Scroll of fear",
    description: "Inspire fear to nearby ennemies",
    effect: () => SpellMaker.createSpell(SpellNames.Fear),
  },
  Sacrifice: {
    name: "Scroll of sacrifice",
    description:
      "This scroll is tainted with blood. You feel very anxious each time you manipulate it.\n Reading this scroll with curse you and your target. You will lose PERMANENTLY 25% of you MAX hp and inflict twice the effect to your target.",
    effect: () => SpellMaker.createSpell(SpellNames.Sacrifice),
  },
  Asservissement: {
    name: "Scroll of asservissement",
    description:
      "This scroll will turn an hostile monster into a slave. It might not work against strong monsters",
    effect: () => SpellMaker.createSpell(SpellNames.AsservissementSpell),
  },
  Weakness: {
    name: "Scroll of weakness",
    description: "This scroll will weaken the target of your spell",
    effect: () => SpellMaker.createSpell(SpellNames.Weakness),
  },
  SummoningWeak: {
    name: "Scroll of minor summoning",
    description: "This scroll will summon allies that fight by your side",
    effect: () => SpellMaker.createSpell(SpellNames.SummonWeak),
  },
};
