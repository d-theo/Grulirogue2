import { Item } from "../entitybase/item";
import { ItemVisitor } from "./item-visitor";
import { IEffect } from "../effects/effects";

export class Scroll extends Item {
    effect: IEffect
    target: any;
    constructor(args: any) {
        super(args);
        this.effect = args.effect;
        this.keyMapping['r'] = this.use.bind(this);
        this.keyDescription['r'] = '(r)ead';
        this.skin = 'scroll';
    }
    setTarget(target: any) {
        this.target = target;
        return this;
    }
    get description () {
        if (this.identified) {
            return this._description;
        } else {
            return `A strange scroll with blabla inside`;
        }
    }
    get name () {
        if (this.identified) {
            return this._name;
        } else {
            return `A strange scroll with blabla inside`;
        }
    }
    use() {
        this.isUsed = true;
        this.effect.cast(this.target);
    }
    visit(visitor: ItemVisitor) {
        return visitor.visitScroll(this);
    }
    reveal() {
        this.identified = true;
    }
}