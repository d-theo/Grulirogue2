import { distribute, pickInArray } from "../utils/random";
import { randomMobForLevel } from "./mob-table";
import { Monster } from "./monster";
import { randomIn } from "../utils/rectangle";
import { MapGraph } from "../../generation/map_definition";

export function monstersSpawn(mapGraph: MapGraph, level: number, dangerLevel: number) {
    const rooms = mapGraph.rooms;
    const dangerZones = distribute(rooms.length-2, dangerLevel);
    const monsterInLevel: Monster[] = [];
    for (let i = 1; i < rooms.length; i++) {
        const danger = dangerZones[i-1];
        const room = rooms[i];
        if (isSpecialRoom(room, mapGraph)) continue;
        let total = 0;
        while(total < danger) {
            let mob = randomMobForLevel(level);
            mob.pos = randomIn(room.rect);
            const monsterSpawned: Monster = Monster.makeMonster(mob);
            monsterInLevel.push(monsterSpawned);
            total += mob.danger;
        }
    }
    return monsterInLevel;
}

export function isSpecialRoom(room: any, g: MapGraph) {
    if (g.specialRoom && g.specialRoom === room.roomId) return true;
    if (g.bossRoom && g.bossRoom === room.roomId) return true;
    if (g.miniRoom && g.miniRoom === room.roomId) return true;
}