import { distribute } from '../../utils/random';
import { randomIn } from '../../utils/rectangle';
import { Item } from '../entitybase/item';
import { isSpecialRoom } from './monster-spawn';
import { RogueEventLevel, spawnRogueEventItem } from './event-rogue';
import { MapGraph } from '../../world/generation/map_definition';
import { getRandomLoot } from '../../content/loot/loot-table';

export function itemSpawn(graph: MapGraph, level: number, nbLoot: number) {
  if (level == RogueEventLevel) {
    return spawnRogueEventItem(graph);
  }
  const rooms = graph.rooms;
  const zones = distribute(rooms.length - 1, nbLoot);
  const items: Item[] = [];
  for (let i = 0; i < rooms.length; i++) {
    const nb = zones[i];
    const room = rooms[i];
    if (isSpecialRoom(room, graph)) continue;
    let total = 0;
    while (total < nb) {
      let item: Item = getRandomLoot(level);
      const pos = randomIn(room.rect);
      item.pos = pos;
      items.push(item);
      total++;
    }
  }
  return items;
}
