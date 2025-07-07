import { createEventDefinition } from 'ts-bus';

export const effectUnset = createEventDefinition<{
  id: string;
}>()('effectUnset');
