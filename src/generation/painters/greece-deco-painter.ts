import { randomIn } from "../../game/utils/rectangle";
import { Terrain } from "../../map/terrain.greece";

export function greeceDeco(room, tilemapBg, tilemap) {

    const assign = (pos, type) => {
        if (tilemapBg[pos.y][pos.x] !== Terrain.Stair) {
            tilemap[pos.y][pos.x] = type;
        }
    }


    let pos = randomIn(room.rect, 1);
    tilemap[pos.y][pos.x] = Terrain.FloorAlt1

    pos = randomIn(room.rect, 1);
    tilemap[pos.y][pos.x] = Terrain.FloorAlt1

    pos = randomIn(room.rect, 1);
    tilemap[pos.y][pos.x] = Terrain.FloorAlt2

    pos = randomIn(room.rect, 1);
    tilemap[pos.y][pos.x] = Terrain.FloorAlt2

    pos = randomIn(room.rect, 1);
    tilemap[pos.y][pos.x] = Terrain.FloorAlt3

    pos = randomIn(room.rect, 1);
    tilemap[pos.y][pos.x] = Terrain.FloorAlt3

    // 
    if (Math.random() > 0.7) {
        const pos = randomIn(room.rect, 1);
        assign(pos, Terrain.Deco1);
    }
    if (Math.random() > 0.7) {
        const pos = randomIn(room.rect, 1);
        assign(pos, Terrain.Deco2);
    }
    if (Math.random() > 0.7) {
        const pos = randomIn(room.rect, 1);
        assign(pos, Terrain.Deco3);
    }
    if (Math.random() > 0.7) {
        const pos = randomIn(room.rect, 1);
        assign(pos, Terrain.Deco4);
    }
    if (Math.random() > 0.7) {
        const pos = randomIn(room.rect, 1);
        assign(pos, Terrain.Deco5);
    }
}