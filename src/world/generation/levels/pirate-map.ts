import { TilerConfig, tilemapper } from "../tiler";
import { Terrain } from "../../map/terrain.greece";
import * as _ from "lodash";
import { MapGraph } from "../map_definition";
import { BoatWallPainter } from "../painters/boat-wall-painter";
import { pirateDeco } from "../painters/boat-deco-painter";
import { boatWaterPainter } from "../painters/boat-water-painter";
import { ThingToPlace } from "../map_tiling_utils";
import { pirateBossPainter } from "../painters/pirateboss-painter";
import { placePainter } from "../painters/place-painter";
import { randomIn } from "../../../utils/rectangle";

const config: TilerConfig = {
  width: 100,
  height: 100,
  terrain: {
    floor: Terrain.PirateFloor,
    exit: Terrain.Stair,
    door: Terrain.DoorOpen,
    walln: Terrain.PirateWallN,
    walls: Terrain.PirateWallS,
    walle: Terrain.PirateWallE,
    wallw: Terrain.PirateWallW,
    wallne: Terrain.PirateWallW,
    wallnw: Terrain.PirateWallW,
    wallse: Terrain.PirateWallW,
    wallsw: Terrain.PirateWallW,
  },
  painters: [
    { painter: paintWater, chance: 0.1 },
    { painter: paintStandard, chance: 1 },
  ],
  boss: { chance: 0, painter: pirateBoss },
  miniRoom: { chance: 0.2, painter: miniRoom },
  specialRoom: { chance: 0, painter: crabRoom },
};

export function pirateMap(
  mapGenerator: () => MapGraph,
  configOverride: { path: string; value: string }[]
) {
  configOverride.forEach((override) =>
    _.set(config, override.path, override.value)
  );
  const tiler = tilemapper(config);
  return tiler(mapGenerator());
}

/////////////// painters //////////////

function miniRoom(room, tilemap1, tilemap2, thingsToPlace: ThingToPlace[]) {
  placePainter(room, tilemap1, tilemap2, thingsToPlace);
}

function paintStandard(room, tilemap1, tilemap2) {
  BoatWallPainter(room, tilemap1, tilemap2);
  pirateDeco(room, tilemap1, tilemap2);
}
function paintWater(room, tilemap1, tilemap2) {
  boatWaterPainter(room, tilemap1, tilemap2);
}
function crabRoom(room, tilemap1, tilemap2, thingsToPlace: ThingToPlace[]) {
  thingsToPlace.push({
    pos: {
      x: Math.floor(room.rect.x + room.rect.width / 2),
      y: Math.floor(room.rect.y + room.rect.height / 2),
    },
    type: "crabBoss",
  });
  thingsToPlace.push({
    pos: randomIn(room.rect, 1),
    type: "crab",
  });
  thingsToPlace.push({
    pos: randomIn(room.rect, 1),
    type: "crab",
  });
  thingsToPlace.push({
    pos: randomIn(room.rect, 1),
    type: "crab",
  });
  thingsToPlace.push({
    pos: randomIn(room.rect, 1),
    type: "crab",
  });
  thingsToPlace.push({
    pos: randomIn(room.rect, 1),
    type: "crab",
  });

  thingsToPlace.push({
    pos: {
      x: Math.floor(room.rect.x + room.rect.width / 2),
      y: Math.floor(room.rect.y + room.rect.height) - 1,
    },
    type: "misc",
  });
  thingsToPlace.push({
    pos: {
      x: Math.floor(room.rect.x + room.rect.width / 2) - 1,
      y: Math.floor(room.rect.y + room.rect.height) - 1,
    },
    type: "misc",
  });
  thingsToPlace.push({
    pos: {
      x: Math.floor(room.rect.x + room.rect.width / 2) + 1,
      y: Math.floor(room.rect.y + room.rect.height) - 1,
    },
    type: "misc",
  });
}
function pirateBoss(room, tilemap1, tilemap2, thingsToPlace: ThingToPlace[]) {
  pirateBossPainter(room, tilemap1, tilemap2);
  pirateDeco(room, tilemap1, tilemap2);
  boatWaterPainter(room, tilemap1, tilemap2);
  thingsToPlace.push({
    pos: {
      x: Math.floor(room.rect.x + room.rect.width / 2),
      y: Math.floor(room.rect.y + room.rect.height / 2),
    },
    type: "pirateBoss",
  });
  thingsToPlace.push({
    pos: {
      x: Math.floor(room.rect.x + room.rect.width / 2) + 1,
      y: Math.floor(room.rect.y + room.rect.height / 2) + 1,
    },
    type: "sailor",
  });
  thingsToPlace.push({
    pos: {
      x: Math.floor(room.rect.x + room.rect.width / 2) - 1,
      y: Math.floor(room.rect.y + room.rect.height / 2) - 1,
    },
    type: "sailor",
  });
}
