import { Action } from "./action";
import { Coordinate, isMovingOnlyOneCase } from "../utils/coordinate";
import { MessageResponseStatus, MessageResponse } from "../utils/types";
import { gameBus, playerMoved, itemPickedUp, doorOpened } from "../../eventBus/game-bus";
import { isTileEmpty } from "../utils/moveAllowed";
import { TileMap } from "../tilemap/tilemap";
import { Terrain } from "../../map/terrain.greece";
import { ItemCollection } from "../items/item-collection";

export class PlayerMoveAction extends Action {
    constructor(private args: {to: Coordinate}) {
        super();
    }
    execute() {
        const args = {
            monsters: this.game.monsters,
            pos: this.args.to,
            hero: this.game.hero,
            tilemap: this.game.tilemap,
            items: this.game.items,
            places: this.game.places
        };
        let res: MessageResponse;
        const {hero, pos, tilemap, monsters, items, places} = args;
        if (
            isTileEmpty(pos, monsters.monstersArray())
            && (this.game.tilemap.isWalkable(pos) || hasOpenedDoors(pos, tilemap))
            && isMovingOnlyOneCase(hero.pos, pos)
            && this.game.tilemap.isInsideMapBorder(pos)
        ) {
            hero.pos = pos;
            const maybeItem = itemOnGround(pos, items);
            if (maybeItem) {
                hero.addToBag(maybeItem);
                gameBus.publish(itemPickedUp({item: maybeItem}));
            }
            places.checkForHero(hero);
            res = {
                timeSpent: hero.speed,
                status: MessageResponseStatus.Ok,
            };
        } else {
            res = {
                timeSpent: 0,
                status: MessageResponseStatus.NotAllowed
            };
        }

        if (res.status === MessageResponseStatus.Ok) {
            gameBus.publish(playerMoved({}));
            this.game.nextTurn(res.timeSpent);
            this.game.adjustSight();
        }

        return res;
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