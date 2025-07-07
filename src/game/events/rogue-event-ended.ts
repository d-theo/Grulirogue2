import { createEventDefinition } from 'ts-bus';

export const endRogueEvent = createEventDefinition<{}>()('endRogueEvent');
