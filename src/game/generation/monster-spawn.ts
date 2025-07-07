import { distribute } from '../../utils/random';
import { randomIn } from '../../utils/rectangle';
import { RogueEventVars, rogueRandomMob } from './event-rogue';
import { MapGraph } from '../../world/generation/map_definition';
import { randomMobForLevel } from '../../content/monsters/mob-table';
import { Monster } from '../entitybase/monsters/monster';
import { MonsterFactory } from '../entitybase/monsters/monster-factory';

export function monstersSpawn(monsterFactory: MonsterFactory, mapGraph: MapGraph, level: number, dangerLevel: number) {
  const rooms = mapGraph.rooms;
  const dangerZones = distribute(rooms.length - 1, dangerLevel);
  const monsterInLevel: Monster[] = [];
  for (let i = 0; i < rooms.length; i++) {
    const danger = dangerZones[i - 1];
    const room = rooms[i];
    if (isSpecialRoom(room, mapGraph)) continue;
    let total = 0;
    while (total < danger) {
      let mob;
      if (RogueEventVars.isRogueEventActive) {
        mob = rogueRandomMob();
      } else {
        mob = randomMobForLevel(level);
      }
      mob.pos = randomIn(room.rect);
      monsterInLevel.push(monsterFactory.createMonster(mob));
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
