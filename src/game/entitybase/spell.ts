import {TileMap} from '../tilemap/tilemap';
import {Hero} from '../hero/hero';
import {MonsterCollection} from '../monsters/monsterCollection';
import { Coordinate } from '../utils/coordinate';

export class Spell {
    constructor(
        protected tilemap : TileMap,
        protected hero: Hero,
        protected monsters: MonsterCollection,
    ) {}

    protected monsterAt(pos: Coordinate) {
        return this.monsters.getAt(pos);
    }
    protected getMapWidth() {
        return this.tilemap.widthM1;
    }
    protected getMapHeight() {
        return this.tilemap.heightM1;
    }
    protected tileIsEmpty(pos: Coordinate) {
        return this.tilemap.getAt(pos).isEmpty();
    }
    protected getHero() {
        return this.hero;
    }
    protected tileAt(pos: Coordinate) {
        return this.tilemap.getAt(pos);
    }
    protected map() {
        return this.tilemap.tiles;
    }
}