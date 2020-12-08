import { createEventDefinition } from "ts-bus";

export const sightHasChanged = createEventDefinition<{}>()('sightHasChanged');