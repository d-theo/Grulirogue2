import {MapGraph} from '../generation/map_definition';
import { greeeceMap } from "../generation/levels/greece-map";
import { ThingToPlace } from '../generation/map_tiling_utils';
import { generateRLMap } from '../generation/map-generators/map_generation_rogue';
import { generateOlMap } from '../generation/map-generators/map_generation_ol';
import { pirateMap } from '../generation/levels/pirate-map';
import { generatePirateMap } from '../generation/map-generators/map_generation_pirate1';
import { generatePirateMap2 } from '../generation/map-generators/map_generation_pirate2';

export function createMap(name: number): {thingsToPlace: ThingToPlace[], tilemap: number[][], tilemap2: number[][], mapObject: MapGraph} {
    let painterFn;
    let mapGeneratorFn;
    let overrides = [];
    switch(name) {
        case 1:
            /*painterFn = greeeceMap;
            mapGeneratorFn = generateRLMap;*/
            painterFn = pirateMap;
            mapGeneratorFn = generatePirateMap2;
            overrides = [{path: 'boss.chance', value: 1}, {path: 'specialRoom.chance', value: 1}];
            break;
        case 2: 
            painterFn = greeeceMap;
            mapGeneratorFn = generateOlMap;
            break;
        case 3:
            painterFn = greeeceMap;
            mapGeneratorFn = generateRLMap;
            break;
        case 4:
            painterFn = pirateMap;
            mapGeneratorFn = generatePirateMap;
            overrides = [{path: 'specialRoom.chance', value: 0.5}];
            break;
        case 5:
            painterFn = pirateMap;
            mapGeneratorFn = generatePirateMap2;
            overrides = [{path: 'boss.chance', value: 1}];
            break;
        case 6:
            painterFn = pirateMap;
            mapGeneratorFn = generatePirateMap;
            break;
    }
    const {tilemapBG, tilemapFG, mapObject, thingsToPlace} = painterFn(mapGeneratorFn, overrides);
    return {
        tilemap: tilemapBG,
        tilemap2: tilemapFG,
        thingsToPlace: thingsToPlace,
        mapObject: (mapObject as any as MapGraph)};
}