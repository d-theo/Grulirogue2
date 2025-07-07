import { Item } from '../entitybase/item';
import { Hero } from '../hero/hero';
import { gameBus } from '../../infra/events/game-bus';
import { Coordinate, equalsCoordinate } from '../../utils/coordinate';
import { Place } from './place-interface';
import { PlaceKind } from './place-definitions';
import { BloodFountain, HolyFountain, PoisonPot, CatAltar } from './places';
import { ItemCollection } from '../entitybase/items/item-collection';
import { Monster } from '../entitybase/monsters/monster';
import { MonsterCollection } from '../entitybase/monsters/monsterCollection';
import { itemDropped, monsterSpawned } from '../events';
import { MonsterFactory } from '../entitybase/monsters/monster-factory';

export class SpecialPlaces {
  places: Place[] = [];
  constructor(
    private items: ItemCollection,
    private monsters: MonsterCollection,
    private readonly monsterFactory: MonsterFactory
  ) {}
  checkForItem(item: Item) {
    this.places.forEach((p) => {
      const pos = item.pos ? item.pos : { x: -1, y: -1 };
      if (equalsCoordinate(p.pos, pos)) {
        const r = p.checkForItem(item);
        if (r != null && r instanceof Item) {
          this.items.itemsArray().push(r);
          gameBus.publish(itemDropped({ item: r }));
        }
        if (r != null && r instanceof Monster) {
          this.monsters.monstersArray().push(r);
          gameBus.publish(monsterSpawned({ monster: r }));
        }
      }
    });
  }
  checkForHero(hero: Hero) {
    this.places.forEach((p) => {
      if (equalsCoordinate(p.pos, hero.pos)) {
        p.checkForHero(hero);
      }
    });
  }
  addPlace(arg: { pos: Coordinate; kind: PlaceKind }) {
    switch (arg.kind) {
      case 'BloodFountain':
        return this.places.push(new BloodFountain(arg.pos));
      case 'HolyFountain':
        return this.places.push(new HolyFountain(arg.pos));
      case 'PoisonPot':
        return this.places.push(new PoisonPot(arg.pos));
      case 'CatAltar':
        return this.places.push(new CatAltar(arg.pos, this.monsterFactory));
      default:
        throw new Error('not implemented' + arg.kind);
    }
  }
  getAt(pos: Coordinate) {
    return this.places.find((place) => equalsCoordinate(place.pos, pos));
  }
  clear() {
    this.places = [];
  }
}
