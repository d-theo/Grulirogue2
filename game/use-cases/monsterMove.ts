import { Game } from "../game";
import { isTileEmpty, isSurroundingClear, isMovingOnlyOneCase, isInsideMapBorder} from "./preconditions/moveAllowed";
import { MessageResponseStatus } from "../utils/types";
import { Monster } from "../monsters/monster";
import { Coordinate } from "../utils/coordinate";

export function monsterMove(args: {game: Game, monster: Monster, nextPos: Coordinate}) {
    const {game, monster, nextPos} = args;
    const pos = nextPos;
    if (
        isTileEmpty(pos, game.monsters.monstersArray())
        && isSurroundingClear(pos, game.tilemap)
        && isMovingOnlyOneCase(game.hero.pos, pos)
        && isInsideMapBorder(pos, game.tilemap.getBorders())
    ) {
        monster.pos = pos;
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