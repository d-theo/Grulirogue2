const perlin = require('perlin-noise');

export type BiomeOption = {
    spawnChanceFactor?: number,
    propagationFactor?: number,
    propagationEntropyFactor?: number,
    onTerrainType?: number
}

export function addBiome(tilemap, terrain, options:BiomeOption) {
    const biome = {terrainType: terrain, positions: []};
    const terrainSpawnChance = options.spawnChanceFactor || 0.8;
    const propagation = options.propagationFactor || 0.5;
    const propagationEntropy = options.propagationEntropyFactor || 0.5;
    const mapTerrain = options.onTerrainType || 1;

    const marked = {};
    const toExpand = [];
    const p = perlin.generatePerlinNoise(tilemap.length, tilemap[0].length);
    let x = 0;
    for (let i = 0; i < tilemap.length; i++) {
        for (let j = 0; j < tilemap[0].length; j++) {
            if (tilemap[i][j] === mapTerrain && p[x] > terrainSpawnChance) {
                biome.positions.push({x: i, y: j});
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

        if ((tilemap[c.x][c.y] === mapTerrain || tilemap[c.x][c.y] === terrain) && factor > Math.random()) {
            biome.positions.push({x:c.x, y:c.y});
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
    return biome;
}