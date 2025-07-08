import {snakeBossPainter} from "../../../world/generation/painters/snakeboss-painter";
import {ThingToPlace} from "../../../world/generation/map_tiling_utils";
import {placePainter} from "../../../world/generation/painters/place-painter";
import {torchPainter} from "../../../world/generation/painters/torch-painter";
import {greeceDeco} from "../../../world/generation/painters/greece-deco-painter";
import {waterPainter} from "../../../world/generation/painters/water-painter";
import {vegetalPainter} from "../../../world/generation/painters/vegetal-painter";
import {randomIn} from "../../../utils/rectangle";

export function specialRoom(room, tilemap1, tilemap2, thingsToPlace: ThingToPlace[]) {
  placePainter(room, tilemap1, tilemap2, thingsToPlace);
}

export function paintStandard(room, tilemap1, tilemap2) {
  torchPainter(room, tilemap1, tilemap2);
  greeceDeco(room, tilemap1, tilemap2);
}

export function paintWater(room, tilemap1, tilemap2) {
  waterPainter(room, tilemap1, tilemap2);
}

export function paintFloral(room, tilemap1, tilemap2) {
  vegetalPainter(room, tilemap1, tilemap2);
}

export function paintSnakeBoss(room, tilemap1, tilemap2, thingsToPlace: ThingToPlace[]) {
  torchPainter(room, tilemap1, tilemap2);
  snakeBossPainter(room, tilemap1, tilemap2);
  thingsToPlace.push({
    pos: {
      x: Math.floor(room.rect.x + room.rect.width / 2),
      y: Math.floor(room.rect.y + room.rect.height / 2),
    },
    type: 'snakeBoss',
  });
  thingsToPlace.push({
    pos: {
      x: Math.floor(room.rect.x + room.rect.width / 2) + 1,
      y: Math.floor(room.rect.y + room.rect.height / 2),
    },
    type: 'item-good',
  });
}

export function stash(r, tilemap1, tilemap2, thingsToPlace: ThingToPlace[]) {
  const c = r.rect.width * r.rect.height;
  for (let x = 0; x < Math.min(12, c); x++) {
    if (Math.random() > 0.5) {
      thingsToPlace.push({
        pos: randomIn(r.rect),
        type: 'monster',
      });
    } else {
      thingsToPlace.push({
        pos: randomIn(r.rect),
        type: 'potion',
      });
    }
  }
}
