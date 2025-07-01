import { propagate } from "../map_tiling_utils";
import { Terrain } from "../../map/terrain.greece";
import { randomIn } from "../../../game/utils/rectangle";

export function boatWaterPainter(room, tilemapBg, tilemap) {
    const points = [randomIn(room.rect, 1), randomIn(room.rect, 1)]

    for (const p of points) {
        propagate({x: p.x, y: p.y+1}, tilemap, 1, 0.6, Terrain.WaterFloor, (pos, factor) => {
            return (tilemapBg[pos.y][pos.x] === Terrain.PirateFloor) && factor >= Math.random();
        });
    }
}