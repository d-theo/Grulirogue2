import { createEventDefinition } from "ts-bus";
import { Item } from "../entitybase/item";

export const itemDropped = createEventDefinition<{
  item: Item;
}>()("itemDropped");
