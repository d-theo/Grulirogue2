import { XTable, getInTable } from "../monsters/mob-table";
import { pickInArray, pickInRange } from "../utils/random";
import { GameRange } from "../utils/range";
import { EffectMaker, Effects } from "../effects/effect";
import { Weapon } from "../items/weapon";

export const DmgPerTier = [1,3,5,10,15];
export const rangePerTier = [1,2,3,4,5];

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
        names: ['Weak', 'Broken', 'Tiny', 'Unreliable'],
        lessThan: 3
    },
    {
        names: ['Small', 'Rusty'],
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
    }
];

export const WeaponEchants: XTable = [
    {chance: 39, type: 'nothing'},
    {chance: 15, type: 'plus_one'},
    {chance: 10, type: 'plus_two'},
    {chance: 5, type: 'poisoned'},
    {chance: 5, type: 'bleed'},
    {chance: 5, type: 'shock'},
    {chance: 3, type: 'plus_three'},
    {chance: 2, type: 'plus_four'},
    {chance: 1, type: 'plus_five'},
    {chance: 5, type: 'minus_one'},
    {chance: 5, type: 'minus_two'},
    {chance: 5, type: 'minus_three'},
];

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
    const dmgIdx = pickInRange(`${tier-1}-${tier+1}`);
    const rangeIdx = pickInRange(`${tier-1}-${tier+1}`);
    const weaponRange = rangePerTier[rangeIdx];

    const rand = new GameRange(DmgPerTier[dmgIdx-1], DmgPerTier[dmgIdx]);
    const dmg = [rand.pick(), rand.pick()].sort();
    const weaponDmg = dmg.join('-');

    const weaponName = `${getDmgName(dmg[1])} ${getRangeName(weaponRange)}`;
    const w = new Weapon({
        name: weaponName,
        baseDamage: weaponDmg,
        maxRange: weaponRange,
        skin: getRangeName(weaponRange)
    });
    const enchants = enchantsForWeapon();
    for (const e of enchants) {
        switch(e) {
            case 'nothing':
                break;
            case 'plus_one':
                w.additionnalDmg += 1;
                w.identified = false;
                break;
            case 'minus_one':
                w.additionnalDmg -= 1;
                w.identified = false;
                break;
            case 'minus_two':
                w.additionnalDmg -= 2;
                w.identified = false;
                break;
            case 'minus_three':
                w.additionnalDmg -= 3;
                w.identified = false;
                break;
            case 'plus_two':
                w.additionnalDmg += 1;
                w.identified = false;
                break;
            case 'plus_three':
                w.additionnalDmg += 1;
                w.identified = false;
                break;
            case 'plus_four':
                w.additionnalDmg += 1;
                w.identified = false;
                break;
            case 'plus_five':
                w.additionnalDmg += 1;
                w.identified = false;
                break;
            case 'bleed':
                w.additionnalEffects.push({effect: EffectMaker.create(Effects.Bleed), target: 'target', chance: 0.1});
                w.additionalDescription.push('inflict bleeding');
                w.identified = false;
                break;
            case 'poison':
                w.additionnalEffects.push({effect: EffectMaker.create(Effects.Poison), target: 'target', chance: 0.5});
                w.additionalDescription.push('poison the target');
                w.identified = false;
                break;
            case 'shock':
                w.additionnalEffects.push({effect: EffectMaker.create(Effects.Shock), target: 'target', chance: 0.5});
                w.additionalDescription.push('Can shock the target. If the target is wet, it also adds a bonus dammage');
                w.identified = false;
                break;
            default:
                break;
        }
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