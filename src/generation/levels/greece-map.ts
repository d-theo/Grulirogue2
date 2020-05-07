import { TilerConfig, tilemapper } from "../tiler";
import { torchPainter } from "../painters/torch-painter";
import { greeceDeco } from "../painters/greece-deco-painter";
import { waterPainter } from "../painters/water-painter";
import { vegetalPainter } from "../painters/vegetal-painter";
import { snakeBossPainter } from "../painters/snakeboss-painter";
import { ThingToPlace } from "../map_tiling_utils";
import { randomIn } from "../../game/utils/rectangle";
import { Terrain } from "../../map/terrain.greece";
import * as _ from 'lodash';
import { MapGraph } from "../map_definition";
import { PlaceTypes } from "../../game/places/place-definitions";

const config: TilerConfig = {
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
        {painter: paintWater, chance: 0.10, exclusive: true},
        {painter: paintFloral, chance: 0.20, exclusive: true},
        {painter: paintStandard, chance: 1},
    ],
    boss: {chance: 0.3, painter: paintSnakeBoss},
    miniRoom: {chance: 0.3, painter: stash},
    specialRoom: {chance: 0.6, painter: specialRoom},
}

export function greeeceMap(mapGenerator: () => MapGraph, configOverride: {path: string, value: string}[]) {
    configOverride.forEach(override => _.set(config, override.path, override.value));
    const tiler = tilemapper(config);
    return tiler(mapGenerator());
}

/////////////// painters ////////////

function specialRoom(room, tilemap1, tilemap2, thingsToPlace: ThingToPlace[]) {
    console.log("sp");
    const pos = {x: Math.floor(room.rect.x + room.rect.width/2), y: Math.floor(room.rect.y + room.rect.height/2)};
    const placeType = _.sample(PlaceTypes);
    tilemap2[pos.y][pos.x] = Terrain[placeType];
    thingsToPlace.push({
        pos,
        type: placeType
    });
    /*
    const pos2 = {x: Math.floor(room.rect.x + room.rect.width/2)+1, y: Math.floor(room.rect.y + room.rect.height/2)};
    const placeType2 = _.sample(PlaceTypes);
    tilemap2[pos2.y][pos2.x] = Terrain[placeType2];
    thingsToPlace.push({
        pos:pos2,
        type: placeType2
    });
    const pos4 = {x: Math.floor(room.rect.x + room.rect.width/2)+2, y: Math.floor(room.rect.y + room.rect.height/2)};
    const placeType4 = _.sample(PlaceTypes);
    tilemap2[pos4.y][pos4.x] = Terrain[placeType4];
    thingsToPlace.push({
        pos:pos4,
        type: placeType4
    });
    const pos3 = {x: Math.floor(room.rect.x + room.rect.width/2)+3, y: Math.floor(room.rect.y + room.rect.height/2)};
    const placeType3 = _.sample(PlaceTypes);
    tilemap2[pos3.y][pos3.x] = Terrain[placeType3];
    thingsToPlace.push({
        pos:pos3,
        type: placeType3
    });*/
}
function paintStandard(room, tilemap1, tilemap2) {
    torchPainter(room, tilemap1, tilemap2);
    greeceDeco(room, tilemap1, tilemap2);
}
function paintWater(room, tilemap1, tilemap2) {
    waterPainter(room, tilemap1, tilemap2);
}
function paintFloral(room, tilemap1, tilemap2) {
    vegetalPainter(room, tilemap1, tilemap2);
}
function paintSnakeBoss(room, tilemap1, tilemap2, thingsToPlace: ThingToPlace[]) {
    torchPainter(room, tilemap1, tilemap2);
    snakeBossPainter(room, tilemap1, tilemap2);
    thingsToPlace.push({
        pos: {x: Math.floor(room.rect.x + room.rect.width/2), y: Math.floor(room.rect.y + room.rect.height/2)},
        type: 'snakeBoss'
    });
    thingsToPlace.push({
        pos: {x: Math.floor(room.rect.x + room.rect.width/2)+1, y: Math.floor(room.rect.y + room.rect.height/2)},
        type: 'item-good'
    });
}
function stash(r, tilemap1, tilemap2, thingsToPlace: ThingToPlace[]) {
    const c = r.rect.width * r.rect.height;
    for (let x = 0; x < Math.min(12, c); x++) {
        if (Math.random() > 0.5) {
            thingsToPlace.push({
                pos: randomIn(r.rect),
                type: 'monster'
            });
        } else {
            thingsToPlace.push({
                pos: randomIn(r.rect),
                type: 'potion'
            });
        }
    }
}