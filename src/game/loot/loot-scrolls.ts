import { EffectMaker, SpellNames } from "../effects/effect";

export const Scrolls = {
    Blink: {
        name:'Scroll of blink',
        description: 'Allow you to teleport for a short distance',
        effect: () => EffectMaker.createSpell(SpellNames.Blink),
    },
    Teleportation: {
        name:'Scroll of teleportation',
        description: 'Randomly teleport you in the level',
        effect: () => EffectMaker.createSpell(SpellNames.Teleportation),
    },
    EnchantWeapon: {
        name:'Scroll of weapon improvement',
        description: 'Improve a weapon',
        effect: () => EffectMaker.createSpell(SpellNames.EnchantWeapon),
    },
    EnchantArmour: {
        name:'Scroll of armour immprovement',
        description: 'Improve your armour',
        effect: () => EffectMaker.createSpell(SpellNames.EnchantArmour),
    },
    Identification: {
        name:'Scroll of identification',
        description: 'Identify an unknow item',
        effect: () => EffectMaker.createSpell(SpellNames.Identify),
    },
    Knowledge: {
        name:'Scroll of knowledge',
        description: 'Reveal the stage',
        effect: () => EffectMaker.createSpell(SpellNames.Knowledge),
    },
    Fear: {
        name:'Scroll of fear',
        description: 'Inspire fear to nearby ennemies',
        effect: () => EffectMaker.createSpell(SpellNames.Fear),
    },
    Sacrifice: {
        name: 'Scroll of sacrifice',
        description: 'This scroll is tainted with blood. You feel very anxious each time you manipulate it.\n Reading this scroll with curse you and your target. You will lose PERMANENTLY 25% of you MAX hp and inflict twice the effect to your target.',
        effect: () => EffectMaker.createSpell(SpellNames.Sacrifice)
    },
    Asservissement: {
        name: 'Scroll of asservissement',
        description: 'This scroll will turn an hostile monster into a slave. It might not work against strong monsters',
        effect: () => EffectMaker.createSpell(SpellNames.AsservissementSpell)
    }
}