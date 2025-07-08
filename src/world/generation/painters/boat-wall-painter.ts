import {lineTile} from '../map_tiling_utils';
import {pointsOfRect} from '../map-geo';
import {Terrain} from '../../map/terrain';

export function BoatWallPainter(room, tilemapBg, tilemap) {
  const points = pointsOfRect(room.rect);
  lineTile(points.A, points.B, tilemap, Terrain.Torch, (pos) => {
    return tilemapBg[pos.y][pos.x] === Terrain.PirateWallN && Math.random() <= 0.1;
  });

  lineTile(points.A, points.B, tilemap, Terrain.Buoy, (pos) => {
    return tilemapBg[pos.y][pos.x] === Terrain.PirateWallN && Math.random() <= 0.1;
  });

  lineTile(points.A, points.B, tilemap, Terrain.WallRope, (pos) => {
    return tilemapBg[pos.y][pos.x] === Terrain.PirateWallN && Math.random() <= 0.1;
  });

  if (points.A.y === 10 && points.B.y === 10) {
    lineTile(points.A, points.B, tilemap, Terrain.PirateWindow, (pos) => {
      return tilemapBg[pos.y][pos.x] === Terrain.PirateWallN && Math.random() <= 0.2;
    });
  }
}
