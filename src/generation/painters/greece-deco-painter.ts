import { lineTile } from "../map_tiling";
import { pointsOfRect } from "../map-geo";
import { Terrain } from "../../map/terrain";
import { randomIn } from "../../game/utils/rectangle";

export function greeceDeco(room, tilemap, terrain: Terrain) {
    let pos = randomIn(room.rect, 1);
    tilemap[pos.y][pos.x] = terrain.FloorAlt1

    pos = randomIn(room.rect, 1);
    tilemap[pos.y][pos.x] = terrain.FloorAlt1

    pos = randomIn(room.rect, 1);
    tilemap[pos.y][pos.x] = terrain.FloorAlt2

    pos = randomIn(room.rect, 1);
    tilemap[pos.y][pos.x] = terrain.FloorAlt2

    pos = randomIn(room.rect, 1);
    tilemap[pos.y][pos.x] = terrain.FloorAlt3

    pos = randomIn(room.rect, 1);
    tilemap[pos.y][pos.x] = terrain.FloorAlt3
}