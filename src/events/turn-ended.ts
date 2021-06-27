import { createEventDefinition } from "ts-bus";

export const turnEnded = createEventDefinition<{
    minimap: string[][];
}>()('turnEnded');