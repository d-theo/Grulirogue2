import {TileMap} from '../tilemap/tilemap';
import {Hero} from '../hero/hero';
import {MonsterCollection} from '../monsters/monsterCollection';
import { Coordinate } from '../utils/coordinate';
import { HealEffect, ThicknessEffect, CleaningEffect, StunEffect, DodgeEffect, XPEffect, BleedEffect, PoisonEffect, StupidityEffect, SpeedEffect, RageEffect, AccuratyEffect, TrapSpell, RogueSpell, TeleportationSpell, ImproveArmourSpell, ImproveWeaponSpell, BlinkSpell, IdentifiySpell, KnowledgeSpell, WetEffect, WildFireSpell, IEffect, ShadowSpell, ShadowEffet, RawDamageEffet } from './effects';
import { microValidator } from '../utils/micro-validator';

export type BuffDefinition = {
    start: Function | null;
    tick?: Function;
    end: Function;
    turns: number
};

export enum Effects {
    Heal = 'Heal',
    Bleed = 'Bleed',
    Const = 'Const',
    Invisibility = 'Invisibility',
    Thick = 'Thick',
    Cleaning = 'Cleaning',
    Dodge = 'Dodge',
    XP = 'XP',
    Stun = 'Stun',
    Blind = 'Blind',
    Poison = 'Poison',
    Stupid = 'Stupid',
    Speed = 'Speed',
    Rage = 'Rage',
    Accuraty = 'Accuraty',
    Wet = 'Wet',
    RawDamage = 'RawDamage',
    Shadow = 'Shadow'
}

export enum SpellNames {
    SpikeTrap = 'SpikeTrap',
    Rogue = "Rogue",
    Teleportation = "Teleportation",
    EnchantWeapon = "EnchantWeapon",
    EnchantArmour = "EnchantArmour",
    Blink = "Blink",
    Identify = "Identify",
    Knowledge= "Knowledge",
    WildFire = 'WildFire',
    Shadow = "Shadow"
}

let tilemap: TileMap;
let hero: Hero;
let monsters: MonsterCollection;
let effect: WorldEffect;
export const EffectMaker = {
    set: initEffects,
    create: createEffect,
    createSpell: createSpell
};

function initEffects(args: {tilemap : TileMap, hero: Hero, monsters: MonsterCollection}) {
    tilemap = args.tilemap;
    hero = args.hero;
    monsters = args.monsters;
    effect = new WorldEffect(tilemap, hero, monsters);
}

function createSpell(name: SpellNames) {
    microValidator([tilemap, hero, monsters], 'createSpell failure: null');
    switch(name) {
        case SpellNames.SpikeTrap: 
            return new TrapSpell(effect);
        case SpellNames.Rogue:
            return new RogueSpell(effect);
        case SpellNames.Teleportation:
            return new TeleportationSpell(effect);
        case SpellNames.EnchantArmour:
            return new ImproveArmourSpell(effect);
        case SpellNames.EnchantWeapon:
            return new ImproveWeaponSpell(effect);
        case SpellNames.Blink:
            return new BlinkSpell(effect);
        case SpellNames.Identify:
            return new IdentifiySpell();
        case SpellNames.Knowledge :
            return new KnowledgeSpell(effect);
        case SpellNames.WildFire:
            return new WildFireSpell(effect);
        case SpellNames.Shadow:
            return new ShadowSpell(effect);
    }
}

function createEffect(name: Effects) {
    //microValidator([tilemap, hero, monsters], 'createEffect failure: null');
    switch(name) {
        case Effects.Heal:
            return new HealEffect();
        case Effects.Thick:
            return new ThicknessEffect();
        case Effects.Cleaning:
            return new CleaningEffect();
        case Effects.Stun:
            return new StunEffect();
        case Effects.Dodge:
            return new DodgeEffect();
        case Effects.XP:
            return new XPEffect();
        case Effects.Bleed:
            return new BleedEffect();
        case Effects.Poison:
            return new PoisonEffect();
        case Effects.Stupid:
            return new StupidityEffect();
        case Effects.Speed:
            return new SpeedEffect();
        case Effects.Rage:
            return new RageEffect();
        case Effects.Accuraty:
            return new AccuratyEffect();
        case Effects.Wet:
            return new WetEffect();
        case Effects.Shadow:
            return new ShadowEffet();
        case Effects.RawDamage:
            return new RawDamageEffet();
        default:
            throw new Error(`createEffect ${name} is not implemented`);
    }
}

export class WorldEffect {
    constructor(
        protected tilemap : TileMap,
        protected hero: Hero,
        protected monsters: MonsterCollection,
    ) {}

    monsterAt(pos: Coordinate) {
        return this.monsters.getAt(pos);
    }
    getMapWidth() {
        return this.tilemap.widthM1;
    }
    getMapHeight() {
        return this.tilemap.heightM1;
    }
    tileIsEmpty(pos: Coordinate) {
        return this.tilemap.getAt(pos).isEmpty();
    }
    getHero() {
        return this.hero;
    }
    tileAt(pos: Coordinate) {
        return this.tilemap.getAt(pos);
    }
    map() {
        return this.tilemap.tiles;
    }
    getTilemap() {
        return this.tilemap;
    }
}