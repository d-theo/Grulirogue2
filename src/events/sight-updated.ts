import { createEventDefinition } from "ts-bus";

export const sightUpdated = createEventDefinition<{
}>()('sightUpdated');