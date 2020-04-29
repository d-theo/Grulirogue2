import { lineTile } from "../map_tiling_utils";
import { pointsOfRect } from "../map-geo";
import { Terrain } from "../../map/terrain.greece";

export function torchPainter(room, tilemapBg, tilemap) {
    const points = pointsOfRect(room.rect);
    lineTile(points.A, points.B, tilemap, Terrain.Torch, (pos) => {
        return (tilemapBg[pos.y][pos.x] === Terrain.WallN && Math.random() <= 0.25)
    });

    lineTile(points.A, points.B, tilemap, Terrain.WallRift, (pos) => {
        return (tilemapBg[pos.y][pos.x] === Terrain.WallN && Math.random() <= 0.3)
    });
}