import { Item } from "../entitybase/item";
import { ItemVisitor } from "../items/item-visitor";
import _ from 'lodash';

export class Inventory {
    bag: Item[];
    gold: number = 0;
    size: number;
    equiped = new Set();
    constructor() {
        this.size = 12;
        this.bag = [];
    }
    flagEquiped(item: Item) {
        this.equiped.add(item.id);
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
    /*drop(item: Item) {
        this.bag = this.bag.filter(i => i !== item);
    }*/
    remove(item: Item) {
        this.bag = this.bag.filter(i => i.id !== item.id);
    }
    openBag() {
        const itemVisitor = new ItemVisitor();
        let inventory = _(this.bag)
            .map((item: Item) => item.visit(itemVisitor))
            .groupBy('kind')
            .value();
        
        const sections = Object.keys(inventory);
        inventory.sections = sections;
        for (let k of sections) {
            inventory[k] = inventory[k]
                .reduce((acc, val) => {
                    if (val.kind === 'Consumables') {
                        let found = acc.find((i:any) => {
                            return i.item.name == val.item.name
                        });
                        if (found) {
                            found.count++;
                        } else {
                            acc.push(val);
                        }
                    } else {
                        acc.push(val);
                    }
                    return acc;
                }, [])
                .map((i: any) => ({...i.item, count: i.count, equiped: this.equiped.has(i.item.id)}))
        }

        return inventory;
    }
}