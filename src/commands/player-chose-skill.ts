import { createEventDefinition, EventBus } from 'ts-bus';

export const playerChoseSkill = createEventDefinition<{
  name: string;
}>()('playerChoseSkill');
