import { createEventDefinition } from 'ts-bus';
import { Monster } from '../entitybase/monsters/monster';

export const monsterSpawned = createEventDefinition<{
  monster: Monster;
}>()('monsterSpawned');
