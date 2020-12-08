import { createEventDefinition } from "ts-bus";
import { Coordinate } from "../game/utils/coordinate";

export const doorOpened = createEventDefinition<{
    pos: Coordinate
}>()('doorOpened');