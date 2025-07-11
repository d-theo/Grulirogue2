import { lineTile, propagate } from '../map_tiling_utils';
import { pointsOfRect } from '../map-geo';
import { Terrain } from '../../map/terrain.greece';

export function vegetalPainter(room, tilemapBg, tilemap) {
  const points = pointsOfRect(room.rect);
  const painted = lineTile(points.A, points.B, tilemap, Terrain.VegetalWall, (pos) => {
    return tilemapBg[pos.y][pos.x] === Terrain.WallN && Math.random() <= 0.25;
  });

  for (const p of painted) {
    propagate({ x: p.x, y: p.y + 1 }, tilemap, 1, 0.9, Terrain.VegetalFloor, (pos, factor) => {
      return (
        (tilemapBg[pos.y][pos.x] === Terrain.Floor || tilemapBg[pos.y][pos.x] === Terrain.DoorOpen) &&
        factor >= Math.random()
      );
    });
  }
}
