import { createEventDefinition } from 'ts-bus';

export const playerMoved = createEventDefinition<{}>()('playerMove');
