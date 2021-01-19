import { Hero } from "../hero/hero";
import { SpellBook } from "../effects/spell-book";
import { Magic } from "../entitybase/magic";
import { ticknessState } from "../effects/effect";
import { XPEffect } from "../effects/spells/xp-spell";

export const Potions = {
    Thickness: {
        name:'thickness potion',
        description: 'A potion that makes your skin thicker but also slower',
        effect: (t: Hero) => t.addBuff({
            magic: ticknessState,
            turns: 15,
        })
    },
    Health: {
        name:'health potion',
        description: 'Smells bad, taste bad but it should works',
        effect: (t: Hero) => t.heal(15, null),
    },
    Dodge: {
        name:'potion of agility',
        description: 'A potion that makes you more agile but also more fragile',
        effect: (t:Hero) => t.addBuff({
            magic: new Magic({dodge: +0.3}),
            turns: 15,
        }),
    },
    Blindness: {
        name:'potion of blindness',
        description: 'A very old alcoholic drink. It could makes you blind...',
        effect: (t:Hero) => t.addBuff({
            magic: new Magic({sigth: -4}),
            turns: 30,
        }),
    },
    Immobilisation: {
        name:'potion of immobilisation',
        description: 'A potion that looks quite useless',
        effect: (t:Hero) => t.addBuff({
            magic: new Magic({stun: true}),
            turns: 5,
        }),
    },
    Accuracy: {
        name:'accuraty potion',
        description: 'Makes your mind more focus',
        effect: (t:Hero) => t.addBuff({
            magic: new Magic({precision: 0.3}),
            turns: 15,
        }),
    },
    Speed: {
        name:'Potion of celerity',
        description: 'A potion that makes you run faster',
        effect: (t:Hero) => t.addBuff({
            magic: new Magic({speed: 1}),
            turns: 15,
        }),
    },
    XP: {
        name:'Potion of wisness',
        description: 'A potion that contains the wisdom of the ancien',
        effect: (t: Hero) => {
            const xp = SpellBook.XPEffect as XPEffect;
            xp.cast(t);
        }
    },
    Rage: {
        name:'Potion of rage',
        description: 'A potion that makes you enter in a big rage. Your attacks are stronger but at the cost of your defense',
        effect: (t:Hero) => t.addBuff({
            magic: new Magic({dam: 5, ac: -3}),
            turns: 15,
        }),
    },
    Berkserk: {
        name:'Potion of berserker',
        description: 'A potion that transforms you into a powerfull Berserker for a while. When the effect ends, your body will need to rest.',
        effect: (t:Hero) => t.addBuff({
            magic: new Magic({dam: 10, ac: 3, precision: 0.5}),
            turns: 15,
            end: () => t.addBuff({
                magic: new Magic({ac: -5, dodge: -0.3, precision: -0.3}),
                turns: 15
            })
        }),
    },
    Curring: {
        name:'Potion of curring',
        description: 'A potion that cure all the magic',
        effect: (t: Hero) => t.cleanse(),
    }
}