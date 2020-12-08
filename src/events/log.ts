import { createEventDefinition } from "ts-bus";

export const logPublished = createEventDefinition<{
    data: string;
    level?: 'warning'|'danger'|'neutral'|'success';
}>()('logPublished');