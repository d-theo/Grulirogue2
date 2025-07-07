import { playerActionMove } from "../commands";
import { ItemCollection } from "../game/entitybase/items/item-collection";
import { MonsterCollection } from "../game/entitybase/monsters/monsterCollection";
import { playerMoved, timePassed } from "../game/events";
import { Hero } from "../game/hero/hero";
import { SpecialPlaces } from "../game/places/special-places";
import { TileMap } from "../game/tilemap/tilemap";
import { playerMove } from "../game/use-cases/playerMove";
import { gameBus } from "../infra/events/game-bus";
import { MessageResponse, MessageResponseStatus } from "../utils/types";
import { CommandHandler } from "./commands";

export class PlayerActionMoveHandler extends CommandHandler {
  constructor(
    private hero: Hero,
    private tilemap: TileMap,
    private items: ItemCollection,
    private places: SpecialPlaces,
    private monsters: MonsterCollection
  ) {
    super();
  }

  handle(event: ReturnType<typeof playerActionMove>) {
    const { to } = event.payload;
    const result: MessageResponse = playerMove({
      monsters: this.monsters,
      pos: to,
      hero: this.hero,
      tilemap: this.tilemap,
      items: this.items,
      places: this.places,
    });
    if (result.status === MessageResponseStatus.Ok) {
      gameBus.publish(playerMoved({}));
      gameBus.publish(timePassed({ timeSpent: result.timeSpent }));
    }
  }
}
