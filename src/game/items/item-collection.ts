import { Item } from "../entitybase/item";
import { Coordinate, equalsCoordinate } from "../utils/coordinate";
import { Wand } from "./wands";

export class ItemCollection {
    private items: Item[] = [];

    setItems(items: Item[]) {
        this.items.forEach(i => i.pos = null);
        this.items = this.items.concat(items);
    }
    public removeItem(item: Item) {
        this.items = this.items.filter(i => {
            return i.id !== item.id
        });
    }
    itemsArray() {
        return this.items;
    }
    itemOnGround() {
        return this.items.filter(item => item.pos != null);
    }
    getItemById(id: string) {
        return this.items.find(i => id === i.id);
    }
    getAt(pos: Coordinate) {
        const item = this.items.find(i => i.pos && equalsCoordinate(i.pos, pos));
        if  (!item) {
            return null;
        } else {
            return item;
        }
    }
    update() {
        this.items.forEach(i => {
            if (i instanceof Wand) {
                i.update();
            }
        })
    }
}