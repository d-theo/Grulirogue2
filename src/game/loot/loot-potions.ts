import { EffectMaker, Effects } from "../effects/effect";

export const Potions = {
    Thickness: {
        name:'thickness potion',
        description: 'A potion that makes your skin thicker but also slower',
        effect: () => EffectMaker.create(Effects.Thick),
    },
    Health: {
        name:'health potion',
        description: 'Smells bad, taste bad but it should works',
        effect: () => EffectMaker.create(Effects.Heal),
    },
    Dodge: {
        name:'potion of agility',
        description: 'A potion that makes you more agile but also more fragile',
        effect: () => EffectMaker.create(Effects.Dodge),
    },
    Blindness: {
        name:'potion of blindness',
        description: 'A very old alcoholic drink. It could makes you blind...',
        effect: () => EffectMaker.create(Effects.Blind),
    },
    Immobilisation: {
        name:'potion of immobilisation',
        description: 'A potion that looks quite useless',
        effect: () => EffectMaker.create(Effects.Stun),
    },
    Stupidity: {
        name:'potion of stupidity',
        description: 'Must be strong alcohol',
        effect: () => EffectMaker.create(Effects.Stupid),
    },
    Accuracy: {
        name:'accuraty potion',
        description: 'Makes your mind more focus',
        effect: () => EffectMaker.create(Effects.Accuraty),
    },
    Speed: {
        name:'Potion of celerity',
        description: 'A potion that makes you run faster',
        effect: () => EffectMaker.create(Effects.Speed),
    },
    XP: {
        name:'Potion of wisness',
        description: 'A potion that contains the wisdom of the ancien',
        effect: () => EffectMaker.create(Effects.XP),
    },
    Rage: {
        name:'Potion of rage',
        description: 'A potion that makes you enter in a big rage. Your attacks are stronger but at the cost of your defense',
        effect: () => EffectMaker.create(Effects.Rage),
    },
    Curring: {
        name:'Potion of curring',
        description: 'A potion that cure all the magic',
        effect: () => EffectMaker.create(Effects.Cleaning),
    }
}