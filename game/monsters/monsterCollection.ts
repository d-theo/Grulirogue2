import {Monster} from './monster';
import { Coordinate, equalsCoordinate } from '../utils/coordinate';
import { Behavior } from './ai';

export class MonsterCollection {
    monsters: Monster[];
    behaviors: Map<string, Behavior>;
    constructor(behaviors: Map<string, Behavior>) {
        this.monsters = [
            new Monster({behavior: behaviors.get('random') as Behavior})
        ];
        this.behaviors = behaviors;
    }

    monstersArray() {
        return this.monsters;
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