import { distribute, pickInArray } from "../utils/random";
import { randomIn } from "../utils/rectangle";
import { getRandomLoot } from "./loot-table";
import { Item } from "../entitybase/item";

export function itemSpawn(rooms: any[], level: number, nbLoot: number) {
    const zones = distribute(rooms.length-1, nbLoot);
    const items: Item[] = [];
    for (let i = 0; i < rooms.length; i++) {
        const nb = zones[i];
        const room = rooms[i];
        let total = 0;
        while(total < nb) {
            let item: Item = getRandomLoot(level);
            const pos = randomIn(room.rect);
            item.pos = pos;
            items.push(item);
            total ++;
        }
    }
    return items;
}