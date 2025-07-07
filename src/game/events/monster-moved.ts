import { createEventDefinition } from 'ts-bus';
import { Monster } from '../entitybase/monsters/monster';

export const monsterMoved = createEventDefinition<{
  monster: Monster;
}>()('monsterMove');
