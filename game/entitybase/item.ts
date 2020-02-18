import { Coordinate } from "../utils/coordinate";

export class Item {
    name: string;
    description: string;
    pos: Coordinate;
    constructor(arg: {x?:number, y?: number, name?: string, description?: string}) {
        this.pos = {
            x: arg.x || 0,
            y: arg.y || 0
        }
        this.description = arg.description || '';
        this.name = arg.name || '';
    }
}