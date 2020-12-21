import { EffectMaker, SpellNames } from "../effects/effect";
import { Hero } from "../hero/hero";
import { Affect } from "../effects/affects";
import { CleaningEffect, XPEffect } from "../effects/spells";

export const Potions = {
    Thickness: {
        name:'thickness potion',
        description: 'A potion that makes your skin thicker but also slower',
        effect: (t: Hero) => new Affect('thicc').target(t).turns(15).cast()
    },
    Health: {
        name:'health potion',
        description: 'Smells bad, taste bad but it should works',
        effect: (t: Hero) => new Affect('heal').target(t).turns(1).cast()
    },
    Dodge: {
        name:'potion of agility',
        description: 'A potion that makes you more agile but also more fragile',
        effect: (t:Hero) => new Affect('dodge').params(0.3).turns(15).target(t).cast(),
    },
    Blindness: {
        name:'potion of blindness',
        description: 'A very old alcoholic drink. It could makes you blind...',
        effect: (t: Hero) => new Affect('blind').turns(15).params(6).target(t).cast(),
    },
    Immobilisation: {
        name:'potion of immobilisation',
        description: 'A potion that looks quite useless',
        effect: (t: Hero) => new Affect('stun').target(t).turns(5).cast(),
    },
    Accuracy: {
        name:'accuraty potion',
        description: 'Makes your mind more focus',
        effect: (t: Hero) => new Affect('accurate').turns(15).target(t).cast(),
    },
    Speed: {
        name:'Potion of celerity',
        description: 'A potion that makes you run faster',
        effect: (t: Hero) => new Affect('speed').turns(15).target(t).cast(),
    },
    XP: {
        name:'Potion of wisness',
        description: 'A potion that contains the wisdom of the ancien',
        effect: (t: Hero) => {
            const xp = EffectMaker.createSpell(SpellNames.XPSpell) as XPEffect;
            xp.cast(t);
        }
    },
    Rage: {
        name:'Potion of rage',
        description: 'A potion that makes you enter in a big rage. Your attacks are stronger but at the cost of your defense',
        effect: (t: Hero) => new Affect('rage').turns(15).target(t).cast(),
    },
    Berkserk: {
        name:'Potion of berserker',
        description: 'A potion that transforms you into a powerfull Berserker for a while. When the effect ends, your body will need to rest.',
        effect: (t: Hero) => new Affect('berserk').turns(15).target(t).cast(),
    },
    Curring: {
        name:'Potion of curring',
        description: 'A potion that cure all the magic',
        effect: (t: Hero) => {
            const clean = EffectMaker.createSpell(SpellNames.CleaningSpell) as CleaningEffect;
            clean.cast(t);
        },
    }
}