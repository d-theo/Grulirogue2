import { createEventDefinition, EventBus } from "ts-bus";

export const nextLevel = createEventDefinition<{}>()('nextLevel');