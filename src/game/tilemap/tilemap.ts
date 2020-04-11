import { Tile } from "./tile";
import { Rect, randomIn } from "../utils/rectangle";
import { Coordinate } from "../utils/coordinate";
import { line } from "./sight";
import {createMap, MapParamCreation} from '../../map/map-generator';
import { MapGraph } from "../../generation/map_definition";
import { matrixForEach, matrixFilter } from "../utils/matrix";
import { tilePropertiesForTerrain } from "./tile-type-metadata";
import { Terrain } from "../../map/terrain";
import * as _ from 'lodash';
import { Monster } from "../monsters/monster";
import { Hero } from "../hero/hero";
import { IEffect } from "../effects/effects";
import { gameBus, effectUnset } from "../../eventBus/game-bus";
let short = require('short-uuid');

type DebuffDuration = {id: string, duration: number, triggered: boolean, pos: Coordinate};

export class TileMap {
    graph!: MapGraph;
    tiles!: Tile[][];
    tilemap!: number[][];
    
    width!: number;
    height!: number;
    heightM1!: number;
    widthM1!: number;
    terrain!: Terrain;

    debuffDurations: DebuffDuration[] = [];
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
                if (tile.type === this.terrain.Stair) {
                    tile.isExit = true;
                }
                lines.push(tile);
            }
            tiles.push(lines);
            lines = [];
        }
        this.tiles = tiles;
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

    addTileEffects(args: {pos: Coordinate, debuff: IEffect, durationAfterWalk: number, type: string}) {
        const {pos, debuff, durationAfterWalk, type} = args;
        const id = short.generate();
        this.getAt(pos).addDebuff({id, debuff: debuff});
        this.debuffDurations.push({id, duration: durationAfterWalk, triggered: false, pos});
        return id;
    }
    playTileEffectsOn(hero: Hero, monsters: Monster[]) {
        let ids = this.playTileEffectOnWalker(hero);
        monsters.forEach(m => {
            ids = ids.concat(this.playTileEffectOnWalker(m));
        });
        for (let timer of this.debuffDurations) {
            if (ids.indexOf(timer.id) > -1) {
                timer.triggered = true;
            }
            if (timer.triggered) {
                timer.duration -= 1;
            }
            if (timer.duration === 0) {
                const tile = this.getAt(timer.pos);
                tile.removeDebuff(timer.id);
                gameBus.publish(effectUnset({name: timer.id}));
            }
        }
    }
    private playTileEffectOnWalker(walker: Hero | Monster) {
        const tile = this.getAt(walker.pos);
        const debuffs = tile.getDebuffs();
        const idTriggered: string[] = [];
        if (debuffs.length > 0) {
            debuffs.forEach(d => {
                d.debuff.cast(walker);
                idTriggered.push(d.id);
            });
        }
        return idTriggered;
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
    startingPosition() {
        for (let room of this.graph.rooms) {
            if (room.isEntry) {
                return randomIn(room.rect);
            }
        }
        throw new Error('not entry !!')
    }
}