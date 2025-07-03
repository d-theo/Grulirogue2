import {CommandHandler} from "./commands";
import {playerActionMove} from "../../commands";
import {MessageResponse, MessageResponseStatus} from "../utils/types";
import {playerMove} from "../use-cases/playerMove";
import {gameBus} from "../../eventBus/game-bus";
import {playerMoved, timePassed} from "../../events";
import {Hero} from "../hero/hero";
import {TileMap} from "../tilemap/tilemap";
import {MonsterCollection} from "../monsters/monsterCollection";
import {ItemCollection} from "../items/item-collection";
import {SpecialPlaces} from "../places/special-places";
import {sightHasChanged} from "../../events/sight-has-changed";

export class PlayerActionMoveHandler extends CommandHandler {
  constructor(
    private hero: Hero,
    private tilemap: TileMap,
    private items: ItemCollection,
    private places: SpecialPlaces,
    private monsters: MonsterCollection,
  ) {
    super();
  }

  handle(event: ReturnType<typeof playerActionMove>) {
    const {to} = event.payload;
    const result: MessageResponse = playerMove({
      monsters: this.monsters,
      pos: to,
      hero: this.hero,
      tilemap: this.tilemap,
      items: this.items,
      places: this.places
    });
    if (result.status === MessageResponseStatus.Ok) {
      gameBus.publish(playerMoved({}));
      gameBus.publish(timePassed({timeSpent: result.timeSpent}))
      gameBus.publish(sightHasChanged({})); // TODO FIXME
    }
  }

}