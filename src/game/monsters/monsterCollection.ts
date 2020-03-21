import {Monster} from './monster';
import { Coordinate, equalsCoordinate } from '../utils/coordinate';
import { Behavior } from './ai';
import { monstersSpawn } from './monster-spawn';

export class MonsterCollection {
    monsters: Monster[] = [];
    constructor() {}

    monstersArray() {
        return this.monsters;
    }

    setMonsters(monsters: Monster[]) {
        this.monsters = monsters;
    }

    getAt(pos: Coordinate) {
        const m = this.monsters.find(m => equalsCoordinate(m.pos, pos));
        if  (!m) {
            return null;
        } else {
            return m;
        }
    }

    play() {
        for (const m of this.monsters) {
            m.play();
        }
    }
}