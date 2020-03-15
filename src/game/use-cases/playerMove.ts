import { Game } from "../game";
import { isTileEmpty, isSurroundingClear, isMovingOnlyOneCase, isInsideMapBorder} from "./preconditions/moveAllowed";
import { MessageResponse, MessageResponseStatus } from "../utils/types";
import { MonsterCollection } from "../monsters/monsterCollection";
import { Hero } from "../hero/hero";
import { TileMap } from "../tilemap/tilemap";
import { Coordinate } from "../utils/coordinate";

export function playerMove(args: {
    pos: Coordinate,
    monsters: MonsterCollection, hero: Hero,
    tilemap: TileMap
}): MessageResponse {
    const {hero, pos, tilemap, monsters} = args;
    if (
        isTileEmpty(pos, monsters.monstersArray())
        && isSurroundingClear(pos, tilemap)
        && isMovingOnlyOneCase(hero.pos, pos)
        && isInsideMapBorder(pos, tilemap.getBorders())
    ) {
        hero.pos = pos;
        return {
            timeSpent: 1,
            status: MessageResponseStatus.Ok,
            events: [openDoors(), pickOnGround()]
        };
    } else {
        return {
            timeSpent: 0,
            status: MessageResponseStatus.NotAllowed
        };
    }
}

function openDoors(pos: Coordinate, tilemap: TileMap) {
    const tile = tilemap.getAt(pos);
    if (tilemap.terrain.DoorOpen === tile.type) {
        tile.type = tilemap.terrain.Floor;
    }
}