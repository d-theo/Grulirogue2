import { Coordinate } from "../game/utils/coordinate";

export type PixelPos = {
    x: number,
    y: number
}
export type TilePos = {
    x: number,
    y: number
}

export function toPix(n: number): number;
export function toPix(pos: Coordinate): PixelPos;
export function toPix(arg: Coordinate|number): PixelPos | number {
    if (typeof arg === 'number') {
        return arg*32;
    } else {
        return {
            x: arg.x*32,
            y: arg.y*32
        }
    }
}

export function toTile(pos): TilePos {
    return {
        x: Math.floor(pos.x/32),
        y: Math.floor(pos.y/32)
    }
}