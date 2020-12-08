import { createEventDefinition, EventBus } from "ts-bus";


export const waitATurn = createEventDefinition<{}>()('waitATurn');