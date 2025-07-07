import { createEventDefinition } from 'ts-bus';

export const rogueEvent = createEventDefinition<{}>()('rogueEvent');
