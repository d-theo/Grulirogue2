export interface Terrain {
    Void: number,
    DoorOpen: number,
    DoorLocked: number,
    CornerSE:number,
    CornerNW:number,
    CornerNE:number,
    CornerSW:number,
    WallN: number,
    WallS: number,
    WallE: number,
    WallW: number,
    Floor: number,
    Deco: number,
    Stair: number;
    Button: number;
    [k: string]: any;
}