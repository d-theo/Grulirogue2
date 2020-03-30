import {Bestiaire} from './bestiaire';
import { pickInRange } from '../utils/random';

export const MobTable: XTable[] = [
    [{chance: 90, type: Bestiaire.Greece.Snake}, {chance: 10, type: Bestiaire.Greece.Boar}],
    [{chance: 80, type: Bestiaire.Greece.Snake}, {chance: 20, type: Bestiaire.Greece.Boar}],
    [{chance: 50, type: Bestiaire.Greece.Snake}, {chance: 40, type: Bestiaire.Greece.Boar}, {chance: 10, type: Bestiaire.Greece.Centaurus}],
]

export function randomMobForLevel(level: number) {
    return getInTable(mobsForLevel(level));
}

export function mobsForLevel(level: number) {
    return MobTable[level-1];
}

export type XTable = {
    chance: number,
    type: any
}[];

export function getInTable(table: XTable): any {
    const weightSum = table.reduce((acc,val) => val.chance+acc, 0);
    let r = pickInRange(1,weightSum);
    for (const item of table) {
        r -= item.chance;
        if (r <= 0) {
            return item.type;
        }
    }
}