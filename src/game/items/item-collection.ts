import { Item } from "../entitybase/item";
import { Coordinate, equalsCoordinate } from "../utils/coordinate";

export class ItemCollection {
    items: Item[] = [];
    constructor() {
        
    }
    setItems(items: Item[]) {
        this.items = items;
    }
    itemsArray() {
        return this.items;
    }
    getAt(pos: Coordinate) {
        const item = this.items.find(i => i.pos && equalsCoordinate(i.pos, pos));
        if  (!item) {
            return null;
        } else {
            return item;
        }
    }
}