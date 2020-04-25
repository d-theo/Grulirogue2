import { ItemVisitor } from "../items/item-visitor";
import { EffectTarget } from "../effects/effects";
import { Item, ItemArgument } from "../entitybase/item";

export class Armour extends Item implements ItemArgument{
    public baseAbsorb: number;
    public bulky: number;
    constructor(arg: any) { // Todo
        super(arg);
        this.baseAbsorb = arg.baseAbsorb || 0;
        this.bulky = arg.bulky || 0;
        this.keyMapping['w'] = this.use.bind(this);
        this.keyDescription['w'] = '(w)ear';
    }
    get description(): string {
        if (this.identified) {
            return `${this._description} - absorb : ${this.baseAbsorb}`;
        } else {
            return `An unidentified ${this.skin}`
        }
    }
    get name() {
        if (this.identified) {
            return this._name;
        } else {
            return `An unidentified ${this.skin}`
        }
    }
    use(target: any) {
        target.equip(this);
    }
    visit(itemVisitor: ItemVisitor) {
        return itemVisitor.visitArmor(this);
    }
    reveal() {
        this.identified = true;
    }
    getArgumentForKey(key: string) {
        return EffectTarget.Hero;
    }
}