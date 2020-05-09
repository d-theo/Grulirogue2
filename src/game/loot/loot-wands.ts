import { EffectMaker, SpellNames } from "../effects/effect";

export const Wands = {
    Floral: {
        name:'Wand of vegetation',
        description: 'Spans vegetation at the given location',
        effect: () => EffectMaker.createSpell(SpellNames.Blink),
        skin: 'wand-herb'
    },
    Fire: {
        name:'Wand of fire',
        description: 'Spans fire at the given location',
        effect: () => EffectMaker.createSpell(SpellNames.Teleportation),
        skin: 'wand-fire'
    },
    Water: {
        name:'Wand of water',
        description: 'Spans water at the given location',
        effect: () => EffectMaker.createSpell(SpellNames.EnchantWeapon),
        skin: 'wand-water'
    },
    Poison: {
        name:'Wand of poison gaz',
        description: 'Spans poisoned gaz at the given location',
        effect: () => EffectMaker.createSpell(SpellNames.EnchantArmour),
        skin: 'wand-poison'
    },
    Identification: {
        name:'Wand of identification',
        description: 'Identify an unknow item',
        effect: () => EffectMaker.createSpell(SpellNames.Identify),
        skin: 'wand-identification'
    }
}