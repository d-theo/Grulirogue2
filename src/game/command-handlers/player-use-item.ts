import { gameBus } from "../../eventBus/game-bus";
import { playerUseItem } from "../../commands";
import { CommandHandler } from "./commands";
import { Hero } from "../hero/hero";
import { timePassed } from "../../events";
import { SpecialPlaces } from "../places/special-places";

export class PlayerUseItemHandler extends CommandHandler {
    constructor(private hero: Hero, private places: SpecialPlaces) {
        super();
    }

    handle(event: ReturnType<typeof playerUseItem>) {
        const {target, item, action} = event.payload;
        const usedItem = this.hero.getItem(item);
        if (usedItem !== undefined) {
            usedItem.keyMapping[action](target);
            this.hero.consumeItem(usedItem);
            this.places.checkForItem(usedItem);
        }
        gameBus.publish(timePassed({timeSpent: 1}));
    }
}