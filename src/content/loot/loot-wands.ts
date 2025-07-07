import {SpellMaker, SpellNames} from "../../content/spells/spell-factory";

export const Wands = {
  Floral: {
    name: "Wand of vegetation",
    description: "Spans vegetation at the given location",
    effect: () => SpellMaker.createSpell(SpellNames.FloralLine),
    skin: "wand-herb",
  },
  Fire: {
    name: "Wand of fire",
    description: "Spans fire at the given location",
    effect: () => SpellMaker.createSpell(SpellNames.FireLine),
    skin: "wand-fire",
  },
  Water: {
    name: "Wand of water",
    description: "Spans water at the given location",
    effect: () => SpellMaker.createSpell(SpellNames.WaterLine),
    skin: "wand-water",
  },
  Identification: {
    name: "Wand of identification",
    description: "Identify an unknow item",
    effect: () => SpellMaker.createSpell(SpellNames.Identify),
    skin: "wand-identification",
  },
};
