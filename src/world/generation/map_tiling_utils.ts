import { PlaceKind } from '../../game/places/place-definitions';
import { Coordinate } from '../../utils/coordinate';
import { randomIn } from '../../utils/rectangle';
import { pointsOfRect } from './map-geo';
import * as _ from 'lodash';

export interface ThingToPlace {
  pos: Coordinate;
  type:
    | 'snakeBoss'
    | 'potion'
    | 'scroll'
    | 'item-good'
    | 'item'
    | 'monster'
    | 'pirateBoss'
    | 'sailor'
    | 'misc'
    | 'crabBoss'
    | 'crab'
    | PlaceKind;
}

export function lineTile(A, B, tilemap, type, atRate?: Function) {
  // 0-1
  const painted = [];
  var x0 = A.x,
    y0 = A.y,
    x1 = B.x,
    y1 = B.y;
  var dx = Math.abs(x1 - x0);
  var dy = Math.abs(y1 - y0);
  var sx = x0 < x1 ? 1 : -1;
  var sy = y0 < y1 ? 1 : -1;
  var err = dx - dy;

  while (true) {
    if (atRate && atRate({ x: x0, y: y0 })) {
      tilemap[y0][x0] = type;
      painted.push({ x: x0, y: y0 });
    }
    if (!atRate) {
      tilemap[y0][x0] = type;
      painted.push({ x: x0, y: y0 });
    }

    if (Math.abs(x0 - x1) < 0.0001 && Math.abs(y0 - y1) < 0.0001) break;
    var e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x0 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y0 += sy;
    }
  }
  return painted;
}
export function propagate(pos, tilemap, factor, propagationEntropy, biome, predicate, marked = {}) {
  if (marked[pos.x + ' ' + pos.y]) return;
  marked[pos.x + ' ' + pos.y] = true;
  if (predicate(pos, factor)) {
    tilemap[pos.y][pos.x] = biome;
    propagate(
      { x: pos.x + 1, y: pos.y + 1 },
      tilemap,
      factor * propagationEntropy,
      propagationEntropy,
      biome,
      predicate,
      marked
    );
    propagate(
      { x: pos.x + 1, y: pos.y },
      tilemap,
      factor * propagationEntropy,
      propagationEntropy,
      biome,
      predicate,
      marked
    );
    propagate(
      { x: pos.x + 1, y: pos.y - 1 },
      tilemap,
      factor * propagationEntropy,
      propagationEntropy,
      biome,
      predicate,
      marked
    );
    propagate(
      { x: pos.x - 1, y: pos.y + 1 },
      tilemap,
      factor * propagationEntropy,
      propagationEntropy,
      biome,
      predicate,
      marked
    );
    propagate(
      { x: pos.x - 1, y: pos.y },
      tilemap,
      factor * propagationEntropy,
      propagationEntropy,
      biome,
      predicate,
      marked
    );
    propagate(
      { x: pos.x - 1, y: pos.y - 1 },
      tilemap,
      factor * propagationEntropy,
      propagationEntropy,
      biome,
      predicate,
      marked
    );
    propagate(
      { x: pos.x, y: pos.y + 1 },
      tilemap,
      factor * propagationEntropy,
      propagationEntropy,
      biome,
      predicate,
      marked
    );
    propagate(
      { x: pos.x, y: pos.y - 1 },
      tilemap,
      factor * propagationEntropy,
      propagationEntropy,
      biome,
      predicate,
      marked
    );
  }
}
export function makeRoomTile(
  rect,
  tilemap,
  config: { floor; walln; walls; walle; wallw; wallne; wallnw; wallse; wallsw }
) {
  for (let x = rect.x; x < rect.x + rect.width; x++) {
    for (let y = rect.y; y < rect.y + rect.height; y++) {
      tilemap[y][x] = config.floor;
    }
  }
  const points = pointsOfRect(rect);
  lineTile(points.A, points.B, tilemap, config.walln);
  lineTile(points.C, points.B, tilemap, config.walle);
  lineTile(points.C, points.D, tilemap, config.walls);
  lineTile(points.A, points.D, tilemap, config.wallw);

  tilemap[points.A.y][points.A.x] = config.wallnw;
  tilemap[points.B.y][points.B.x] = config.wallne;
  tilemap[points.C.y][points.C.x] = config.wallse;
  tilemap[points.D.y][points.D.x] = config.wallsw;
}

export function makeExit(rooms, tilemap, exitSkin) {
  for (let room of rooms) {
    if (room.isExit) {
      const pos = randomIn(room.rect);
      tilemap[pos.y][pos.x] = exitSkin;
      return pos;
    }
  }
}
