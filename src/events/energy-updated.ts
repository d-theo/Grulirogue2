import { createEventDefinition } from "ts-bus";


export const energyUpdated = createEventDefinition<{current: number, total: number}>()('energyUpdated');