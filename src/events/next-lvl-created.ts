import { createEventDefinition } from "ts-bus";

export const nextLevelCreated = createEventDefinition<{
    level: number
}>()('nextLevelCreated');