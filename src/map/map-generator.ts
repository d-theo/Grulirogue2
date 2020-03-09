import { createTileMap } from "../generation/map_tiling";

import { addBiome } from "../generation/map_decoration";

/*export type MapParamCreation = {
    Area: 500, // min area of a room
    Fuzz: 0.25, // room size variation +-
    MinClusterSize: 5, // minimal cluster of room
    Width: 80,
    Height: 60,
    MinSubSize: 6, // subdivise into subcluster if cluster is bigger than MinSubSize
    canvasWidth: 100,
    canvasHeight: 100,
}*/
export type MapParamCreation = {
    Area: number, // min area of a room
    Fuzz:number, // room size variation +-
    MinClusterSize: number, // minimal cluster of room
    Width: number,
    Height: number,
    MinSubSize: number, // subdivise into subcluster if cluster is bigger than MinSubSize
    canvasWidth: number,
    canvasHeight: number,
    Terrain: any;
}
export function createMap(param: MapParamCreation) {
    const {tilemap, mapObject} = createTileMap(param);
    return {tilemap, mapObject};
}