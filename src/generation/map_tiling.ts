import { generateRLMap } from "./map_generation";
import { pointsOfRect } from "./map-geo";
import { MapParamCreation } from "../map/map-generator";
import { randomIn } from "../game/utils/rectangle";
import { generateOlMap } from "./map_generation_ol";
import { torchPainter } from "./painters/torch-painter";
import { greeceDeco } from "./painters/greece-deco-painter";
import * as _ from 'lodash';
import { Terrain } from "../map/terrain.greece";
import { vegetalPainter } from "./painters/vegetal-painter";
import { waterPainter } from "./painters/water-painter";

export function createTileMap(params: MapParamCreation) {
    let map;
    if (params.Algo === 'rogue') {
        map = generateRLMap(params);
    } else {
        map = generateOlMap(params);
    }
    
    const tilemap = tile(map, params);
    const tilemap2 = tileLayers(map.rooms, tilemap);
    return {tilemap, tilemap2, mapObject: map};
    
    function tile(map, params: MapParamCreation) {
        const tilemap = Array(params.canvasHeight).fill(Terrain.Void).map(()=>Array(params.canvasWidth).fill(Terrain.Void));
        const rooms = map.rooms;
        for (var x = 0; x < rooms.length; x++) {
            makeRoomTile(rooms[x].rect, tilemap);
        }
        makeExit(rooms, tilemap);

        const vertices = map.vertices;
        for (let vertex of vertices) {
            for (let line of vertex.segments) {
                lineTile(line.A, line.B, tilemap, Terrain.Floor);
            }
        }
        const doors = map.doors;
        for (let door of doors) {
            if (door.isLocked && params.Locks) {
                tilemap[door.position.y][door.position.x] = Terrain.DoorLocked;
            } else {
                tilemap[door.position.y][door.position.x] = Terrain.DoorOpen;
            }
        }
        return tilemap;
    }
    
    function makeRoomTile(rect, tilemap) {
        for (let x = rect.x; x < rect.x+rect.width; x++) {
            for (let y = rect.y; y < rect.y+rect.height; y++) {
                tilemap[y][x] = Terrain.Floor;
            }
        }
        const points = pointsOfRect(rect);
        lineTile(points.A, points.B, tilemap, Terrain.WallN);
        lineTile(points.C, points.B, tilemap, Terrain.WallE);
        lineTile(points.C, points.D, tilemap, Terrain.WallS);
        lineTile(points.A, points.D, tilemap, Terrain.WallW);

        tilemap[points.A.y][points.A.x] = Terrain.CornerNW;
        tilemap[points.B.y][points.B.x] = Terrain.CornerNE;
        tilemap[points.C.y][points.C.x] = Terrain.CornerSE;
        tilemap[points.D.y][points.D.x] = Terrain.CornerSW;
    }

     function makeExit(rooms, tilemap) {
        for (let room of rooms) {
            if (room.isExit) {
                const pos = randomIn(room.rect);
                tilemap[pos.y][pos.x] = Terrain.Stair;
            }
        }
    }

    function tileLayers(rooms, tilemap1) {
        const tilemap2 = Array(params.canvasHeight).fill(Terrain.Void).map(()=>Array(params.canvasWidth).fill(Terrain.Transparent));
        for (const r of rooms) {
            const rand = Math.random();
            if (rand >= 0.90) {
                paintFloral(r, tilemap1, tilemap2);
            } else if (rand >= .80) {
                paintWater(r, tilemap1, tilemap2);
            } else {
                paintStandard(r, tilemap1, tilemap2);
            }
        }
        return tilemap2;
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
}

export function lineTile(A, B, tilemap, type, atRate?: Function) { // 0-1
    const painted = [];
    var x0 = A.x, y0 = A.y, x1 = B.x, y1 = B.y;
    var dx = Math.abs(x1 - x0);
    var dy = Math.abs(y1 - y0);
    var sx = (x0 < x1) ? 1 : -1;
    var sy = (y0 < y1) ? 1 : -1;
    var err = dx - dy;
 
    while(true) {
        if (atRate && atRate({x: x0, y:y0})) {
            tilemap[y0][x0] = type;
            painted.push({x: x0, y: y0});
        }
        if (!atRate) {
            tilemap[y0][x0] = type;
            painted.push({x: x0, y: y0});
        }
       
       if (Math.abs(x0-x1) < 0.0001 && Math.abs(y0-y1) < 0.0001 ) break;
       var e2 = 2*err;
       if (e2 > -dy) { err -= dy; x0  += sx; }
       if (e2 < dx) { err += dx; y0  += sy; }
    }
    return painted;
 }
 export function propagate(pos, tilemap, factor, propagationEntropy, biome, predicate, marked = {}) {
    if (marked[pos.x+' '+pos.y]) return;
    marked[pos.x+' '+pos.y] = true;

    if (predicate(pos, factor)) {
        tilemap[pos.y][pos.x] = biome;
        propagate({x: pos.x+1, y: pos.y+1}, tilemap, factor*propagationEntropy, propagationEntropy, biome, predicate, marked);
        propagate({x: pos.x+1, y: pos.y}, tilemap, factor*propagationEntropy, propagationEntropy, biome, predicate, marked);
        propagate({x: pos.x+1, y: pos.y-1}, tilemap, factor*propagationEntropy, propagationEntropy, biome, predicate, marked);
        propagate({x: pos.x-1, y: pos.y+1}, tilemap, factor*propagationEntropy, propagationEntropy, biome, predicate, marked);
        propagate({x: pos.x-1, y: pos.y}, tilemap, factor*propagationEntropy, propagationEntropy, biome, predicate, marked);
        propagate({x: pos.x-1, y: pos.y-1}, tilemap, factor*propagationEntropy, propagationEntropy, biome, predicate, marked);
        propagate({x: pos.x, y: pos.y+1}, tilemap, factor*propagationEntropy, propagationEntropy, biome, predicate, marked);
        propagate({x: pos.x, y: pos.y-1}, tilemap, factor*propagationEntropy, propagationEntropy, biome, predicate, marked);
    }
}