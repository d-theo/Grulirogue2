import * as _ from 'lodash';

export class GameRange {
    range: number[];
    // INCLUSIVE RANGE
    constructor(start: number, end: number) {
        if (start > end) {
            this.range = _.range(end, start+1, 1);    
        } else {
            this.range = _.range(start, end+1, 1);
        }
        console.log(start, end, _);
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