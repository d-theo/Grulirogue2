import {Monster} from './monster';
import { Coordinate } from '../utils/coordinate';

export class MonsterCollection {
    monsters: Monster[];

    constructor() {
        this.monsters = [new Monster()];
    }

    getAt(pos: Coordinate) {
        return this.monsters[0];
    }
}