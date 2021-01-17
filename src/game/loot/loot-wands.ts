import { SpellBook } from "../effects/spell-book";

export const Wands = {
    Floral: {
        name:'Wand of vegetation',
        description: 'Spans vegetation at the given location',
        effect: () => SpellBook.FloralLine,
        skin: 'wand-herb'
    },
    Fire: {
        name:'Wand of fire',
        description: 'Spans fire at the given location',
        effect: () => SpellBook.FireLine,
        skin: 'wand-fire'
    },
    Water: {
        name:'Wand of water',
        description: 'Spans water at the given location',
        effect: () => SpellBook.WaterLine,
        skin: 'wand-water'
    },
    /*Poison: {
        name:'Wand of poison gaz',
        description: 'Spans poisoned gaz at the given location',
        effect: () => EffectMaker.createSpell(SpellNames.EnchantArmour),
        skin: 'wand-poison'
    },*/
    Identification: {
        name:'Wand of identification',
        description: 'Identify an unknow item',
        effect: () => SpellBook.IdentifiySpell,
        skin: 'wand-identification'
    }
}