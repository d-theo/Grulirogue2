import { Item } from '../entitybase/item';
import _ from 'lodash';
import { ItemVisitor } from '../entitybase/items/item-visitor';

export class Inventory {
  bag: Item[];
  equiped = new Set();
  constructor() {
    this.bag = [];
  }
  flagEquiped(item: Item) {
    this.equiped.add(item.id);
  }
  getItem(item: Item) {
    const i = this.bag.find((i) => i.id === item.id);
    return i;
  }
  flagUnEquiped(item: Item) {
    return this.equiped.delete(item.id);
  }
  add(item: Item) {
    item.pos = null;
    this.bag.push(item);
  }
  remove(item: Item) {
    this.bag = this.bag.filter((i) => i.id !== item.id);
  }
  openBag(filters?: string[]) {
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
            let found = acc.find((i: any) => {
              return i.item.name == val.item.name;
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
        .map((i: any) => ({
          ...i.item,
          name: i.item.name,
          description: i.item.description,
          count: i.count,
          equiped: this.equiped.has(i.item.id),
        }));
    }

    if (filters) {
      inventory.sections = inventory.sections.filter((s) => filters.indexOf(s) > -1);
    }
    return inventory;
  }
}
