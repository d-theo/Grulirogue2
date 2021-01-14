import { XTable, getInTable } from "../monsters/mob-table";
import { pickInArray, pickInRange } from "../utils/random";
import { GameRange } from "../utils/range";
import { Weapon } from "../items/weapon";
import { Affect } from "../effects/affects";
import * as _ from 'lodash';
import { wearAccuracy, wearMoreDodge, wearMoreHp } from "./onWear/onwear";

export const DmgPerTier = [1,3,5,7,9,13,16];
export const rangePerTier = [1,2,3,4,5,5,5];

export const namesPerRange = [
{
    names: ['Fist'],
    range: 1
},
{
    names: ['Slingshot'],
    range: 2
},
{
    names: ['Blowpipe'],
    range: 3
},
{
    names: ['Short bow'],
    range: 4
},
{
    names: ['Crossbow'],
    range: 5
}
];

export const namesPerDamage = [
    {
        names: ['Weak', 'Broken', 'Tiny', 'Unreliable', 'Useless'],
        lessThan: 3
    },
    {
        names: ['Small', 'Rusty', 'Crappy'],
        lessThan: 5
    },
    {
        names: ['Standard', 'Mediocre'],
        lessThan: 10
    },
    {
        names: ['Polished', 'Military', 'Fine'],
        lessThan: 15
    },
    {
        names: ['Epic', 'Well crafted'],
        lessThan: 20
    },
];

export const WeaponEchants: XTable = [
    {chance: 26, type: 'nothing'},
    {chance: 15, type: 'plus_one'},
    {chance: 10, type: 'plus_two'},
    {chance: 5, type: 'poisoned'},
    {chance: 5, type: 'bleed'},
    {chance: 5, type: 'stun'},
    {chance: 5, type: 'shock'},
    {chance: 5, type: 'cold'},
    {chance: 5, type: 'weak'},
    {chance: 3, type: 'plus_three'},
    {chance: 2, type: 'plus_four'},
    {chance: 1, type: 'plus_five'},
    {chance: 5, type: 'minus_one'},
    {chance: 5, type: 'minus_two'},
    {chance: 5, type: 'minus_three'},
];

export const WeaponOnCarryBonus = [
    wearAccuracy,
    wearMoreHp,
    wearMoreDodge
]

const getDmgName = (dmg: number) => {
    for(let n of namesPerDamage) {
        if (dmg <= n.lessThan) {
            return pickInArray(n.names);
        }
    }
}
const getRangeName = (range: number) => {
    for(let n of namesPerRange) {
        if (range === n.range) {
            return pickInArray(n.names);
        }
    }
}

export const craftWeapon = (tier: number): Weapon => {
    if (tier <= 0) tier = 1;
    const dmgIdx = pickInRange(`${1}-${tier+1}`);
    const rangeIdx = pickInRange(`${0}-${tier+1}`);
    const weaponRange = rangePerTier[rangeIdx];

    const rand = new GameRange(DmgPerTier[dmgIdx-1], DmgPerTier[dmgIdx]); // fixme
    const dmg = [rand.pick(), rand.pick()].sort();
    const weaponDmg = dmg.join('-');

    const weaponName = `${getDmgName(dmg[1])} ${getRangeName(weaponRange)}`;
    const w = new Weapon({
        name: weaponName,
        baseDamage: weaponDmg,
        maxRange: weaponRange,
        skin: getRangeName(weaponRange)
    });
    const enchants = Array.from(new Set(enchantsForWeapon()));
    for (const e of enchants) {
        switch(e) {
            case 'nothing':
                break;
            case 'plus_one':
                w.modifyAdditionnalDmg(+ 1);
                w.identified = false;
                break;
            case 'minus_one':
                w.modifyAdditionnalDmg(- 1);
                w.identified = false;
                break;
            case 'minus_two':
                w.modifyAdditionnalDmg(- 2);
                w.identified = false;
                break;
            case 'minus_three':
                w.modifyAdditionnalDmg(- 3);
                w.identified = false;
                break;
            case 'plus_two':
                w.modifyAdditionnalDmg(+ 1);
                w.identified = false;
                break;
            case 'plus_three':
                w.modifyAdditionnalDmg(+ 1);
                w.identified = false;
                break;
            case 'plus_four':
                w.modifyAdditionnalDmg(+ 1);
                w.identified = false;
                break;
            case 'plus_five':
                w.modifyAdditionnalDmg(+ 1);
                w.identified = false;
                break;
            case 'stun':
                w.additionnalEffects.push({effect: new Affect('stun').turns(1).create(), target: 'target', chance: 0.07});
                w.additionalDescription.push('can stun the target');
                w.additionalName.push('Stun');
                w.identified = false;
            break;
            case 'bleed':
                w.additionnalEffects.push({effect: new Affect('bleed').turns(3).create(), target: 'target', chance: 0.1});
                w.additionalDescription.push('inflict bleeding');
                w.additionalName.push('Bleeding');
                w.identified = false;
                break;
            case 'poison':
                w.additionnalEffects.push({effect: new Affect('poison').turns(4).create(), target: 'target', chance: 0.5});
                w.additionalDescription.push('poison the target');
                w.additionalName.push('Poison');
                w.identified = false;
                break;
            case 'shock':
                w.additionnalEffects.push({effect: new Affect('shock').create(), target: 'target', chance: 0.5});
                w.additionalDescription.push('Can shock the target. If the target is wet, it also adds a bonus dammage');
                w.additionalName.push('Lightning');
                w.identified = false;
                break;
            case 'cold':
                w.additionnalEffects.push({effect: new Affect('cold').create(), target: 'target', chance: 0.5});
                w.additionalDescription.push('Deals additionnal cold damages. If the target is wet, it also freeze it');
                w.additionalName.push('Cold');
                w.identified = false;
                break;  
            case 'weakness':
                w.additionnalEffects.push({effect: new Affect('weakness').params(5).turns(10).isStackable(true).create(), target: 'target', chance: 0.1});
                w.additionalDescription.push('Weaken your opponent by reducing their total hp');
                w.additionalName.push('Weakness');
                w.identified = false;
                break;
            default:
                break;
        }
    }
    if (Math.random() > 0.05) {
        const onCarryEnchant = _.sample(WeaponOnCarryBonus);
        w.onEquipBuffs.push(onCarryEnchant!.effect);
        w.additionalDescription.push(onCarryEnchant!.description);
        w.additionalName.push(onCarryEnchant!.name);
        w.identified = false;
    }
    return w;
}

function enchantsForWeapon() {
    const p = pickInRange('0-100');
    if (p > 90) {
        return [getInTable(WeaponEchants), getInTable(WeaponEchants), getInTable(WeaponEchants), getInTable(WeaponEchants)];
    } else if (p > 60) {
        return [getInTable(WeaponEchants), getInTable(WeaponEchants), getInTable(WeaponEchants)];
    } else if (p > 30) {
        return [getInTable(WeaponEchants), getInTable(WeaponEchants)];
    } else {
        return [getInTable(WeaponEchants)];
    }
}