import {randomIn} from "../../../utils/rectangle";
import {propagate} from "../../../world/generation/map_tiling_utils";
import {Terrain} from "../../../world/map/terrain.greece";

export function vegetalPainter(room, tilemapBg, tilemap) {
  const po = randomIn(room.rect, 1);
  const points = [po, {x: po.x + 1, y: po.y + 1}, {x: po.x + 1, y: po.y}, {x: po.x, y: po.y + 1}];

  for (const p of points) {
    propagate({x: p.x, y: p.y + 1}, tilemap, 1, 0.7, Terrain.HerbRogue, (pos, factor) => {
      return tilemapBg[pos.y][pos.x] === Terrain.FloorRogue && factor >= Math.random();
    });
  }
}

export function waterPainter(room, tilemapBg, tilemap) {
  const po = randomIn(room.rect, 1);
  const points = [po, {x: po.x + 1, y: po.y + 1}, {x: po.x + 1, y: po.y}, {x: po.x, y: po.y + 1}];
  for (const p of points) {
    propagate({x: p.x, y: p.y + 1}, tilemap, 1, 0.85, Terrain.WaterRogue, (pos, factor) => {
      return tilemapBg[pos.y][pos.x] === Terrain.FloorRogue && factor >= Math.random();
    });
  }
}
