import { generateRLMap } from "./map_generation";
import { pointsOfRect } from "./map-geo";
import { MapParamCreation } from "../map/map-generator";
import {Terrain} from '../map/terrain';
import { randomIn } from "../game/utils/rectangle";
import { generateOlMap } from "./map_generation_ol";
import { torchPainter } from "./painters/torch-painter";
import { decoPainter } from "./painters/decoration-painter";
import { greeceDeco } from "./painters/greece-deco-painter";

export function createTileMap(params: MapParamCreation) {
    const MapTerrain: Terrain = params.Terrain;
    let map;
    if (params.Algo === 'rogue') {
        map = generateRLMap(params);
    } else {
        map = generateOlMap(params);
    }
    
    const tilemap = tile(map, params);
    return {tilemap, mapObject: map};
    
    function tile(map, params: MapParamCreation) {
        const tilemap = Array(params.canvasHeight).fill(MapTerrain.Void).map(()=>Array(params.canvasWidth).fill(MapTerrain.Void));
        const rooms = map.rooms;
        for (var x = 0; x < rooms.length; x++) {
            makeRoomTile(rooms[x].rect, tilemap);
        }
        makeExit(rooms, tilemap);

        const vertices = map.vertices;
        for (let vertex of vertices) {
            for (let line of vertex.segments) {
                lineTile(line.A, line.B, tilemap, MapTerrain.Floor);
            }
        }
        const doors = map.doors;
        for (let door of doors) {
            if (door.isLocked && params.Locks) {
                tilemap[door.position.y][door.position.x] = MapTerrain.DoorLocked;
            } else {
                tilemap[door.position.y][door.position.x] = MapTerrain.DoorOpen;
            }
        }
        return tilemap;
    }
    
    function makeRoomTile(rect, tilemap) {
        for (let x = rect.x; x < rect.x+rect.width; x++) {
            for (let y = rect.y; y < rect.y+rect.height; y++) {
                tilemap[y][x] = MapTerrain.Floor;
            }
        }
        const points = pointsOfRect(rect);
        lineTile(points.A, points.B, tilemap, MapTerrain.WallN);
        lineTile(points.C, points.B, tilemap, MapTerrain.WallE);
        lineTile(points.C, points.D, tilemap, MapTerrain.WallS);
        lineTile(points.A, points.D, tilemap, MapTerrain.WallW);

        tilemap[points.A.y][points.A.x] = MapTerrain.CornerNW;
        tilemap[points.B.y][points.B.x] = MapTerrain.CornerNE;
        tilemap[points.C.y][points.C.x] = MapTerrain.CornerSE;
        tilemap[points.D.y][points.D.x] = MapTerrain.CornerSW;
    }

     function makeExit(rooms, tilemap) {
        for (let room of rooms) {
            if (room.isExit) {
                const pos = randomIn(room.rect);
                tilemap[pos.y][pos.x] = MapTerrain.Stair;
            }
        }
    }

    function tileLayers(rooms, terrain: Terrain) {
        const tilemap2 = Array(params.canvasHeight).fill(MapTerrain.Void).map(()=>Array(params.canvasWidth).fill(MapTerrain.Void));
        const tilemap3 = Array(params.canvasHeight).fill(MapTerrain.Void).map(()=>Array(params.canvasWidth).fill(MapTerrain.Void));
        for (const r of rooms) {
            const rand = Math.random();
            if (rand >= 0.90) {
                paintStandard(r, tilemap2, tilemap3, terrain);
            } else if (rand >= 0.80) {
                paintWater(r, tilemap2, tilemap3, terrain);
            } else {
                paintFloral(r, tilemap2, tilemap3, terrain);
            }
        }
    }

    function paintStandard(room, tilemap2, tilemap3, terrain) {
        torchPainter(room, tilemap2, terrain);
        decoPainter(room, tilemap3, terrain);
        greeceDeco(room, tilemap2, terrain);
    }
    function paintWater(room, tilemap2, tilemap3, terrain) {

    }
    function paintFloral(room, tilemap2, tilemap3, terrain) {

    }
}

export function lineTile(A, B, tilemap, type, atRate?: number) { // 0-1
    var x0 = A.x, y0 = A.y, x1 = B.x, y1 = B.y;
    var dx = Math.abs(x1 - x0);
    var dy = Math.abs(y1 - y0);
    var sx = (x0 < x1) ? 1 : -1;
    var sy = (y0 < y1) ? 1 : -1;
    var err = dx - dy;
 
    while(true) {
        if (atRate && Math.random() <= atRate ) {
            tilemap[y0][x0] = type;
        }
        if (!atRate) {
            tilemap[y0][x0] = type;
        }
       
       if (Math.abs(x0-x1) < 0.0001 && Math.abs(y0-y1) < 0.0001 ) break;
       var e2 = 2*err;
       if (e2 > -dy) { err -= dy; x0  += sx; }
       if (e2 < dx) { err += dx; y0  += sy; }
    }
 }