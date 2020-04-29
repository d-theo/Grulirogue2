import {MapGraph} from '../generation/map_definition';
import { greeeceMap } from "../generation/levels/greece-map";
import { ThingToPlace } from '../generation/map_tiling_utils';
import { generateRLMap } from '../generation/map-generators/map_generation_rogue';
import { generateOlMap } from '../generation/map-generators/map_generation_ol';

export function createMap(name: number): {thingsToPlace: ThingToPlace[], tilemap: number[][], tilemap2: number[][], mapObject: MapGraph} {
    let painterFn;
    let mapGeneratorFn;
    switch(name) {
        case 1:
            painterFn = greeeceMap;
            mapGeneratorFn = generateRLMap;
            break;
        case 2: 
            painterFn = greeeceMap;
            mapGeneratorFn = generateOlMap;
            break;
        case 3:
            painterFn = greeeceMap;
            mapGeneratorFn = generateRLMap;
            break;
    }
    const {tilemapBG, tilemapFG, mapObject, thingsToPlace} = painterFn(mapGeneratorFn, []);
    return {
        tilemap: tilemapBG,
        tilemap2: tilemapFG,
        thingsToPlace: thingsToPlace,
        mapObject: (mapObject as any as MapGraph)};
}