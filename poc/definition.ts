interface Coordinate {
    x: number;
    y: number;
}
enum TileVisibility {
    OnSight = 0,
    Hidden = 1,
    Far = 2,
}
interface Tile {
    pos: Coordinate;
    spriteType: string;
    spriteStack: string;
    visibility: TileVisibility;
    items: any[];
    entity: any;
}