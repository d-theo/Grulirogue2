import { SpecialPlaces } from '../places/special-places';
import { TileMap } from '../tilemap/tilemap';
import * as _ from 'lodash';
import { ThingToPlace } from '../../world/generation/map_tiling_utils';
import { PotionTable, MiscTable } from '../../content/loot/loot-table';
import { craftWeapon } from '../../content/loot/loot-weapons';
import { Bestiaire } from '../../content/monsters/bestiaire';
import { getInTable } from '../../content/monsters/mob-table';
import { ItemCollection } from '../entitybase/items/item-collection';
import { Potion } from '../entitybase/items/potion';
import { Weapon } from '../entitybase/items/weapon';
import { Monster } from '../entitybase/monsters/monster';
import { MonsterCollection } from '../entitybase/monsters/monsterCollection';
import { MonsterFactory } from '../entitybase/monsters/monster-factory';

export function makeThings(
  additional: ThingToPlace[],
  monsterFactory: MonsterFactory,
  monsterCollection: MonsterCollection,
  itemCollection: ItemCollection,
  tilemap: TileMap,
  places: SpecialPlaces
) {
  for (const add of additional) {
    switch (add.type) {
      case 'snakeBoss':
        let m = Bestiaire.Greece.SnakeKing;
        const king = monsterFactory.createMonster(Object.assign(m, { pos: add.pos }));
        monsterCollection.monstersArray().push(king);
        break;
      case 'potion':
        const p = getInTable(PotionTable);
        const potion = new Potion({
          name: p.name,
          description: p.description,
          effect: p.effect,
        });
        potion.pos = add.pos;
        itemCollection.itemsArray().push(potion);
        break;
      case 'misc':
        const miscItem = getInTable(MiscTable);
        const it = miscItem();
        it.pos = add.pos;
        itemCollection.itemsArray().push(it);
        break;
      case 'monster':
        let _snake = Bestiaire.Greece.Snake;
        const snake = Monster.makeMonster(Object.assign(_snake, { pos: add.pos }));
        monsterCollection.monstersArray().push(snake);
        break;
      case 'item-good':
        let item: Weapon = craftWeapon(3);
        item.pos = add.pos;
        itemCollection.itemsArray().push(item);
        break;
      case 'pirateBoss':
        let p1 = Bestiaire.Pirate.PirateBoss;
        const pking = Monster.makeMonster(Object.assign(p1, { pos: add.pos }));
        monsterCollection.monstersArray().push(pking);
        break;
      case 'sailor':
        let p2 = Bestiaire.Pirate.Sailor;
        const sailor = Monster.makeMonster(Object.assign(p2, { pos: add.pos }));
        monsterCollection.monstersArray().push(sailor);
        break;
      case 'crab':
        let crab = Bestiaire.Pirate.Crab;
        const _crab = Monster.makeMonster(Object.assign(crab, { pos: add.pos }));
        monsterCollection.monstersArray().push(_crab);
        break;
      case 'crabBoss':
        let crabBoss = Bestiaire.Pirate.CrabBoss;
        const _crabBoss = Monster.makeMonster(Object.assign(crabBoss, { pos: add.pos }));
        monsterCollection.monstersArray().push(_crabBoss);
        break;
      case 'BloodFountain':
      case 'HolyFountain':
      case 'PoisonPot':
      case 'CatAltar':
        places.addPlace({ pos: add.pos, kind: add.type });
        break;
      default:
        console.error('add this stuff not impl' + add.type);
        break;
    }
  }
}
