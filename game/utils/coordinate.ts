export interface Coordinate {
    x: number;
    y: number;
}
export function posToString(c: Coordinate): string {
    return `{${c.x},${c.y}}`
}