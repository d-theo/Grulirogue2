import {Coordinate} from '../game/utils/coordinate';
import {Rect} from '../game/utils/rectangle';

export interface MapGraph {
    doors: {
        roomId: number,
        position: Coordinate
        isLocked: boolean,
        zoneId: number
    }[],
    vertices: {
        from: number,
        to: number,
        segments: {
            A: Coordinate,
            B: Coordinate
        }
    }[],
    rooms: {
        roomId: number,
        groupId: number,
        rect: Rect,
        isEntry: boolean,
        isExit: boolean
    }[],
    links : {
        from: Coordinate, 
        to: Coordinate
    }[],
    connexions?: any;
    bossRoom?: number;
    miniRoom?: number;
    specialRoom?: number;
}





