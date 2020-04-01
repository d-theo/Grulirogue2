import { Item } from "./item";
import { ItemVisitor } from "../items/item-visitor";

export class Armour extends Item {
    public baseAbsorb: number;
    constructor(arg: any) { // Todo
        super(arg);
        this.baseAbsorb = arg.baseAbsorb || 0;
        this.keyMapping['w'] = this.use.bind(this);
        this.keyDescription['w'] = '(w)ear';
    }
    use(){}
    visit(itemVisitor: ItemVisitor) {
        return itemVisitor.visitArmor(this);
    }
}