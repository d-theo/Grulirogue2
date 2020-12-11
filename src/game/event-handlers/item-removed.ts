import { EventHandler } from "./event-handler";
import { ItemCollection } from "../items/item-collection";
import { itemRemoved } from "../../events";

export class ItemRemovedHandler extends EventHandler {
    constructor(private items: ItemCollection) {
        super();
    }
    handle(event: ReturnType<typeof itemRemoved>) {
        const {item} = event.payload;
        this.items.removeItem(item);
    }
}