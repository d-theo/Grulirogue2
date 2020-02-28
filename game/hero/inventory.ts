import { Item } from "../entitybase/item";

export class Inventory {
    bag: Item[];
    gold: number = 0;
    size: number;
    constructor() {
        this.size = 12;
        this.bag = [];
    }
    addGold(n: number) {
        this.gold += n;
    }
    payOrThrow(n: number) {
        if (n > this.gold) {
            throw new Error('Not enough gold');
        } else {
            this.gold -= n;
        }
    }
    add(item: Item) {
        item.pos = null;
        this.bag.push(item);
    }
    drop(item: Item) {
        this.bag = this.bag.filter(i => i !== item);
    }
}