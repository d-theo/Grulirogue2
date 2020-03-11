import { Coordinate } from '../utils/coordinate';
export enum TileVisibility {
    Unknown = -1,
    OnSight = 0,
    Hidden = 1,
    Far = 2,
}

export class Tile {
    pos: Coordinate;
    visibility: TileVisibility;
    type: number;
    viewed = false;
    isSolidFct: (n:number) => boolean;
    isWalkableFct: (n:number) => boolean;;
    constructor(arg: {x: number, y: number, visibility?: TileVisibility, type?: number, isSolidFct: (n:number) => boolean, isWalkableFct: (n:number) => boolean}) {
        this.pos = {x: arg.x, y: arg.y}
        this.visibility = arg.visibility || TileVisibility.Hidden;
        this.type = arg.type || -1;
        this.isSolidFct = arg.isSolidFct;
        this.isWalkableFct = arg.isWalkableFct;
    }

    isSolid() {
        return this.isSolidFct(this.type);
    }
    isWalkable() {
        return this.isWalkableFct(this.type);
    }
    isEmpty() {
        return this.isWalkableFct(this.type);
    }
    setObscurity() {
        if (this.viewed) {
            this.visibility = TileVisibility.Far;
        } else {
            this.visibility = TileVisibility.Hidden;
        }
    }
    setOnSight() {
        this.visibility = TileVisibility.OnSight;
        this.viewed = true;
    }
}