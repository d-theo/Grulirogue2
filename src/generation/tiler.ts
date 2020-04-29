import { MapGraph } from "./map_definition";
import { Terrain } from "../map/terrain.greece";
import { makeRoomTile, makeExit, lineTile, ThingToPlace } from "./map_tiling_utils";

export type TilerConfig = {
    width: number;
    height: number;
    painters: any[];
    terrain: any;
    boss: {chance: number, painter: Function};
    specialRoom: {chance: number, painter: Function};
    miniRoom: {chance: number, painter: Function};
}

export function tilemapper(config: TilerConfig) {
    const thingsToPlace: ThingToPlace[] = [];
    return (mapGraph: MapGraph) => {
        const tilemapBG = tile(mapGraph);
        const tilemapFG = tileLayers(mapGraph, tilemapBG);
        return {tilemapBG, tilemapFG, mapObject: mapGraph, thingsToPlace};
    }

    function tile(map: MapGraph) {
        const tilemap = Array(config.height).fill(Terrain.Void).map(()=>Array(config.width).fill(Terrain.Void));
        const rooms = map.rooms;
        for (var x = 0; x < rooms.length; x++) {
            makeRoomTile(rooms[x].rect, tilemap, config.terrain);
        }
        makeExit(rooms, tilemap, config.terrain.exit);

        const vertices = map.vertices;
        for (let vertex of vertices) {
            for (let line of vertex.segments) {
                lineTile(line.A, line.B, tilemap, config.terrain.floor);
            }
        }
        const doors = map.doors;
        for (let door of doors) {
            tilemap[door.position.y][door.position.x] = config.terrain.door;
        }
        return tilemap;
    }

    function tileLayers(map: MapGraph, tilemap1) {
        const rooms = map.rooms;
        const tilemap2 = Array(config.height).fill(Terrain.Void).map(()=>Array(config.width).fill(Terrain.Transparent));
        for (const r of rooms) {
            if (r.isExit) continue;
            if (map.bossRoom && r.roomId === map.bossRoom && config.boss.chance) {
                config.boss.painter(r, tilemap1, tilemap2, thingsToPlace);
                continue;
            }
            if (map.specialRoom && r.roomId === map.specialRoom && Math.random() > config.specialRoom.chance) {
                config.specialRoom.painter(r, tilemap1, tilemap2, thingsToPlace);
                continue;
            }
            if (map.miniRoom && r.roomId === map.miniRoom && config.miniRoom.chance) {
                config.miniRoom.painter(r, tilemap1, tilemap2, thingsToPlace);
                continue;
            }
            const rand = Math.random();
            for (let p of config.painters) {
                if (rand <= p.chance) {
                    p.painter(r, tilemap1, tilemap2);
                }
            }
        }
        return tilemap2;
    }
}