import { createEventDefinition } from "ts-bus";

export const enchantChanged = createEventDefinition<{
    report: string
}>()('enchantChanged');