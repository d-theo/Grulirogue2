import { Tile } from "./tile";

export class TileMap {
    tiles: Tile[][];
    width = 3;
    height = 3;
    constructor() {
        let tiles = [];
        let lines = [];
        for (let lineNb = 0; lineNb < this.height; lineNb++) {
            for (let colNb = 0; colNb < this.width; colNb++) {
                lines.push(new Tile({x:colNb, y:lineNb}));
            }
            tiles.push(lines);
            lines = [];
        }
        this.tiles = tiles;
    }
}