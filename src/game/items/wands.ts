import { Item, ItemArgument } from "../entitybase/item";
import { ItemVisitor } from "./item-visitor";
import * as _ from 'lodash';
import { gameBus, logPublished } from "../../eventBus/game-bus";
import { IEffect, EffectTarget } from "../effects/spells";

export class Wand extends Item implements ItemArgument {
    effect: IEffect;
    constructor(args: any) {
        super(args);
        this.effect = args.effect;
        this.keyMapping['z'] = this.use.bind(this);
        this.keyDescription['z'] = '(z)ap';
        this.skin = args.skin;
        this.identified = false;
    }
    get description () {
        if (! this.identified) {
            return `A stick with stranges inscriptions on it`;
        } else {
            return this._description;
        }
    }
    get name () {
        if (this.identified) {
            return this._name;
        } else {
            return 'Colored stick';
        }
    }
    use(target: any) {
        if (! this.identified) {
            gameBus.publish(logPublished({data: `It was a ${this._name}`, level: 'neutral'}));
            this.reveal();
        }
        this.effect.cast(target);
    }
    visit(visitor: ItemVisitor):any {
        return visitor.visitWand(this);
    }
    reveal() {
        this.identified = true;
    }

    getArgumentForKey(key: string) {
        switch(key) {
            case 'z': return this.effect.type;
            case 'd': 
            default : return EffectTarget.None;
        }
    }
}