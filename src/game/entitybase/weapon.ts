import { Item } from "./item";
import { GameRange } from "../utils/range";
import { pickInRange } from "../utils/random";
import { ItemVisitor } from "../items/item-visitor";

export class Weapon extends Item {
    baseDamage: string;
    maxRange: number;
    constructor(arg: any) { // TODO
        super(arg);
        this.baseDamage = arg.baseDamage;
        this.maxRange = arg.maxRange || 1;
        this.keyMapping['w'] = this.use.bind(this);
        this.keyDescription['w'] = '(w)ield';
        this.description = `kind: ${this.skin}
        dammages: ${this.baseDamage}
        range: ${this.maxRange}`
    }

    deal() {
        return pickInRange(this.baseDamage);
    }
    use(target: any) {
        target.equip(this);
    }
    visit(itemVisitor: ItemVisitor) {
        return itemVisitor.visitWeapon(this);
    }
}