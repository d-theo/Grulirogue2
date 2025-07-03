import {isTileEmpty, isSurroundingClear, isMovingOnlyOneCase, isInsideMapBorder} from "./preconditions/moveAllowed";
import {MessageResponse, MessageResponseStatus} from "../utils/types";
import {MonsterCollection} from "../monsters/monsterCollection";
import {Hero} from "../hero/hero";
import {TileMap} from "../tilemap/tilemap";
import {Coordinate} from "../utils/coordinate";
import {gameBus} from "../../eventBus/game-bus";
import {ItemCollection} from "../items/item-collection";
import {SpecialPlaces} from "../places/special-places";
import {doorOpened} from "../../events";
import {Terrain} from "../../world/map/terrain.greece";

export function playerMove(args: {
  pos: Coordinate,
  monsters: MonsterCollection, hero: Hero,
  tilemap: TileMap,
  items: ItemCollection,
  places: SpecialPlaces
}): MessageResponse {
  const {hero, pos, tilemap, monsters, items, places} = args;
  if (
    isTileEmpty(pos, monsters.monstersArray())
    && (isSurroundingClear(pos, tilemap) || hasOpenedDoors(pos, tilemap))
    && isMovingOnlyOneCase(hero.pos, pos)
    && isInsideMapBorder(pos, tilemap.getBorders())
  ) {

    tilemap.getAt(hero.pos).on('left', hero);
    hero.pos = pos;
    tilemap.getAt(pos).on('walked', hero);
    const maybeItem = itemOnGround(pos, items);
    if (maybeItem) {
      hero.addToBag(maybeItem);
    }
    places.checkForHero(hero);

    return {
      timeSpent: hero.speed,
      status: MessageResponseStatus.Ok,
    };
  } else {
    return {
      timeSpent: 0,
      status: MessageResponseStatus.NotAllowed
    };
  }
}

function hasOpenedDoors(pos: Coordinate, tilemap: TileMap) {
  const tile = tilemap.getAt(pos);
  if (tile.isType(Terrain.DoorOpen) || tile.isType(Terrain.DoorRogue)) {
    tile.type[0] = Terrain.DoorOpened; // fixme should be floor + doorOpen on top
    gameBus.publish(doorOpened({pos}));
    return true;
  }
  return false;
}

function itemOnGround(pos: Coordinate, items: ItemCollection) {
  return items.getAt(pos);
}