import { XTable, getInTable } from "../monsters/mob-table"
import { pickInRange, pickInArray } from "../utils/random";
import { GameRange } from "../utils/range";
import { EffectMaker, Effects, SpellNames } from "../effects/effect";
import { Potion } from "./potion";
import { Item } from "../entitybase/item";
import { Weapon } from "../entitybase/weapon";
import { Scroll } from "./scroll";
import { Armour } from "../entitybase/armour";

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

export const Armours = {
    Classic: {
        name: 'Light Armour',
        absorb: '1-2',
        description: 'Does what it is supposed to do.',
        skin: 'armour-light',
        bulky: 0,
    },
    Heavy: {
        name: 'Heavy Armour',
        absorb: '3-4',
        description: 'Absorb the dammage at the cost of being less agile',
        skin: 'armour-heavy',
        bulky: 0.15,
    }
}

export const ArmoursTable: XTable[] = [
    [{chance: 100, type: Armours.Classic}, {chance: 0, type: Armours.Heavy}],
    [{chance: 75, type: Armours.Classic}, {chance: 25, type: Armours.Heavy}],
    [{chance: 75, type: Armours.Classic}, {chance: 25, type: Armours.Heavy}],
];

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
    }
}

export const ItemTable: XTable[] = [
    [{chance: 55, type: 'potion'}, {chance: 20, type: 'scroll'}, {chance: 15, type: 'weapon'}, {chance: 10, type: 'armour'}],
    [{chance: 40, type: 'potion'}, {chance: 20, type: 'scroll'}, {chance: 20, type: 'weapon'}, {chance: 20, type: 'armour'}],
    [{chance: 40, type: 'potion'}, {chance: 20, type: 'scroll'}, {chance: 20, type: 'weapon'}, {chance: 20, type: 'armour'}],
    [{chance: 40, type: 'potion'}, {chance: 20, type: 'scroll'}, {chance: 20, type: 'weapon'}, {chance: 20, type: 'armour'}],
]

export const PotionTable: XTable = [
    {chance: 25, type: Potions.Health},
    {chance: 12, type: Potions.Thickness},
    {chance: 12, type: Potions.Speed},
    {chance: 12, type: Potions.Accuracy},
    {chance: 12, type: Potions.Curring},
    {chance: 12, type: Potions.Dodge},
    {chance: 5, type: Potions.Immobilisation},
    {chance: 5, type: Potions.Rage},
    {chance: 3, type: Potions.Stupidity},
    {chance: 2, type: Potions.XP},
];

export const ScrollTable: XTable = [
    {chance: 25, type: Scrolls.Identification},
    {chance: 25, type: Scrolls.Teleportation},
    {chance: 15, type: Scrolls.EnchantWeapon},
    {chance: 15, type: Scrolls.EnchantArmour},
    {chance: 10, type: Scrolls.Knowledge},
    {chance: 10, type: Scrolls.Blink},
];

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
        names: ['Weak', 'Broken', 'Tiny', ''],
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
    {chance: 44, type: 'nothing'},
    {chance: 15, type: 'plus_one'},
    {chance: 10, type: 'plus_two'},
    {chance: 5, type: 'poisoned'},
    {chance: 5, type: 'bleed'},
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

export function getRandomLoot(level: number): Item {
    const itemKind = getInTable(ItemTable[level-1]);
    let loot: Item;
    switch (itemKind) {
        case "potion": 
            const p = getInTable(PotionTable);
            loot = new Potion({
                name: p.name,
                description: p.description,
                effect: p.effect()
            });
            break;
        case "scroll": 
            const s = getInTable(ScrollTable);
            loot = new Scroll({
                name: s.name,
                description: s.description,
                effect: s.effect()
            });
            break;
        case "weapon": 
            const w = craftWeapon(pickInRange(level-1,level+1));
            loot = w;
            break;
        case 'armour':
            const armour = getInTable(ArmoursTable[level-1]);
            const a = new Armour({
                name: armour.name,
                baseAbsorb: pickInRange(armour.absorb),
                bulky: armour.bulky,
                description: armour.description,
                skin: armour.skin
            });
            loot = a;   
            break;
        default:
            throw new Error(`Not implemented loot type : ${itemKind}`);
    }
    return loot;
}