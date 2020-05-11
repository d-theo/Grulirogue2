import { TilerConfig, tilemapper } from "../tiler";
import { Terrain } from "../../map/terrain.greece";
import * as _ from 'lodash';
import { MapGraph } from "../map_definition";
import { propagate } from "../map_tiling_utils";
import { randomIn } from "../../game/utils/rectangle";

const config: TilerConfig = {
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
    specialRoom: {chance: 0, painter: () => ({}) },
};

export function rogueMap(mapGenerator: () => MapGraph, configOverride: {path: string, value: string}[]) {
    configOverride.forEach(override => _.set(config, override.path, override.value));
    const tiler = tilemapper(config);
    return tiler(mapGenerator());
}

function vegetalPainter(room, tilemapBg, tilemap) {
    const po = randomIn(room.rect, 1);
    const points = [
        po,
        {x:po.x+1, y: po.y+1},
        {x:po.x+1, y: po.y},
        {x:po.x, y: po.y+1},
    ]

    for (const p of points) {
        propagate({x: p.x, y: p.y+1}, tilemap, 1, 0.7, Terrain.HerbRogue, (pos, factor) => {
            return (tilemapBg[pos.y][pos.x] === Terrain.FloorRogue) && factor >= Math.random();
        });
    }
}
function waterPainter(room, tilemapBg, tilemap) {
    const po = randomIn(room.rect, 1);
    const points = [
        po,
        {x:po.x+1, y: po.y+1},
        {x:po.x+1, y: po.y},
        {x:po.x, y: po.y+1},
    ]
    for (const p of points) {
        propagate({x: p.x, y: p.y+1}, tilemap, 1, 0.85, Terrain.WaterRogue, (pos, factor) => {
            return (tilemapBg[pos.y][pos.x] === Terrain.FloorRogue) && factor >= Math.random();
        });
    }
}