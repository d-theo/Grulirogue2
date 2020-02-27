import {Monster} from './monster';
import { Coordinate } from '../utils/coordinate';

export class MonsterCollection {
    monsters: Monster[];

    constructor() {
        this.monsters = [new Monster({})];
    }

    monstersArray() {
        return this.monsters;
    }

    getAt(pos: Coordinate) {
        return this.monsters[0];
    }

    play() {
        for (const m of this.monsters) {
            m.play();
        }
    }
}