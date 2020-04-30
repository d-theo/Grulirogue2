import { TilerConfig, tilemapper } from "../tiler";
import { waterPainter } from "../painters/water-painter";
import { Terrain } from "../../map/terrain.greece";
import * as _ from 'lodash';
import { MapGraph } from "../map_definition";
import { BoatWallPainter } from "../painters/boat-wall-painter";
import { pirateDeco } from "../painters/boat-deco-painter";
import { boatWaterPainter } from "../painters/boat-water-painter";

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
        {painter: paintWater, chance: 0.10},
        {painter: paintStandard, chance: 1},
    ],
    boss: {chance: 1, painter: () => ({})},
    miniRoom: {chance: 1, painter: () => ({})},
    specialRoom: {chance: 1, painter: () => ({}) },
};

export function pirateMap(mapGenerator: () => MapGraph, configOverride: {path: string, value: string}[]) {
    configOverride.forEach(override => _.set(config, override.path, override.value));
    const tiler = tilemapper(config);
    return tiler(mapGenerator());
}

/////////////// painters //////////////

function paintStandard(room, tilemap1, tilemap2) {
    BoatWallPainter(room, tilemap1, tilemap2);
    pirateDeco(room, tilemap1, tilemap2);
}
function paintWater(room, tilemap1, tilemap2) {
    boatWaterPainter(room, tilemap1, tilemap2);
}