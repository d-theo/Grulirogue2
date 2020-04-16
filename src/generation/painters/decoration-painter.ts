import { lineTile } from "../map_tiling";
import { pointsOfRect } from "../map-geo";
import { Terrain } from "../../map/terrain";
import { randomIn } from "../../game/utils/rectangle";

export function decoPainter(room, tilemap, terrain: Terrain) {
    if (Math.random() > 0.7) {
        const pos = randomIn(room.rect, 1);
        tilemap[pos.y][pos.x] = terrain.Deco1
    }
    if (Math.random() > 0.7) {
        const pos = randomIn(room.rect, 1);
        tilemap[pos.y][pos.x] = terrain.Deco2
    }
    if (Math.random() > 0.7) {
        const pos = randomIn(room.rect, 1);
        tilemap[pos.y][pos.x] = terrain.Deco3
    }
    if (Math.random() > 0.7) {
        const pos = randomIn(room.rect, 1);
        tilemap[pos.y][pos.x] = terrain.Deco4
    }
    if (Math.random() > 0.7) {
        const pos = randomIn(room.rect, 1);
        tilemap[pos.y][pos.x] = terrain.Deco5
    }
}