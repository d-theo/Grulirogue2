import {Terrain} from "../../../world/map/terrain.greece";
import * as greecePainters from "../painters/greece-map";

export const greeceTilerConfig = {
  width: 100,
  height: 100,
  terrain: {
    floor: Terrain.Floor,
    exit: Terrain.Stair,
    door: Terrain.DoorOpen,
    walln: Terrain.WallN,
    walls: Terrain.WallS,
    walle: Terrain.WallE,
    wallw: Terrain.WallW,
    wallne: Terrain.CornerNE,
    wallnw: Terrain.CornerNW,
    wallse: Terrain.CornerSE,
    wallsw: Terrain.CornerSW,
  },
  painters: [
    {painter: greecePainters.paintWater, chance: 0.15, exclusive: true},
    {painter: greecePainters.paintFloral, chance: 0.2, exclusive: true},
    {painter: greecePainters.paintStandard, chance: 1},
  ],
  boss: {chance: 0.3, painter: greecePainters.paintSnakeBoss},
  miniRoom: {chance: 0.3, painter: greecePainters.stash},
  specialRoom: {chance: 0.1, painter: greecePainters.specialRoom},
}