import { Tile } from "./tile";
import { Coordinate } from "../utils/coordinate";
import { AStarFinder } from 'astar-typescript';
import { matrixMap } from "../utils/matrix";
import * as _ from 'lodash';

export function astar(args: {from: Coordinate, tiles: Tile[][], to: Coordinate, additionnalObstacle: Coordinate[]}) {
    const {from, to, tiles, additionnalObstacle} = args;
    const binaryMap = matrixMap(tiles, (tile: Tile) => {
        for (const pos of additionnalObstacle) {
            if (tile.pos.x === pos.x && tile.pos.y === pos.y) {
                return 1;
            }
        }
        return tile.isWalkable() ? 0 : 1;
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