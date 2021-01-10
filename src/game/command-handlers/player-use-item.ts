import { Misc } from './../loot/loot-mics';
import { gameBus } from "../../eventBus/game-bus";
import { playerUseItem } from "../../commands";
import { CommandHandler } from "./commands";
import { Hero } from "../hero/hero";
import { timePassed } from "../../events";
import { SpecialPlaces } from "../places/special-places";
import { EffectTarget } from '../effects/spells';

export class PlayerUseItemHandler extends CommandHandler {
    constructor(private hero: Hero, private places: SpecialPlaces) {
        super();
    }

    handle(event: ReturnType<typeof playerUseItem>) {
        const {target, item, action} = event.payload;
        const usedItem = this.hero.getItem(item);
        if (usedItem !== undefined) {
            usedItem.keyMapping[action](target);
            let isTrap = false;
            if (usedItem instanceof Misc && usedItem.effectTarget === EffectTarget.Trap) {
                isTrap = true;    
            }
            
            if (isTrap) {
                gameBus.publish(timePassed({timeSpent: 1}));
            }
            this.hero.consumeItem(usedItem);
            this.places.checkForItem(usedItem);

            if (!isTrap) {
                gameBus.publish(timePassed({timeSpent: 1}));
            }
        }
    }
}