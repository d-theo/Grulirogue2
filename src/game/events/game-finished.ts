import { createEventDefinition } from 'ts-bus';

export const gameFinished = createEventDefinition<{}>()('gameFinished');
