import {Coordinate} from 'shared';
export class Entity {
    pos: Coordinate;
    constructor(x:number = 0, y:number=0) {
        this.pos = {x,y};
    }
}