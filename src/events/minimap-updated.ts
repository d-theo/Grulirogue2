import { createEventDefinition } from "ts-bus";

export const minimapUpdated = createEventDefinition<{
    minimap: string[][];
}>()('minimapUpdated');