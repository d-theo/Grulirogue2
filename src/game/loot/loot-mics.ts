import { SpellNames, EffectMaker } from "../effects/effect";
import { Item, ItemArgument } from "../entitybase/item";
import { ItemVisitor } from "../items/item-visitor";
import { Coordinate } from "../utils/coordinate";
import { EffectTarget, WildFireSpell, ShadowSpell, ColdCloudSpell, RainCloudSpell, FireCloudSpell, PoisonCloudSpell, LightningSpell, UnholySpellBook } from "../effects/spells";

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

export const createTomeOfRain = () => {
    return new TomeOfRain({
        name: 'Tome of rain',
        description: 'Can invok the god of rain',
    })
}
export const createSmallTorch = () => {
    return new SmallTorch({
        name: 'Torch',
        description: 'A torch that could burn if throwed',
    })
}
export const createSmellyBottle = () => {
    return new SmellyBottle({
        name: 'Smelly bottle',
        description: 'It has a strong gaz inside',
    })
}
export const createSphereOfLighting = () => {
    return new SphereOfLighting({
        name: 'Sphere of lightning',
        description: 'A blue sphere that seems to be alive',
    })
}
export const createColdCrystal = () => {
    return new ColdCrystal({
        name: 'Cold crystal',
        description: 'A back sphere that seems to be alive',
    })
}

export const createUnholyBook = () => {
    return new UnholyBook({
        name: 'Unholy book',
        description: 'Its covered with blood and dangerous words...'
    });
}

export class WildfireBottle extends Item implements ItemArgument {
    effect: WildFireSpell = EffectMaker.createSpell(SpellNames.WildFire) as WildFireSpell;
    constructor(arg: any) {
        super(arg);
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

export class ColdCrystal extends Item implements ItemArgument {
    effect: ColdCloudSpell = EffectMaker.createSpell(SpellNames.ColdCloud) as ColdCloudSpell;
    skin = 'cold_crystal';
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

export class TomeOfRain extends Item implements ItemArgument {
    effect: RainCloudSpell = EffectMaker.createSpell(SpellNames.RainCloud) as RainCloudSpell;
    skin = 'tome_of_rain';
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

export class SmallTorch extends Item implements ItemArgument {
    effect: FireCloudSpell = EffectMaker.createSpell(SpellNames.FireCloud) as FireCloudSpell;
    skin = 'small_torch';
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

export class SmellyBottle extends Item implements ItemArgument {
    effect: PoisonCloudSpell = EffectMaker.createSpell(SpellNames.PoisonCloud) as PoisonCloudSpell;
    skin = 'smelly_bottle';
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

export class SphereOfLighting extends Item implements ItemArgument {
    effect: LightningSpell = EffectMaker.createSpell(SpellNames.LightningCloud) as LightningSpell;
    skin = 'sphere_of_lighting';
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

export class UnholyBook extends Item implements ItemArgument {
    effect: UnholySpellBook = EffectMaker.createSpell(SpellNames.UnholySpell) as UnholySpellBook;
    constructor(arg: any) {
        super(arg);
        this.skin = 'unholy_book';
        this.keyDescription['u'] = '(u)se';
        this.keyMapping['u'] = this.use.bind(this);
    }
    use() {
        this.effect.cast();
    }
    visit(itemVisitor: ItemVisitor): any {
        return itemVisitor.visitMisc(this);
    }
    reveal() {}
    getArgumentForKey(key: string) {
        switch(key) {
            case 'u':
            case 'd': 
            default : return EffectTarget.None;
        }
    }
}