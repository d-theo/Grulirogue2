import { Item } from "../entitybase/item";
import { ItemVisitor } from "./item-visitor";

export class Scroll extends Item {
    effect: Function
    constructor(args: any) {
        super(args);
        this.effect = args.effect;
        this.keyMapping['r'] = this.use.bind(this);
        this.keyDescription['r'] = '(r)ead';
    }
    use() {
        
    }
    visit(visitor: ItemVisitor) {
        return visitor.visitScroll(this);
    }
}