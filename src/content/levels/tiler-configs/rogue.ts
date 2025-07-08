import {Terrain} from "../../../world/map/terrain.greece";
import {vegetalPainter, waterPainter} from "../painters/rogue-map";

export const rogueTilerConfig = {
  width: 100,
  height: 100,
  terrain: {
    floor: Terrain.FloorRogue,
    exit: Terrain.FloorRogue,
    door: Terrain.DoorRogue,
    walln: Terrain.WallRogue,
    walls: Terrain.WallRogue,
    walle: Terrain.WallRogue,
    wallw: Terrain.WallRogue,
    wallne: Terrain.WallRogue,
    wallnw: Terrain.WallRogue,
    wallse: Terrain.WallRogue,
    wallsw: Terrain.WallRogue,
  },
  painters: [
    {painter: waterPainter, chance: 0.2, exclusive: true},
    {painter: vegetalPainter, chance: 0.2, exclusive: true},
  ],
  boss: {chance: 0, painter: () => ({})},
  miniRoom: {chance: 0, painter: () => ({})},
  specialRoom: {chance: 0, painter: () => ({})},
}