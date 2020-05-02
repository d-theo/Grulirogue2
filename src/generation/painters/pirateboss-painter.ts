import { makeRoomTile, lineTile } from "../map_tiling_utils";
import { Terrain } from "../../map/terrain.greece";
import { pointsOfRect } from "../map-geo";
import { randomIn } from "../../game/utils/rectangle";

export function pirateBossPainter(room, tilemapBg, tilemap) {
    const points = pointsOfRect(room.rect);
    lineTile(points.A, points.B, tilemap, Terrain.Torch, (pos) => {
        return (tilemapBg[pos.y][pos.x] === Terrain.PirateWallBossN && Math.random() <= 0.1)
    });

    lineTile(points.A, points.B, tilemap, Terrain.Buoy, (pos) => {
        return (tilemapBg[pos.y][pos.x] === Terrain.PirateWallBossN && Math.random() <= 0.1)
    });

    lineTile(points.A, points.B, tilemap, Terrain.WallRope, (pos) => {
        return (tilemapBg[pos.y][pos.x] === Terrain.PirateWallBossN && Math.random() <= 0.1)
    });

    if (points.A.y === 10 && points.B.y === 10) {
        lineTile(points.A, points.B, tilemap, Terrain.PirateWindow, (pos) => {
            return (tilemapBg[pos.y][pos.x] === Terrain.PirateWallBossN && Math.random() <= 0.2)
        });
    }

    for (let i = 0; i < 10; i++) {
        const pos = randomIn(room.rect, 1);
        tilemap[pos.y][pos.x] =  Terrain.FloorRope;
    }
}