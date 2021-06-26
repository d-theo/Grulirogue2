import { SpellBook } from "../effects/spell-book";

export const Scrolls = {
    Blink: {
        name:'Scroll of blink',
        description: 'Allow you to teleport for a short distance',
        effect: () => SpellBook.BlinkSpell(),
    },
    Teleportation: {
        name:'Scroll of teleportation',
        description: 'Randomly teleport you in the level',
        effect: () => SpellBook.TeleportationSpell(),
    },
    EnchantWeapon: {
        name:'Scroll of weapon improvement',
        description: 'Improve a weapon',
        effect: () => SpellBook.ImproveWeaponSpell(),
    },
    EnchantArmour: {
        name:'Scroll of armour immprovement',
        description: 'Improve your armour',
        effect: () => SpellBook.ImproveArmourSpell(),
    },
    Identification: {
        name:'Scroll of identification',
        description: 'Identify an unknow item',
        effect: () => SpellBook.IdentifiySpell(),
    },
    Knowledge: {
        name:'Scroll of knowledge',
        description: 'Reveal the stage',
        effect: () => SpellBook.KnowledgeSpell(),
    },
    Fear: {
        name:'Scroll of fear',
        description: 'Inspire fear to nearby ennemies',
        effect: () => SpellBook.FearSpell(),
    },
    Sacrifice: {
        name: 'Scroll of sacrifice',
        description: 'This scroll is tainted with blood. You feel very anxious each time you manipulate it.\n Reading this scroll with curse you and your target. You will lose PERMANENTLY 25% of you MAX hp and inflict twice the effect to your target.',
        effect: () => SpellBook.SacrificeSpell()
    },
    Asservissement: {
        name: 'Scroll of asservissement',
        description: 'This scroll will turn an hostile monster into a slave. It might not work against strong monsters',
        effect: () => SpellBook.AsservissementSpell()
    },
    Weakness: {
        name: 'Scroll of weakness',
        description: 'This scroll will weaken the target of your spell',
        effect: () => SpellBook.WeaknessSpell()
    },
    SummoningWeak: {
        name: 'Scroll of minor summoning',
        description: 'This scroll will summon allies that fight by your side',
        effect: () => SpellBook.SummonWeakSpell()
    }
}