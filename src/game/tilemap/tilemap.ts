import { Tile, TileVisibility } from "./tile";
import { Rect, randomIn } from "../utils/rectangle";
import { Coordinate } from "../utils/coordinate";
import { line } from "./sight";
import {createMap, MapParamCreation} from '../../map/map-generator';
import { MapGraph } from "../../generation/map_definition";
import { matrixForEach, matrixFilter } from "../utils/matrix";
import { tilePropertiesForTerrain } from "./tile-type-metadata";
import { Terrain } from "../../map/terrain";
import { pickInArray } from "../utils/random";
import * as _ from 'lodash';

export class TileMap {
    graph!: MapGraph;
    tiles!: Tile[][];
    tilemap!: number[][];
    
    width!: number;
    height!: number;
    heightM1!: number;
    widthM1!: number;
    terrain!: Terrain;
    constructor() {}
    init(params: MapParamCreation) {
        const {isSolid, isWalkable} = tilePropertiesForTerrain(params.Terrain);
        this.terrain = params.Terrain;
        const {tilemap, mapObject} = createMap(params);
        this.tilemap = tilemap;
        this.graph = mapObject;

        this.height = tilemap.length;
        this.width = tilemap[0].length;

        let tiles = [];
        let lines = [];
        for (let lineNb = 0; lineNb < this.height; lineNb++) {
            for (let colNb = 0; colNb < this.width; colNb++) {
                const tile = new Tile({x:colNb, y:lineNb, isSolidFct: isSolid, isWalkableFct: isWalkable});
                tile.type = tilemap[lineNb][colNb];
                lines.push(tile);
            }
            tiles.push(lines);
            lines = [];
        }
        this.tiles = tiles;
        this.setExit();
        this.setButtons();
        this.heightM1 = this.height - 1;
        this.widthM1 = this.width - 1;
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

    getSightAround(arg: {from: Coordinate, range: number}) {
        return this.subTitles(arg);
    }

    computeSight(arg: {from: Coordinate, range: number}) {
        matrixForEach(this.tiles, (t => t.setObscurity()));
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
        
        for (const to of arr) {
            const positions = line({from, to});
            this.getAt(positions.shift()).setOnSight();
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
    setExit() {
        for (let room of this.graph.rooms) {
            if (room.isExit) {
                const pos = randomIn(room.rect);
                this.getAt(pos).type = this.terrain.Stair;
                this.getAt(pos).isExit = true;
                this.tilemap[pos.y][pos.x] = this.terrain.Stair;
            }
        }
    }
    setButtons() {
        const ids = _.groupBy(this.graph.rooms, 'groupId');
        for (const rooms of Object.values(ids)) {
            const r = pickInArray(rooms);
            const pos = randomIn(r.rect);
            this.getAt(pos).type = this.terrain.Button;
            this.tilemap[pos.y][pos.x] = this.terrain.Button;
        }
    }
    startingPosition() {
        for (let room of this.graph.rooms) {
            if (room.isEntry) {
                return randomIn(room.rect);
            }
        }
        throw new Error('not entry !!')
    }
}