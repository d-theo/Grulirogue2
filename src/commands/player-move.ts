import { createEventDefinition, EventBus } from "ts-bus";
import { Coordinate } from "../game/utils/coordinate";

export const playerActionMove = createEventDefinition<{
    to: Coordinate
}>()("playerActionMove");