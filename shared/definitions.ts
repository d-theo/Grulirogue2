export interface Coordinate {
    x: number;
    y: number;
}
export enum TileVisibility {
    OnSight = 0,
    Hidden = 1,
    Far = 2,
}
export interface Tile {
    pos: Coordinate;
    spriteType: string;
    spriteStack: string;
    visibility: TileVisibility;
    items: any[];
    entity: any;
}