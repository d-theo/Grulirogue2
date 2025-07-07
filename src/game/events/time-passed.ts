import { createEventDefinition } from "ts-bus";

export const timePassed = createEventDefinition<{
    timeSpent: number;
}>()('timePassed');