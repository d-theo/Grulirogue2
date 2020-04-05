import { Coordinate } from "../utils/coordinate";
import { ItemVisitor } from "../items/item-visitor";
import { gameBus, itemDropped } from "../../eventBus/game-bus";
import { Hero } from "../hero/hero";
let short = require('short-uuid');
export abstract class Item {
    id = short.generate();
    name: string;
    description: string;
    pos: Coordinate | null;
    skin: string;
    keyMapping: any = {};
    keyDescription: any = {};
    isUsed = false;
    constructor(arg: {x?:number, y?: number, name?: string, description?: string, skin?: string}) {
        this.pos = {
            x: arg.x || 0,
            y: arg.y || 0
        }
        this.description = arg.description || '';
        this.name = arg.name || '';
        this.skin = arg.skin || 'hero'
        
        this.keyMapping['d'] = this.drop.bind(this);
        this.keyDescription['d'] = '(d)rop';
    }
    abstract use(args: any): any;
    abstract visit(itemVisitor: ItemVisitor): any;
    drop(target: Hero) {
        target.dropItem(this);
        gameBus.publish(itemDropped({
            item: this
        }));
    }
}