import * as _ from 'lodash';


export function randomProc(num: number) {
    return _.random(0, 100) < num ;
}
export function distribute(length: number, value: number): number[] {
    if (length <= 1)
        return [value];
    const half = Math.floor(length / 2),
        fuzz = Math.floor(value/4),
        dist = Math.floor(Math.random() * (value-fuzz))+fuzz;
    return distribute(half, dist).concat(distribute(length-half, value-dist));
}
export function pickInRange(arg1: string): number;
export function pickInRange(arg1: number, arg2: number): number;
export function pickInRange(arg1: string|number, arg2?: number): number {
    if (typeof arg1 === 'number' && typeof arg2 === 'number') {
        return _.random(arg1, arg2);
    } else if (typeof arg1 === 'number' && arg2 == null) {
        return _.random(0, arg1);
    } else if (typeof arg1 === 'string') {
        const args = arg1.split('-').map(x => parseInt(x));
        return _.random(args[0], args[1]);
    } else {
        throw new Error(`invalid input for random ${arg1} ${arg2}`);
    }
}
export function pickInArray<T>(array: T[]): T {
    const idx = pickInRange(0, array.length-1);
    return array[idx];
}