const perlin = require('perlin-noise');
import {Terrain} from '../map/terrain.constants';

export function addBiome(terrain) {
    const terrainSpawnChance = 0.8;
    const propagation = 0.5;
    const propagationEntropy = 0.5;
    const marked = {};
    const toExpand = [];
    const p = perlin.generatePerlinNoise(tilemap.length, tilemap[0].length);
    let x = 0;
    for (let i = 0; i < tilemap.length; i++) {
        for (let j = 0; j < tilemap[0].length; j++) {
            if (tilemap[i][j] === Terrain.BlockGrey && p[x] > terrainSpawnChance) {
                tilemap[i][j] = terrain;
                toExpand.push({x:i, y:j});
            }
            x++;
        }
    }
    for (let c of toExpand) {
        propagate(c, propagation);
    }

    function propagate(c, factor) {
        if (marked[c.x+' '+c.y]) return;
        marked[c.x+' '+c.y] = true;

        if ((tilemap[c.x][c.y] === Terrain.BlockGrey || tilemap[c.x][c.y] === terrain) && factor > Math.random()) {
            tilemap[c.x][c.y] = terrain;
            propagate({x: c.x+1, y: c.y+1}, factor*propagationEntropy);
            propagate({x: c.x+1, y: c.y}, factor*propagationEntropy);
            propagate({x: c.x+1, y: c.y-1}, factor*propagationEntropy);
            propagate({x: c.x-1, y: c.y+1}, factor*propagationEntropy);
            propagate({x: c.x-1, y: c.y1}, factor*propagationEntropy);
            propagate({x: c.x-1, y: c.y-1}, factor*propagationEntropy);
            propagate({x: c.x, y: c.y+1}, factor*propagationEntropy);
            propagate({x: c.x, y: c.y-1}, factor*propagationEntropy);
        }
    }
}