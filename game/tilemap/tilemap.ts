import { Tile } from "./tile";
import { Rect } from "../utils/rectangle";
import { Coordinate } from "../utils/coordinate";
import { TileType } from "./tileType";

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
        this.getAt({x:1, y:1}).type = TileType.WallGrey;
    }
    getBorders(): Rect {
        return {
            x: 0,
            y: 0,
            width: this.width,
            height: this.height
        }
    }
    getAt(pos: Coordinate): Tile {
        return this.tiles[pos.x][pos.y];
    }
}