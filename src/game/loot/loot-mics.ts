import { SpellNames, EffectMaker } from "../effects/effect";
import { Item, ItemArgument } from "../entitybase/item";
import { ItemVisitor } from "../items/item-visitor";
import { Coordinate } from "../utils/coordinate";
import { EffectTarget, WildFireSpell, ShadowSpell } from "../effects/effects";

export const createWildFireBottle = () => {
    return new WildfireBottle({
        name: 'Bottle of wildfire',
        description: 'The flame inside this bottle looks like it wants to get out'
    });
};
export const createSphereOfShadow = () => {
    return new SphereOfShadows({
        name: 'Sphere of shadows',
        description: 'A back sphere that seems to be alive',
    });
};

export class WildfireBottle extends Item implements ItemArgument {
    effect: WildFireSpell = EffectMaker.createSpell(SpellNames.WildFire) as WildFireSpell;
    constructor(arg: any) {
        super(arg);
        /*this._name = 'A bottle of wildfire';
        this._description = 'A potion that makes your skin thicker but also slower';*/
        this.skin = 'wildfire_bottle';
        this.keyDescription['u'] = '(u)se';
        this.keyMapping['u'] = this.use.bind(this);
    }
    use(target: Coordinate) {
        this.effect.cast(target);
    }
    visit(itemVisitor: ItemVisitor): any {
        return itemVisitor.visitMisc(this);
    }
    reveal() {}
    getArgumentForKey(key: string) {
        switch(key) {
            case 'u': return EffectTarget.AoE;
            case 'd': 
            default : return EffectTarget.None;
        }
    }
}

export class SphereOfShadows extends Item implements ItemArgument {
    effect: ShadowSpell = EffectMaker.createSpell(SpellNames.Shadow) as ShadowSpell;
    skin = 'sphere_of_shadows';
    constructor(arg: any) {
        super(arg);
        this.keyDescription['u'] = '(u)se';
        this.keyMapping['u'] = this.use.bind(this);
    }
    use(target: Coordinate) {
        this.effect.cast(target);
    }
    visit(itemVisitor: ItemVisitor): any {
        return itemVisitor.visitMisc(this);
    }
    reveal() {}
    getArgumentForKey(key: string) {
        switch(key) {
            case 'u': return EffectTarget.AoE;
            case 'd': 
            default : return EffectTarget.None;
        }
    }
}