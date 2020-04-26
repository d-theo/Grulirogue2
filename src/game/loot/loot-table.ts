import { XTable, getInTable } from "../monsters/mob-table"
import { pickInRange } from "../utils/random";
import { Item } from "../entitybase/item";
import { Armours } from "./loot-armours";
import { Potions } from "./loot-potions";
import { Scrolls } from "./loot-scrolls";
import { craftWeapon } from "./loot-weapons";
import { Potion } from "../items/potion";
import { Scroll } from "../items/scroll";
import { Armour } from "../items/armour";
import { SphereOfShadows, WildfireBottle, createWildFireBottle, createSphereOfShadow } from "./loot-mics";

export const ArmoursTable: XTable[] = [
    [{chance: 100, type: Armours.Classic}, {chance: 0, type: Armours.Heavy}],
    [{chance: 75, type: Armours.Classic}, {chance: 25, type: Armours.Heavy}],
    [{chance: 75, type: Armours.Classic}, {chance: 25, type: Armours.Heavy}],
];

export const ItemTable: XTable[] = [
    //[{chance: 0, type: 'potion'}, {chance: 0, type: 'scroll'}, {chance: 0, type: 'weapon'}, {chance: 0, type: 'armour'}, {chance: 100, type: 'misc'}],
    [{chance: 50, type: 'potion'}, {chance: 20, type: 'scroll'}, {chance: 15, type: 'weapon'}, {chance: 10, type: 'armour'}, {chance: 5, type: 'misc'}],
    [{chance: 40, type: 'potion'}, {chance: 20, type: 'scroll'}, {chance: 15, type: 'weapon'}, {chance: 20, type: 'armour'}, {chance: 5, type: 'misc'}],
    [{chance: 40, type: 'potion'}, {chance: 20, type: 'scroll'}, {chance: 15, type: 'weapon'}, {chance: 20, type: 'armour'}, {chance: 5, type: 'misc'}],
    [{chance: 40, type: 'potion'}, {chance: 20, type: 'scroll'}, {chance: 15, type: 'weapon'}, {chance: 20, type: 'armour'}, {chance: 5, type: 'misc'}],
]

export const MiscTable: XTable = [
    {chance: 50, type: () => createWildFireBottle()},
    {chance: 50, type: () => createSphereOfShadow()},
];

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
        case 'misc':
            const item = getInTable(MiscTable)();
            loot = item;
            break;
        default:
            throw new Error(`Not implemented loot type : ${itemKind}`);
    }
    return loot;
}