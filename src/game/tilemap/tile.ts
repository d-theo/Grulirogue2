import { Coordinate } from '../utils/coordinate';
import { BuffDefinition } from '../effects/effect';
export enum TileVisibility {
    Unknown = -1,
    OnSight = 0,
    Hidden = 1,
    Far = 2,
}

export class Tile {
    pos: Coordinate;
    visibility: TileVisibility;
    type: number[];
    viewed = false;
    isSolidFct: (n:number) => boolean;
    isWalkableFct: (n:number) => boolean;
    isEntry = false;
    isExit = false;
    private debuffs: {id: string, debuff: BuffDefinition}[] = [];
    constructor(arg: {x: number, y: number, visibility?: TileVisibility, type?: number, isSolidFct: (n:number) => boolean, isWalkableFct: (n:number) => boolean}) {
        this.pos = {x: arg.x, y: arg.y}
        this.visibility = arg.visibility || TileVisibility.Hidden;
        this.type = [];
        this.isSolidFct = arg.isSolidFct;
        this.isWalkableFct = arg.isWalkableFct;
    }
    isType(tileType: number) {
        return this.type.some(t => t === tileType);
    }
    isSolid() {
        return this.type.some(t => this.isSolidFct(t));
    }
    isWalkable() {
        return this.type.every(t => this.isWalkableFct(t));
    }
    isEmpty() {
        return this.type.every(t => this.isWalkableFct(t));
    }
    isOpenDoor() {
        return 
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
    addDebuff(d: {id: string, debuff: BuffDefinition}) {
        this.debuffs.push(d);
    }
    removeDebuff(id: string) {
        this.debuffs = this.debuffs.filter(d => d.id !== id);
    }
    getDebuffs(): {id: string, debuff: BuffDefinition}[] {
        return this.debuffs;
    }
}