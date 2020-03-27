import { distribute, pickInArray } from "../utils/random";
import { randomMobForLevel } from "./mob-table";
import { Monster } from "./monster";
import { randomIn } from "../utils/rectangle";

export function monstersSpawn(rooms: any[], level: number, dangerLevel: number) {
    const dangerZones = distribute(rooms.length-2, dangerLevel);
    const monsterInLevel: Monster[] = [];
    for (let i = 1; i < rooms.length; i++) {
        const danger = dangerZones[i-1];
        const room = rooms[i];
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