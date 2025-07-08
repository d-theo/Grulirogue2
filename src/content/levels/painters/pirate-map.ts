import {BoatWallPainter} from "../../../world/generation/painters/boat-wall-painter";
import {ThingToPlace} from "../../../world/generation/map_tiling_utils";
import {placePainter} from "../../../world/generation/painters/place-painter";
import {pirateDeco} from "../../../world/generation/painters/boat-deco-painter";
import {boatWaterPainter} from "../../../world/generation/painters/boat-water-painter";
import {randomIn} from "../../../utils/rectangle";
import {pirateBossPainter} from "../../../world/generation/painters/pirateboss-painter";

export function miniRoom(room, tilemap1, tilemap2, thingsToPlace: ThingToPlace[]) {
  placePainter(room, tilemap1, tilemap2, thingsToPlace);
}

export function paintStandard(room, tilemap1, tilemap2) {
  BoatWallPainter(room, tilemap1, tilemap2);
  pirateDeco(room, tilemap1, tilemap2);
}

export function paintWater(room, tilemap1, tilemap2) {
  boatWaterPainter(room, tilemap1, tilemap2);
}

export function crabRoom(room, tilemap1, tilemap2, thingsToPlace: ThingToPlace[]) {
  thingsToPlace.push({
    pos: {
      x: Math.floor(room.rect.x + room.rect.width / 2),
      y: Math.floor(room.rect.y + room.rect.height / 2),
    },
    type: 'crabBoss',
  });
  thingsToPlace.push({
    pos: randomIn(room.rect, 1),
    type: 'crab',
  });
  thingsToPlace.push({
    pos: randomIn(room.rect, 1),
    type: 'crab',
  });
  thingsToPlace.push({
    pos: randomIn(room.rect, 1),
    type: 'crab',
  });
  thingsToPlace.push({
    pos: randomIn(room.rect, 1),
    type: 'crab',
  });
  thingsToPlace.push({
    pos: randomIn(room.rect, 1),
    type: 'crab',
  });

  thingsToPlace.push({
    pos: {
      x: Math.floor(room.rect.x + room.rect.width / 2),
      y: Math.floor(room.rect.y + room.rect.height) - 1,
    },
    type: 'misc',
  });
  thingsToPlace.push({
    pos: {
      x: Math.floor(room.rect.x + room.rect.width / 2) - 1,
      y: Math.floor(room.rect.y + room.rect.height) - 1,
    },
    type: 'misc',
  });
  thingsToPlace.push({
    pos: {
      x: Math.floor(room.rect.x + room.rect.width / 2) + 1,
      y: Math.floor(room.rect.y + room.rect.height) - 1,
    },
    type: 'misc',
  });
}

export function pirateBoss(room, tilemap1, tilemap2, thingsToPlace: ThingToPlace[]) {
  pirateBossPainter(room, tilemap1, tilemap2);
  pirateDeco(room, tilemap1, tilemap2);
  boatWaterPainter(room, tilemap1, tilemap2);
  thingsToPlace.push({
    pos: {
      x: Math.floor(room.rect.x + room.rect.width / 2),
      y: Math.floor(room.rect.y + room.rect.height / 2),
    },
    type: 'pirateBoss',
  });
  thingsToPlace.push({
    pos: {
      x: Math.floor(room.rect.x + room.rect.width / 2) + 1,
      y: Math.floor(room.rect.y + room.rect.height / 2) + 1,
    },
    type: 'sailor',
  });
  thingsToPlace.push({
    pos: {
      x: Math.floor(room.rect.x + room.rect.width / 2) - 1,
      y: Math.floor(room.rect.y + room.rect.height / 2) - 1,
    },
    type: 'sailor',
  });
}
