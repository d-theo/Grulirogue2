import { Coordinate } from "./coordinate";
import { Entity } from "../entitybase/entity";

export function isTileEmpty(pos: Coordinate, movables: Entity[]):boolean {
    for (let m of movables) {
        if(m.pos.x === pos.x && m.pos.y === pos.y) {
            return false;
        }
    }
    return true;
}
