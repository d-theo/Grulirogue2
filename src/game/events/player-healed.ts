import { createEventDefinition } from "ts-bus";

export const playerHealed = createEventDefinition<{
    baseHp: number,
    currentHp: number,
    isSilent?: boolean,
}>()("playerHealed");