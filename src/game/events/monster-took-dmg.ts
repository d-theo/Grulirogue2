import { createEventDefinition } from 'ts-bus';
import { Monster } from '../entitybase/monsters/monster';

export const monsterTookDamage = createEventDefinition<{
  monster: Monster;
  amount: number;
  baseHp: number;
  currentHp: number;
  externalSource?: any;
}>()('monsterTookDamage');
