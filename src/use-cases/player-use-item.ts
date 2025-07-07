import { playerUseItem } from "../commands";
import { timePassed } from "../game/events";
import { Hero } from "../game/hero/hero";
import { SpecialPlaces } from "../game/places/special-places";
import { gameBus } from "../infra/events/game-bus";
import { CommandHandler } from "./commands";

export class PlayerUseItemHandler extends CommandHandler {
  constructor(private hero: Hero, private places: SpecialPlaces) {
    super();
  }

  handle(event: ReturnType<typeof playerUseItem>) {
    const { target, item, action } = event.payload;
    const usedItem = this.hero.getItem(item);
    if (usedItem !== undefined) {
      usedItem.keyMapping[action](target);
      this.hero.consumeItem(usedItem);
      this.places.checkForItem(usedItem);
    }
    gameBus.publish(timePassed({ timeSpent: 1 }));
  }
}
