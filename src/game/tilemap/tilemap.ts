import { Tile } from "./tile";
import { Rect, randomIn } from "../utils/rectangle";
import { Coordinate } from "../utils/coordinate";
import { line } from "./sight";
import { matrixForEach } from "../utils/matrix";
import { tilePropertiesForTerrain } from "./tile-type-metadata";
import * as _ from 'lodash';
import { Monster } from "../monsters/monster";
import { Hero } from "../hero/hero";
import { gameBus } from "../../eventBus/game-bus";
import { BuffDefinition } from "../effects/effect";
import { Affect } from "../effects/affects";
import { effectUnset, sightUpdated } from "../../events";
import { MapGraph } from "../../world/generation/map_definition";
import { createMap } from "../../world/map/map-generator";
import { Terrain } from "../../world/map/terrain.greece";
let short = require('short-uuid');

type DebuffDuration = {debugId?: string, id: string, duration: number, triggered: boolean, pos: Coordinate};

export class TileMap {
    graph!: MapGraph;
    tiles!: Tile[][];
    tilemap!: number[][];
    additionalLayer!: number[][];
    
    width!: number;
    height!: number;
    heightM1!: number;
    widthM1!: number;

    debuffDurations: DebuffDuration[] = [];

    constructor() {}
    init(level: number) {
        this.debuffDurations = [];
        const {isSolid, isWalkable} = tilePropertiesForTerrain();
        const {tilemap, tilemap2, mapObject, thingsToPlace} = createMap(level);
        this.tilemap = tilemap;
        this.additionalLayer = tilemap2;
        this.graph = mapObject;

        this.height = tilemap.length;
        this.width = tilemap[0].length;

        let tiles = [];
        let lines = [];
        for (let lineNb = 0; lineNb < this.height; lineNb++) {
            for (let colNb = 0; colNb < this.width; colNb++) {
                const tile = new Tile({x:colNb, y:lineNb, isSolidFct: isSolid, isWalkableFct: isWalkable});
                const backgroundType = tilemap[lineNb][colNb];
                const foregroundType = tilemap2[lineNb][colNb];
                tile.type.push(backgroundType);
                tile.type.push(foregroundType);
                if (backgroundType === Terrain.Stair) {
                    tile.isExit = true;
                }
                this.setFgEffect(tile);
                lines.push(tile);
            }
            tiles.push(lines);
            lines = [];
        }
        this.tiles = tiles;
        this.heightM1 = this.height - 1;
        this.widthM1 = this.width - 1;

        return thingsToPlace;
    }
    getBorders(): Rect {
        return {
            x: 0,
            y: 0,
            width: this.width,
            height: this.height
        }
    }
    setFgEffect(tile: Tile) {
        if (tile.type[1] === Terrain.WaterFloor) {
            this.addTileEffects2({
                debuff: () => new Affect('wet').turns(3).create(),
                tile,
                duration: Infinity,
                stayOnWalk: true
            });
        }
        if (tile.type[1] === Terrain.VegetalFloor) {
            this.addTileEffects2({
                debuff: () => new Affect('floral').create(),
                tile,
                duration: Infinity,
                stayOnWalk: true
            });
        }
    }
    getAt(pos: Coordinate): Tile {
        return this.tiles[pos.y][pos.x];
    }

    addTileEffects(args: {debugId?: string, pos: Coordinate, debuff: () => BuffDefinition, duration: number, stayOnWalk: boolean}) {
        const {pos, debuff, duration, stayOnWalk, debugId} = args;
        const id = short.generate();
        if (this.getAt(pos).isSolid()) return null;
        this.getAt(pos).addDebuff({id, debuff: debuff});
        this.debuffDurations.push({id, duration: duration, triggered: stayOnWalk, pos, debugId});
        return id;
    }
    addTileEffects2(args: {tile: Tile, debuff: () => BuffDefinition, duration: number, stayOnWalk: boolean}) {
        const {tile, debuff, duration, stayOnWalk} = args;
        if (tile.isSolid()) return null;
        const id = short.generate();
        tile.addDebuff({id, debuff: debuff});
        this.debuffDurations.push({id, duration: duration, triggered: stayOnWalk, pos:tile.pos});
        return id;
    }
    playTileEffectsOn(hero: Hero, monsters: Monster[]) {
        let ids = this.playTileEffectOnWalker(hero);
        monsters.forEach(m => {
            ids = ids.concat(this.playTileEffectOnWalker(m));
        });
        ids = Array.from(new Set(ids));
        let toDelete: string[] = [];
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
                toDelete.push(timer.id);
                gameBus.publish(effectUnset({id: timer.id}));
            }
        }
        this.debuffDurations = this.debuffDurations.filter(dd => toDelete.indexOf(dd.id) < 0);
    }
    private playTileEffectOnWalker(walker: Hero | Monster) {
        const tile = this.getAt(walker.pos);
        const debuffs = tile.getDebuffs();
        const idTriggered: string[] = [];
        if (debuffs.length > 0) {
            debuffs.forEach(d => {
                walker.addBuff(d.debuff());
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
        gameBus.publish(sightUpdated({}));
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