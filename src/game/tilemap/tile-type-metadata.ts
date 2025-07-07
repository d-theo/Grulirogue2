import { Terrain } from '../../world/map/terrain.greece';

export function tilePropertiesForTerrain() {
  return {
    isSolid,
    isWalkable,
  };
  function isSolid(type: number) {
    return (
      [
        Terrain.CornerNW,
        Terrain.CornerNE,
        Terrain.CornerSE,
        Terrain.CornerSW,
        Terrain.DoorLocked,
        Terrain.DoorOpen,
        Terrain.Void,
        Terrain.WallW,
        Terrain.WallS,
        Terrain.WallE,
        Terrain.WallN,
        Terrain.PirateWallN,
        Terrain.PirateWallS,
        Terrain.PirateWallE,
        Terrain.PirateWallW,
        Terrain.WallRogue,
        Terrain.DoorRogue,
      ].indexOf(type) > -1
    );
  }
  function isWalkable(type: number) {
    if (isSolid(type)) return false;
    return (
      [
        Terrain.Deco,
        Terrain.Deco1,
        Terrain.Deco2,
        Terrain.Deco3,
        Terrain.Deco4[0],
        Terrain.Deco4[1],
        Terrain.Deco5,
        Terrain.FloorRope,
        Terrain.Barrel,
      ].indexOf(type) < 0
    );
  }
}
