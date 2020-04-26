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

/*export function around (pos: Coordinate) {
    const {x,y} = pos;
    return [
        {x: x-1, y:y-1},
        {x: x, y: y-1},
        {x: x+1, y: y-1},
        {x: x+1, y: y},
        {x: x+1, y:y+1},
        {x: x, y:y+1},
        {x: x-1, y:y+1},
        {x: x, y:y},
        {x: x-1, y:y},
    ];
}*/

export function around (pos: Coordinate, n: number): Coordinate[] {
    const r = [];
    for (let i = -n; i < n+1; i++) {
        for (let j = -n; j < n+1; j++) {
            r.push({x:pos.x+i, y:pos.y+j});   
        }
    }
    return r;
}