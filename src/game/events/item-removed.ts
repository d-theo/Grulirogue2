import { createEventDefinition } from "ts-bus";
import { Item } from "../entitybase/item";

export const itemRemoved = createEventDefinition<{
  item: Item;
}>()("itemRemoved");
