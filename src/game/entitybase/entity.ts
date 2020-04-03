import { Coordinate } from "../utils/coordinate";
import {Movable} from './movable';

export class Entity implements Movable {
    pos: Coordinate;
    sight: number;
    constructor(x:number = 0, y:number=0) {
        this.pos = {x,y};
        this.sight = 6;
    }
}