import { createEventDefinition } from "ts-bus";

export const gameOver = createEventDefinition<{}>()('gameOver');