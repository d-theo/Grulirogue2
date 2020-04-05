import {Terrain} from '../../map/terrain';

export function tilePropertiesForTerrain(t: Terrain) {
    return {
        isSolid,
        isWalkable
    }
    function isSolid(type: number) {
        return [
            t.CornerNW,
            t.CornerNE,
            t.CornerSE,
            t.CornerSW,
            t.DoorLocked,
            t.DoorOpen,
            t.Void,
            t.WallW,
            t.WallS,
            t.WallE,
            t.WallN,
        ].indexOf(type) > -1;
    }
    function isWalkable(type: number) {
        return [
            t.Floor,
            t.DoorOpen,
            t.DoorOpened,
            t.DoorLocked,
            t.Stair,
        ].indexOf(type) > -1;
    }
}
