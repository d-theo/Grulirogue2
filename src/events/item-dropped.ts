import { createEventDefinition } from "ts-bus";
import { Item } from "../game/entitybase/item";

export const itemDropped = createEventDefinition<{
    item: Item;
}>()('itemDropped');