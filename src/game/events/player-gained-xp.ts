import { createEventDefinition } from "ts-bus";

export const xpHasChanged = createEventDefinition<{
    current: number;
    total: number;
    status: 'xp_gained' | 'level_up'
}>()('xpHasChanged');