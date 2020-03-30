import { Coordinate } from "../utils/coordinate";
import { ItemVisitor } from "../items/item-visitor";
let short = require('short-uuid');
export abstract class Item {
    id = short.generate();
    name: string;
    description: string;
    pos: Coordinate | null;
    skin: string;
    constructor(arg: {x?:number, y?: number, name?: string, description?: string, skin?: string}) {
        this.pos = {
            x: arg.x || 0,
            y: arg.y || 0
        }
        this.description = arg.description || '';
        this.name = arg.name || '';
        this.skin = arg.skin || 'hero'
    }
    abstract use(args: any): any;
    abstract visit(itemVisitor: ItemVisitor): any;
}