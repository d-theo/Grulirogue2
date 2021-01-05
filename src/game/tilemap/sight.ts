import { Coordinate } from "../utils/coordinate";
const bresenham = require('bresenham');

// includes from
export function line(arg:{from: Coordinate, to: Coordinate}) {
    const {from, to} = arg;
    return bresenham(from.x, from.y, to.x, to.y);
}
