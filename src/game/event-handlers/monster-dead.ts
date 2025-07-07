import { MonsterCollection } from '../entitybase/monsters/monsterCollection';
import { monsterDead } from '../events';
import { EventHandler } from './event-handler';

export class MonsterDeadHandler extends EventHandler {
  constructor(private monsters: MonsterCollection) {
    super();
  }
  handle(event: ReturnType<typeof monsterDead>) {
    const { monster } = event.payload;
    this.monsters.removeMonster(monster);
  }
}
