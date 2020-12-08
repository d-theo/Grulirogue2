import { createEventDefinition } from "ts-bus";
import { Item } from "../game/entitybase/item";

export const itemRemoved = createEventDefinition<{
    item: Item;
}>()('itemRemoved');