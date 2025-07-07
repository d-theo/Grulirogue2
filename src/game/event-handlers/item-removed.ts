import { ItemCollection } from '../entitybase/items/item-collection';
import { itemRemoved } from '../events/item-removed';
import { EventHandler } from './event-handler';

export class ItemRemovedHandler extends EventHandler {
  constructor(private items: ItemCollection) {
    super();
  }
  handle(event: ReturnType<typeof itemRemoved>) {
    const { item } = event.payload;
    this.items.removeItem(item);
  }
}
