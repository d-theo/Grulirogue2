export type PixelPos = {
    x: number,
    y: number
}
export type TilePos = {
    x: number,
    y: number
}
export function toPix(pos): PixelPos {
    return {
        x: pos.x*32,
        y: pos.y*32
    }
}
export function toTile(pos): TilePos {
    return {
        x: Math.floor(pos.x/32),
        y: Math.floor(pos.y/32)
    }
}