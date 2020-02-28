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
        return this.monsters.getAt(pos)
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