import {Monster} from './monster';
import { Coordinate, equalsCoordinate } from '../utils/coordinate';

export class MonsterCollection {
    monsters: Monster[] = [];

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
    removeMonster(monster: Monster) {
        this.monsters = this.monsters.filter(m => m.id !== monster.id);
    }
    update() {
        this.monsters.forEach(m => m.update());
        this.play();
    }
    play() {
        for (const m of this.monsters) {
            if (!m.isStun) {
                for(let i = 0; i < m.speed; i++) {
                    m.play();
                }
            }
        }
    }
}