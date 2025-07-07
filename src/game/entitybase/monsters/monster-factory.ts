import { Behavior, AIBehaviorsRegistry, BehaviorType } from '../../ia/ai';
import { Monster } from './monster';

export class MonsterFactory {
  constructor(private readonly AIBehaviorsRegistry: Map<BehaviorType, Behavior>) {}
  createMonster(args: any) {
    return Monster.makeMonster({
      ...args,
      AIBehaviorsRegistry: this.AIBehaviorsRegistry,
    });
  }
}
