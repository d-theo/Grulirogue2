import { TileType } from './tileType';
import { Coordinate } from '../utils/coordinate';
export enum TileVisibility {
    OnSight = 0,
    Hidden = 1,
    Far = 2,
}

export class Tile {
    pos: Coordinate;
    visibility: TileVisibility;
    type: TileType;

    constructor(arg: {x: number, y: number, visibility?: TileVisibility, type?: TileType}) {
        this.pos = {x: arg.x, y: arg.y}
        this.visibility = arg.visibility || TileVisibility.Hidden;
        this.type = arg.type || TileType.BlockGrey;
    }
    isSolid() {
        switch(this.type) {
            case TileType.BlockGrey:
                return false;
            case TileType.DoorWood:
            case TileType.WallGrey:
                return true;
        }
    }
}