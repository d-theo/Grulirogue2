import { Tile } from "./tile";
import { Coordinate } from "../utils/coordinate";
import { AStarFinder } from 'astar-typescript';
import { matrixMap } from "../utils/matrix";
import * as _ from 'lodash';

export function astar(args: {from: Coordinate, tiles: Tile[][], to: Coordinate}) {
    const {from, to, tiles} = args;
    const binaryMap = matrixMap(tiles, (tile: Tile) => {
        return tile.isSolid() ? 1 : 0;
    });
    const aStar = new AStarFinder({
        grid: {
          matrix: binaryMap
        },
        includeStartNode: false,
        includeEndNode: true
    });
    return aStar.findPath(from, to).map(v => ({x: v[0], y: v[1]}));
}