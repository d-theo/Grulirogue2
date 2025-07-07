import { createEventDefinition } from 'ts-bus';
import { Item } from '../entitybase/item';

export const itemPickedUp = createEventDefinition<{
  item: Item;
}>()('itemPickedUp');
