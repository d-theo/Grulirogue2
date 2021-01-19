import { Item, ItemArgument } from "../entitybase/item";
import { ItemVisitor } from "../items/item-visitor";
import { SpellBook } from "../effects/spell-book";
import { EffectTarget, IEffect } from "../effects/definitions";

export const createWildFireBottle = () => {
    return new Misc({
        name: 'Bottle of wildfire',
        description: 'The flame inside this bottle looks like it wants to get out',
        effect: SpellBook.WildFireSpell,
        effectTarget: EffectTarget.AoE,
        skin: 'wildfire_bottle'
    });
};
export const createSphereOfShadow = () => {
    return new Misc({
        name: 'Sphere of shadows',
        description: 'A back sphere that seems to be alive',
        effectTarget: EffectTarget.AoE,
        effect: SpellBook.Shadow,
        skin: 'sphere_of_shadows'
    });
};
export const createTomeOfRain = () => {
    return new Misc({
        name: 'Tome of rain',
        description: 'Can invok the god of rain',
        skin: 'tome_of_rain',
        effect: SpellBook.RainCloud,
        effectTarget: EffectTarget.AoE
    })
}
export const createTomeOfVegetation = () => {
    return new Misc({
        name: 'Tome of vegetation',
        description: 'Can invok the god of vegetation',
        skin: 'tome_floral',
        effect: SpellBook.FloralCloud,
        effectTarget: EffectTarget.AoE
    })
}
export const createSmallTorch = () => {
    return new Misc({
        name: 'Torch',
        description: 'A torch that could burn if throwed',
        skin: 'small_torch',
        effectTarget: EffectTarget.AoE,
        effect: SpellBook.FireCloud
    })
}
export const createSmellyBottle = () => {
    return new Misc({
        name: 'Smelly bottle',
        description: 'It has a strong gaz inside',
        skin: 'smelly_bottle',
        effect: SpellBook.PoisonCloud,
        effectTarget: EffectTarget.AoE
    })
}
export const createSphereOfLighting = () => {
    return new Misc({
        name: 'Sphere of lightning',
        description: 'A blue sphere that seems to be alive',
        skin: 'sphere_of_lighting',
        effectTarget: EffectTarget.AoE,
        effect: SpellBook.LightningCloud
    })
}
export const createColdCrystal = () => {
    return new Misc({
        name: 'Cold crystal',
        description: 'A back sphere that seems to be alive',
        effect: SpellBook.ColdCloud,
        skin: 'cold_crystal',
        effectTarget: EffectTarget.AoE,
    })
}
export const createUnholyBook = () => {
    return new Misc({
        name: 'Unholy book',
        description: 'Its covered with blood and dangerous words...',
        effect: SpellBook.UnholySpellBook,
        effectTarget: EffectTarget.None,
        skin: 'unholy_book'
    });
}
export const createRogueTome = () => {
    return new Misc({
        name: 'Strange tome',
        description: 'Its covered with glyphs: @.+-"~mw#',
        skin: 'rogue_tome',
        effect: SpellBook.RogueEventSpell,
        effectTarget: EffectTarget.Hero
    });
}
export const createRealityTome = () => {
    return new Misc({
        name: 'Strange tome',
        description: 'Should a read that ... ?',
        skin: 'reality_tome',
        effect: SpellBook.RealityEventSpell,
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
        this.skin = 'Cat statue';
        this._name = 'Cat statue';
        this._description = 'A little cat statue. What could be the use of that ...?';
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