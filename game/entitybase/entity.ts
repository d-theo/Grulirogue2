import { Coordinate } from "../utils/coordinate";

export class Entity {
    pos: Coordinate;
    constructor(x:number = 0, y:number=0) {
        this.pos = {x,y};
    }
}