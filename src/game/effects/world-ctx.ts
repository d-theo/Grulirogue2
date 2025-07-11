import { TileMap } from '../tilemap/tilemap';
import { Hero } from '../hero/hero';
import { Coordinate, around, equalsCoordinate } from '../../utils/coordinate';
import { SpecialPlaces } from '../places/special-places';
import { Game } from '../game';
import { Monster } from '../entitybase/monsters/monster';
import { MonsterCollection } from '../entitybase/monsters/monsterCollection';

export class World {
  constructor(
    protected tilemap: TileMap,
    protected hero: Hero,
    protected monsters: MonsterCollection,
    protected places: SpecialPlaces,
    protected game: Game
  ) {}

  monsterAt(pos: Coordinate) {
    return this.monsters.getAt(pos);
  }

  getMapWidth() {
    return this.tilemap.widthM1;
  }

  getMapHeight() {
    return this.tilemap.heightM1;
  }

  tileIsEmpty(pos: Coordinate) {
    return this.tilemap.getAt(pos).isEmpty();
  }

  nearestEmptyTileFrom(pos: Coordinate) {
    let i = 1;
    let found = false;
    while (!found) {
      const positions = around(pos, i);
      for (const p of positions) {
        const isEmpty = this.tilemap.getAt(p).isEmpty();
        const noEnemy = this.monsters.getAt(p) === null;
        if (isEmpty && noEnemy && !equalsCoordinate(pos, p)) {
          return p;
        }
      }
      i++;
    }
  }

  addMonster(m: Monster) {
    this.monsters.monstersArray().push(m);
  }

  getHero() {
    return this.hero;
  }

  getPlaces() {
    return this.places;
  }

  tileAt(pos: Coordinate) {
    return this.tilemap.getAt(pos);
  }

  map() {
    return this.tilemap.tiles;
  }

  getTilemap() {
    return this.tilemap;
  }

  getNearestAttackables() {
    return this.game.getNearestAttackables();
  }

  getMonsterFactory() {
    return this.game.monsterFactory;
  }
}
