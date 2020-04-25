import { TileMap } from "../../tilemap/tilemap";
import { Coordinate } from "../../utils/coordinate";
import { Rect } from "../../utils/rectangle";
import { Entity } from "../../entitybase/entity";

export function isTileEmpty(pos: Coordinate, movables: Entity[]):boolean {
    for (let m of movables) {
        if(m.pos.x === pos.x && m.pos.y === pos.y) {
            return false;
        }
    }
    return true;
}
export function isSurroundingClear (pos: Coordinate, map: TileMap):boolean {
    return map.getAt(pos).isWalkable();
}
export function isMovingOnlyOneCase(a: Coordinate, b: Coordinate) :boolean{
    const xd = Math.abs(a.x - b.x);
    const xy = Math.abs(a.y - b.y);
    return ( (xd+xy) === 1);
}
export function isInsideMapBorder(pos: Coordinate, rect: Rect) {
    if (pos.x < rect.x) return false;
    if (pos.y < rect.y) return false;
    if (pos.x >= rect.width) return false;
    if (pos.y >= rect.height) return false;
    return true;
}