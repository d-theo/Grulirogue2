import {TilerConfig} from "../../../world/generation/tiler";
import {Terrain} from "../../../world/map/terrain.greece";
import {crabRoom, miniRoom, paintStandard, paintWater, pirateBoss} from "../painters/pirate-map";

export const pirateTilerConfig: TilerConfig = {
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
    {painter: paintWater, chance: 0.1},
    {painter: paintStandard, chance: 1},
  ],
  boss: {chance: 0, painter: pirateBoss},
  miniRoom: {chance: 0.2, painter: miniRoom},
  specialRoom: {chance: 0, painter: crabRoom},
};