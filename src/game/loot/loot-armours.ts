import { XTable } from "../monsters/mob-table";
import { wearWet, wearMoreDodge, wearMoreRegen, wearMoveBrave, wearMoreSpeed, wearMoreHp } from "./onWear/onwear";

export const Armours = {
    Classic: {
        name: 'Light Armour',
        absorb: '1-2',
        description: 'Does what it is supposed to do.',
        skin: 'armour-light',
        bulky: 0.05,
    },
    Heavy: {
        name: 'Heavy Armour',
        absorb: '2-3',
        description: 'Absorb the dammage at the cost of being less agile',
        skin: 'armour-heavy',
        bulky: 0.15,
    },
    Plate: {
        name: 'Plate Armour',
        absorb: '4-6',
        description: 'Very bulky, very protective',
        skin: 'armour-plate',
        bulky: 0.4,
    }
}

export const ArmourEnchants = [
    wearWet,
    wearMoreDodge,
    wearMoreRegen,
    wearMoveBrave,
    wearMoreSpeed,
    wearMoreHp,
];

export const armourLevel: XTable = [
    {type: -3, chance: 5},
    {type: -2, chance: 15},
    {type: -1, chance: 30},
    {type: +1, chance: 30},
    {type: +2, chance: 15},
    {type: +3, chance: 5},
];