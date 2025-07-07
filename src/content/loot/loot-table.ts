import { XTable, getInTable } from '../monsters/mob-table';
import { pickInRange } from '../../utils/random';
import { Armours, armourLevel, ArmourEnchants } from './loot-armours';
import { Potions } from './loot-potions';
import { Scrolls } from './loot-scrolls';
import { craftWeapon } from './loot-weapons';

import {
  createWildFireBottle,
  createSphereOfShadow,
  createTomeOfRain,
  createSmallTorch,
  createSmellyBottle,
  createSphereOfLighting,
  createColdCrystal,
  createTomeOfVegetation,
} from './loot-mics';
import * as _ from 'lodash';
import { Item } from '../../game/entitybase/item';
import { Armour } from '../../game/entitybase/items/armour';
import { Potion } from '../../game/entitybase/items/potion';
import { Scroll } from '../../game/entitybase/items/scroll';

export const ArmoursTable: XTable[] = [
  [
    { chance: 100, type: Armours.Classic },
    { chance: 0, type: Armours.Heavy },
  ],
  [
    { chance: 75, type: Armours.Classic },
    { chance: 25, type: Armours.Heavy },
  ],
  [
    { chance: 75, type: Armours.Classic },
    { chance: 25, type: Armours.Heavy },
  ],
  [
    { chance: 75, type: Armours.Classic },
    { chance: 25, type: Armours.Heavy },
  ],
  [
    { chance: 75, type: Armours.Classic },
    { chance: 25, type: Armours.Heavy },
  ],
  [
    { chance: 75, type: Armours.Classic },
    { chance: 25, type: Armours.Heavy },
  ],
];

export const ItemTable: XTable[] = [
  [
    { chance: 45, type: 'potion' },
    { chance: 30, type: 'scroll' },
    { chance: 10, type: 'weapon' },
    {
      chance: 10,
      type: 'armour',
    },
    { chance: 5, type: 'misc' },
  ],
  [
    { chance: 45, type: 'potion' },
    { chance: 30, type: 'scroll' },
    { chance: 10, type: 'weapon' },
    {
      chance: 10,
      type: 'armour',
    },
    { chance: 5, type: 'misc' },
  ],
  [
    { chance: 45, type: 'potion' },
    { chance: 30, type: 'scroll' },
    { chance: 10, type: 'weapon' },
    {
      chance: 10,
      type: 'armour',
    },
    { chance: 5, type: 'misc' },
  ],
  [
    { chance: 45, type: 'potion' },
    { chance: 30, type: 'scroll' },
    { chance: 10, type: 'weapon' },
    {
      chance: 10,
      type: 'armour',
    },
    { chance: 5, type: 'misc' },
  ],
  [
    { chance: 45, type: 'potion' },
    { chance: 30, type: 'scroll' },
    { chance: 10, type: 'weapon' },
    {
      chance: 10,
      type: 'armour',
    },
    { chance: 5, type: 'misc' },
  ],
  [
    { chance: 45, type: 'potion' },
    { chance: 30, type: 'scroll' },
    { chance: 10, type: 'weapon' },
    {
      chance: 10,
      type: 'armour',
    },
    { chance: 5, type: 'misc' },
  ],
  [
    { chance: 45, type: 'potion' },
    { chance: 30, type: 'scroll' },
    { chance: 10, type: 'weapon' },
    {
      chance: 10,
      type: 'armour',
    },
    { chance: 5, type: 'misc' },
  ],
];

export const MiscTable: XTable = [
  { chance: 10, type: () => createWildFireBottle() },
  { chance: 15, type: () => createSphereOfShadow() },
  { chance: 15, type: () => createTomeOfRain() },
  { chance: 10, type: () => createSmallTorch() },
  { chance: 10, type: () => createSmellyBottle() },
  { chance: 15, type: () => createColdCrystal() },
  { chance: 10, type: () => createSphereOfLighting() },
  { chance: 15, type: () => createTomeOfVegetation() },
];

export const PotionTable: XTable = [
  { chance: 20, type: Potions.Health },
  { chance: 12, type: Potions.Thickness },
  { chance: 12, type: Potions.Speed },
  { chance: 12, type: Potions.Accuracy },
  { chance: 12, type: Potions.Curring },
  { chance: 12, type: Potions.Dodge },
  { chance: 5, type: Potions.Immobilisation },
  { chance: 5, type: Potions.Rage },
  { chance: 5, type: Potions.Blindness },
  { chance: 2, type: Potions.XP },
  { chance: 5, type: Potions.Berkserk },
];

export const ScrollTable: XTable = [
  { chance: 15, type: Scrolls.Identification },
  { chance: 15, type: Scrolls.Teleportation },
  { chance: 15, type: Scrolls.EnchantWeapon },
  { chance: 15, type: Scrolls.EnchantArmour },
  { chance: 10, type: Scrolls.Knowledge },
  { chance: 10, type: Scrolls.Blink },
  { chance: 8, type: Scrolls.Fear },
  { chance: 5, type: Scrolls.Weakness },
  { chance: 2, type: Scrolls.Asservissement },
  { chance: 5, type: Scrolls.SummoningWeak },
];

export function getRandomLoot(level: number): Item {
  const itemKind = getInTable(ItemTable[level - 1]);
  let loot: Item;
  switch (itemKind) {
    case 'potion':
      const p = getInTable(PotionTable);
      loot = new Potion({
        name: p.name,
        description: p.description,
        effect: p.effect,
      });
      break;
    case 'scroll':
      const s = getInTable(ScrollTable);
      loot = new Scroll({
        name: s.name,
        description: s.description,
        effect: s.effect(),
      });
      break;
    case 'weapon':
      loot = craftWeapon(pickInRange(level - 1, level + 1));
      break;
    case 'armour':
      const armour = getInTable(ArmoursTable[level - 1]);
      loot = new Armour({
        name: armour.name,
        baseAbsorb: pickInRange(armour.absorb),
        bulky: armour.bulky,
        description: armour.description,
        skin: armour.skin,
      });
      if (Math.random() < 0.05) {
        const enchant = _.sample(ArmourEnchants);
        (loot as Armour).additionalName.push(enchant!.name);
        (loot as Armour).additionalDescription.push(enchant!.description);
        (loot as Armour).onEquipBuffs.push(enchant!.effect);
        loot.identified = false;
      }
      if (Math.random() < 0.1) {
        const add = getInTable(armourLevel);
        (loot as Armour).addAbsorbEnchant(add);
        loot.identified = false;
      }
      break;
    case 'misc':
      const item = getInTable(MiscTable)();
      loot = item;
      break;
    default:
      throw new Error(`Not implemented loot type : ${itemKind}`);
  }
  return loot;
}
