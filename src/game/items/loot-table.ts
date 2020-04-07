import { XTable, getInTable } from "../monsters/mob-table"
import { pickInRange, pickInArray } from "../utils/random";
import { GameRange } from "../utils/range";
import { EffectMaker, Effects } from "../effects/effect";
import { Potion } from "./potion";
import { Item } from "../entitybase/item";
import { Weapon } from "../entitybase/weapon";
import { Scroll } from "./scroll";

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

export const Scrolls = {
    Fear: {

    },
    Identification: {

    },
    Blink: {

    },
    Teleportation: {

    },
}

export const ItemTable: XTable[] = [
    [{chance: 85, type: 'potion'}, {chance: 0, type: 'scroll'}, {chance: 15, type: 'weapon'}],
    [{chance: 85, type: 'potion'}, {chance: 0, type: 'scroll'}, {chance: 15, type: 'weapon'}],
    [{chance: 85, type: 'potion'}, {chance: 0, type: 'scroll'}, {chance: 15, type: 'weapon'}],
    [{chance: 85, type: 'potion'}, {chance: 0, type: 'scroll'}, {chance: 15, type: 'weapon'}],
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
    {chance: 4, type: Potions.Stupidity},
    {chance: 1, type: Potions.XP},
];

export const ScrollTable: XTable = [
    {chance: 0, type: Scrolls.Identification},
    {chance: 25, type: Scrolls.Teleportation},
    {chance: 100, type: Scrolls.Fear},
    {chance: 0, type: Scrolls.Blink}
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
        names: ['Weak', 'Broken', 'Tiny'],
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

export const craftWeapon = (tier: number) => {
    if (tier <= 0) tier = 1;
    const dmgIdx = pickInRange(`${tier-1}-${tier+1}`);
    const rangeIdx = pickInRange(`${tier-1}-${tier+1}`);
    const weaponRange = rangePerTier[rangeIdx];

    const rand = new GameRange(DmgPerTier[dmgIdx-1], DmgPerTier[dmgIdx]);
    const dmg = [rand.pick(), rand.pick()].sort();
    const weaponDmg = dmg.join('-');

    const weaponName = `${getDmgName(dmg[1])} ${getRangeName(weaponRange)}`;
    return new Weapon({
        name: weaponName,
        baseDamage: weaponDmg,
        maxRange: weaponRange,
        skin: getRangeName(weaponRange)
    });
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
            loot = new Scroll(s);
            break;
        case "weapon": 
            const w = craftWeapon(pickInRange(level-1,level+1));
            loot = w;
            break;
        default:
            throw new Error(`Not implemented loot type : ${itemKind.type}`);
    }
    return loot;
}