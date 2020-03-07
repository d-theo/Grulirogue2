import { createTileMap } from "../generation/map_tiling";

import { addBiome } from "../generation/map_decoration";

import { Terrain } from "./terrain.constants";

export function createMap(param?) {
    const {tilemap, mapObject} = createTileMap();
    console.log(tilemap);
    addBiome(tilemap, Terrain.BlockWater);
    return {tilemap, mapObject};
}