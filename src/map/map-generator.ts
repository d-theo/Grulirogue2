import { createTileMap } from "../generation/map_tiling";

import { addBiome } from "../generation/map_decoration";

import { Terrain } from "./terrain.constants";

export function createMap(param?) {
    const tilemap = createTileMap();
    addBiome(Terrain.BlockWater);
    return tilemap;
}