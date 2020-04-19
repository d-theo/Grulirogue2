export interface Coordinate {
    x: number;
    y: number;
}
export function posToString(c: Coordinate): string {
    return `{${c.x},${c.y}}`
}
export function equalsCoordinate(c: Coordinate, c2: Coordinate) {
    return c.x === c2.x && c.y === c2.y;
}
export function distance(c: Coordinate, c2: Coordinate) {
    const h = Math.abs(c.x - c2.x);
    const v = Math.abs(c.y - c2.y);
    return Math.max(v,h);
}