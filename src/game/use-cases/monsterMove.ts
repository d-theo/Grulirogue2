import {Game} from "../game";
import {isTileEmpty, isSurroundingClear, isMovingOnlyOneCase, isInsideMapBorder} from "./preconditions/moveAllowed";
import {MessageResponseStatus} from "../utils/types";
import {Monster} from "../monsters/monster";
import {Coordinate} from "../utils/coordinate";
import {gameBus} from "../../eventBus/game-bus";
import {monsterMoved} from "../../events";

export function monsterMove(args: { game: Game, monster: Monster, nextPos: Coordinate }) {
  const {game, monster, nextPos} = args;
  const pos = nextPos;
  if (
    isTileEmpty(pos, game.monsters.monstersArray())
    && isSurroundingClear(pos, game.tilemap)
    && isInsideMapBorder(pos, game.tilemap.getBorders())
  ) {
    game.tilemap.getAt(monster.pos).on('left', monster);
    monster.pos = pos;
    game.tilemap.getAt(monster.pos).on('walked', monster);
    gameBus.publish(monsterMoved({monster: monster}));

    return {
      timeSpent: 1,
      status: MessageResponseStatus.Ok,
    };
  } else {
    return {
      timeSpent: 0,
      status: MessageResponseStatus.NotAllowed
    };
  }
}