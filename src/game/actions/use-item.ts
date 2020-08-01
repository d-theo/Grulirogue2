import { Action } from "./action";
import { Item } from "../entitybase/item";
import { Monster } from "../monsters/monster";
import { Hero } from "../hero/hero";
import { Coordinate } from "../utils/coordinate";

export class UseItemAction extends Action {
    constructor(private args: {
        item: Item,
        target: Monster | Hero | Coordinate | Item,
        action: string,
    }) {
        super();
    }
    execute() {
        const usedItem = this.game.hero.getItem(this.args.item);
        if (usedItem !== undefined) {
            usedItem.keyMapping[this.args.action](this.args.target);
            this.game.hero.consumeItem(usedItem);
            this.game.places.checkForItem(usedItem);
        }
        this.game.nextTurn(1);
    }
}