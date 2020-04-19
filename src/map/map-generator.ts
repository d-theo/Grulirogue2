import { createTileMap, ThingToPlace } from "../generation/map_tiling";
import {MapGraph} from '../generation/map_definition';

export type MapParamCreation = {
    Area: number, // min area of a room
    Fuzz:number, // room size variation +-
    MinClusterSize: number, // minimal cluster of room
    Width: number,
    Height: number,
    MinSubSize: number, // subdivise into subcluster if cluster is bigger than MinSubSize
    canvasWidth: number,
    canvasHeight: number,
    Algo: string;
    Locks: boolean;
    LastLevel: boolean;
}
export function createMap(param: MapParamCreation): {thingsToPlace: ThingToPlace[], tilemap: number[][], tilemap2: number[][], mapObject: MapGraph} {
    const {tilemap, tilemap2, mapObject, thingsToPlace} = createTileMap(param);
    return {
        tilemap: tilemap,
        tilemap2: tilemap2,
        thingsToPlace: thingsToPlace,
        mapObject: (mapObject as any as MapGraph)};
}