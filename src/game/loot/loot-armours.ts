import { Affect } from "../effects/affects"
import { XTable } from "../monsters/mob-table";

export const Armours = {
    Classic: {
        name: 'Light Armour',
        absorb: '1-1',
        description: 'Does what it is supposed to do.',
        skin: 'armour-light',
        bulky: 0,
    },
    Heavy: {
        name: 'Heavy Armour',
        absorb: '2-3',
        description: 'Absorb the dammage at the cost of being less agile',
        skin: 'armour-heavy',
        bulky: 0.15,
    }
}

export const ArmourEnchants = [
    {effect: new Affect('wet').turns(Infinity).create(), name: 'of moist', description: 'This armour is strangely wet'},
    {effect: new Affect('dodge').turns(Infinity).params(0.05).isStackable(true).create(), name: 'of illusion', description: 'This armour looks strange and make ennemies miss more often'},
    {effect: new Affect('health').turns(Infinity).params(2, 0.01).isStackable(true).create(), name: 'of life', description: 'This armour looks like it\'s alive'},
    {effect: new Affect('brave').turns(Infinity).create(), name: 'of braveness', description: 'This armour shines only when you need it'},
];

/*export const ArmourProcs = [
    {effect: EffectMaker.createSpell(SpellNames.ThornSpell), chance: 1, name: 'of Thorns', description: 'This armour has spikes that return damages'},
    {effect: EffectMaker.createSpell(SpellNames.JumpSpell), chance: 0.05, name: 'of Thorns', description: 'This armour is instable'},
]*/

export const armourLevel: XTable = [
    {type: -3, chance: 5},
    {type: -2, chance: 15},
    {type: -1, chance: 30},
    {type: +1, chance: 30},
    {type: +2, chance: 15},
    {type: +3, chance: 5},
];