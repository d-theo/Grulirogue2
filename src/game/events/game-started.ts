import { createEventDefinition } from 'ts-bus';

export const gameStarted = createEventDefinition<{}>()('gameStarted');
