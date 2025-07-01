import { distribute } from "../utils/random";
import { randomIn } from "../utils/rectangle";
import { Monster } from "../monsters/monster";
import { randomMobForLevel } from "../monsters/mob-table";
import { isRogueEventActive, rogueRandomMob } from "../../eventBus/event-rogue";
import { MapGraph } from "../../world/generation/map_definition";

export function monstersSpawn(mapGraph: MapGraph, level: number, dangerLevel: number) {
    const rooms = mapGraph.rooms;
    const dangerZones = distribute(rooms.length-1, dangerLevel);
    const monsterInLevel: Monster[] = [];
    for (let i = 0; i < rooms.length; i++) {
        const danger = dangerZones[i-1];
        const room = rooms[i];
        if (isSpecialRoom(room, mapGraph)) continue;
        let total = 0;
        while(total < danger) {
            let mob;
            if (isRogueEventActive) {
                mob = rogueRandomMob();
            } else {
                mob = randomMobForLevel(level);
            }
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
    if (room.isEntry) return true;
}