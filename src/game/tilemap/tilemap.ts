import { Tile, TileVisibility } from "./tile";
import { Rect } from "../utils/rectangle";
import { Coordinate } from "../utils/coordinate";
import { TileType } from "./tileType";
import { line } from "./sight";
import {createMap, MapParamCreation} from '../../map/map-generator';
import { MapGraph } from "../../generation/map_definition";

export class TileMap {
    graph!: MapGraph;
    tiles!: Tile[][];
    tilemap!: number[][];
    
    width!: number;
    height!: number;
    heightM1!: number;
    widthM1!: number;
    constructor() {
        
        this.heightM1 = this.height - 1;
        this.widthM1 = this.width - 1;
    }
    init(params: MapParamCreation) {
        const {tilemap, mapObject} = createMap(params);
        this.tilemap = tilemap;
        this.graph = mapObject;

        this.height = tilemap.length;
        this.width = tilemap[0].length;

        let tiles = [];
        let lines = [];
        for (let lineNb = 0; lineNb < this.height; lineNb++) {
            for (let colNb = 0; colNb < this.width; colNb++) {
                lines.push(new Tile({x:colNb, y:lineNb}));
            }
            tiles.push(lines);
            lines = [];
        }
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
        return this.tiles[pos.y][pos.x];
    }

    hasVisibility(arg:{from: Coordinate, to:Coordinate}) {
        const {from, to} = arg;
        const positions = line({from, to});
        for (const pos of positions) {
            const currTile = this.getAt(pos);
            if (currTile.isSolid()) {
                return false;
            }
        }
        return true;
    }

    subView(arg: {from: Coordinate, range: number}) {
        const {from, range} = arg;
        const right = Math.min(from.x + range, this.widthM1);
        const left = Math.max(from.x - range, 0);

        const top = Math.max(from.y - range, 0);
        const bottom = Math.min(from.y + range, this.heightM1);
        const arr = [];
        for (let h = top; h <= bottom; h++) {
            for (let w = left; w <= right; w++) {
                arr.push({x: w, y:h});
            }
        }
        return arr;
    }

    subTitles(arg: {from: Coordinate, range: number}) {
        const {from, range} = arg;
        const right = Math.min(from.x + range, this.widthM1);
        const left = Math.max(from.x - range, 0);

        const top = Math.max(from.y - range, 0);
        const bottom = Math.min(from.y + range, this.heightM1);
        const arr = [];
        for (let h = top; h <= bottom; h++) {
            const line = [];
            for (let w = left; w <= right; w++) {
                line.push(this.getAt({x: w, y:h}));
            }
            arr.push(line);
        }
        return arr;
    }

    computeSight(arg: {from: Coordinate, range: number}) {
        const {from, range} = arg;
        const right = Math.min(from.x + range, this.widthM1);
        const left = Math.max(from.x - range, 0);

        const top = Math.max(from.y - range, 0);
        const bottom = Math.min(from.y + range, this.heightM1);
        const arr = [];
        for (let h = top; h <= bottom; h++) {
            for (let w = left; w <= right; w++) {
                arr.push({x: w, y:h});
                this.getAt({x: w, y:h}).visibility = TileVisibility.Unknown;
            }
        }

        for (const to of arr) {
            const positions = line({from, to});
            let currVisibility = 'visible';
            for (const pos of positions) {
                const currTile = this.getAt(pos);
                if (currTile.isSolid() && currVisibility === 'visible') {
                    currTile.setOnSight();
                    currVisibility = 'hidden';
                } else if (currVisibility === 'hidden') {
                    currTile.setObscurity();
                } else {
                    currTile.setOnSight();
                }
            }
        }
    }
    startingPosition() {
        for (let room of this.graph.rooms) {
            if (room.isEntry) {
                
            }
        }
    }
}