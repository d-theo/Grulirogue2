import * as _ from 'lodash';

export class GameRange {
    range: number[];
    // INCLUSIVE RANGE
    constructor(start: number, end: number) {
        this.range = _.range(start, end+1, 1);
    }
    pick(): number {
        const r = _.sample(this.range);
        if (r === undefined) {
            throw new Error('range not found')
        } else {
            return r;
        }
    }
}