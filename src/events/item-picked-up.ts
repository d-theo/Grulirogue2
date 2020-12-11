import { createEventDefinition } from "ts-bus";
import { Item } from "../game/entitybase/item";

export const itemPickedUp = createEventDefinition<{
    item: Item;
}>()('itemPickedUp');