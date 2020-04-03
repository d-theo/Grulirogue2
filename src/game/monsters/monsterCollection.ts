import {Monster} from './monster';
import { Coordinate, equalsCoordinate } from '../utils/coordinate';
import { Behavior } from './ai';
import { monstersSpawn } from './monster-spawn';
import { gameBus, monsterDead } from '../../eventBus/game-bus';

export class MonsterCollection {
    monsters: Monster[] = [];
    constructor() {
        gameBus.subscribe(monsterDead, event => {
            const {monster} = event.payload;
            this.monsters = this.monsters.filter(m => m.id !== monster.id);
        });
    }

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

    resolveBuffs() {
        for (const m of this.monsters) {
            m.buffs.apply(m);
        }
    }
    play() {
        for (const m of this.monsters) {
            if (!m.enchants.stuned)
                m.play();
        }
    }
}