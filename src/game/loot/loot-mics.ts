import { SpellNames, EffectMaker } from "../effects/effect";
import { Item, ItemArgument } from "../entitybase/item";
import { ItemVisitor } from "../items/item-visitor";
import { EffectTarget, IEffect } from "../effects/spells";

export const createWildFireBottle = () => {
    return new Misc({
        name: 'Bottle of wildfire',
        description: 'The flame inside this bottle looks like it wants to get out',
        effect: EffectMaker.createSpell(SpellNames.WildFire),
        effectTarget: EffectTarget.AoE,
        skin: 'wildfire_bottle'
    });
};
export const createSphereOfShadow = () => {
    return new Misc({
        name: 'Sphere of shadows',
        description: 'A back sphere that seems to be alive',
        effectTarget: EffectTarget.AoE,
        effect: EffectMaker.createSpell(SpellNames.Shadow),
        skin: 'sphere_of_shadows'
    });
};
export const createTomeOfRain = () => {
    return new Misc({
        name: 'Tome of rain',
        description: 'Can invok the god of rain',
        skin: 'tome_of_rain',
        effect: EffectMaker.createSpell(SpellNames.RainCloud),
        effectTarget: EffectTarget.AoE
    })
}
export const createTomeOfVegetation = () => {
    return new Misc({
        name: 'Tome of vegetation',
        description: 'Can invok the god of vegetation',
        skin: 'tome_floral',
        effect: EffectMaker.createSpell(SpellNames.FloralCloud),
        effectTarget: EffectTarget.AoE
    })
}
export const createSmallTorch = () => {
    return new Misc({
        name: 'Torch',
        description: 'A torch that could burn if throwed',
        skin: 'small_torch',
        effectTarget: EffectTarget.AoE,
        effect: EffectMaker.createSpell(SpellNames.FireCloud)
    })
}
export const createSmellyBottle = () => {
    return new Misc({
        name: 'Smelly bottle',
        description: 'It has a strong gaz inside',
        skin: 'smelly_bottle',
        effect: EffectMaker.createSpell(SpellNames.PoisonCloud),
        effectTarget: EffectTarget.AoE
    })
}
export const createSphereOfLighting = () => {
    return new Misc({
        name: 'Sphere of lightning',
        description: 'A blue sphere that seems to be alive',
        skin: 'sphere_of_lighting',
        effectTarget: EffectTarget.AoE,
        effect: EffectMaker.createSpell(SpellNames.LightningCloud)
    })
}
export const createColdCrystal = () => {
    return new Misc({
        name: 'Cold crystal',
        description: 'A back sphere that seems to be alive',
        effect: EffectMaker.createSpell(SpellNames.ColdCloud),
        skin: 'cold_crystal',
        effectTarget: EffectTarget.AoE,
    })
}
export const createUnholyBook = () => {
    return new Misc({
        name: 'Unholy book',
        description: 'Its covered with blood and dangerous words...',
        effect: EffectMaker.createSpell(SpellNames.UnholySpell),
        effectTarget: EffectTarget.None,
        skin: 'unholy_book'
    });
}
export const createRogueTome = () => {
    return new Misc({
        name: 'Strange tome',
        description: 'Its covered with glyphs: @.+-"~mw#',
        skin: 'rogue_tome',
        effect: EffectMaker.createSpell(SpellNames.RogueEventSpell),
        effectTarget: EffectTarget.Hero
    });
}
export const createRealityTome = () => {
    return new Misc({
        name: 'Strange tome',
        description: 'Should a read that ... ?',
        skin: 'reality_tome',
        effect: EffectMaker.createSpell(SpellNames.RealityEventSpell),
        effectTarget: EffectTarget.Hero
    });
}
export class Misc extends Item implements ItemArgument {
    effect: IEffect;
    effectTarget: EffectTarget;
    constructor(arg: any) {
        super(arg);
        this.skin = arg.skin;
        this.effect = arg.effect;
        this.identified = true;
        this.effectTarget = arg.effectTarget;
        this.keyDescription['u'] = '(u)se';
        this.keyMapping['u'] = this.use.bind(this);
    }
    get description () {
        return this._description;
    }
    get name () {
        return this._name;
    }
    use(target: any) {
        this.effect.cast(target);
    }
    visit(itemVisitor: ItemVisitor): any {
        return itemVisitor.visitMisc(this);
    }
    reveal() {}
    getArgumentForKey(key: string) {
        switch(key) {
            case 'u': return this.effectTarget;
            case 'd': 
            default : return EffectTarget.None;
        }
    }
}
export class CatStatue extends Item {
    constructor(arg: any) {
        super(arg);
        this.skin = arg.skin;
        this._name = 'Cat statue';
        this._description = 'A cat statue. What could be the use of that ...?';
    }
    use(target: any) {}
    get name() {
        return this._name;
    }
    get description() {
        return this._description;
    }
    visit(itemVisitor: ItemVisitor): any {return itemVisitor.visitMisc(this);}
    reveal() {}
    getArgumentForKey(key: string) {
        switch(key) {
            case 'd': 
            default : return EffectTarget.None;
        }
    }
}