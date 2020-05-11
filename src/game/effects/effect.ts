import {TileMap} from '../tilemap/tilemap';
import {Hero} from '../hero/hero';
import {MonsterCollection} from '../monsters/monsterCollection';
import { Coordinate } from '../utils/coordinate';
import { microValidator } from '../utils/micro-validator';
import { SpecialPlaces } from '../places/special-places';
import { TrapSpell, TeleportationSpell, ImproveArmourSpell, ImproveWeaponSpell, BlinkSpell, IdentifiySpell, KnowledgeSpell, WildFireSpell, PoisonTrapSpell, UnholySpellBook, CleaningEffect, XPEffect, RogueEventSpell, FearSpell, SacrificeSpell, RealityEventSpell, AsservissementSpell, createElementalSpell, EffectTarget, RootTrapSpell } from './spells';
import { Game } from '../game';
import { Affect } from './affects';
import { MapEffect } from '../../map/map-effect';

export type BuffDefinition = {
    start: Function | null;
    tick?: Function;
    end: Function;
    turns: number,
    isStackable: boolean,
    isTemp: boolean,
    tags: string,
    source?: string|null;
};

export enum SpellNames {
    SpikeTrap = 'SpikeTrap',
    Teleportation = "Teleportation",
    EnchantWeapon = "EnchantWeapon",
    EnchantArmour = "EnchantArmour",
    Blink = "Blink",
    Identify = "Identify",
    Knowledge = "Knowledge",
    WildFire = 'WildFire',
    Shadow = "Shadow",
    RootTrap = 'RootTrap',
    PoisonTrap = 'PoisonTrap',
    PoisonCloud = 'PoisonCloud',
    ColdCloud = 'ColdCloud',
    RainCloud = 'RainCloud',
    FireCloud = 'FireCloud',
    LightningCloud = 'LightningCloud',
    UnholySpell = 'UnholySpell',
    CleaningSpell = 'CleaningSpell',
    XPSpell = 'XPSpell',
    RogueEventSpell = "RogueEventSpell",
    RealityEventSpell = 'RealityEventSpell',
    Fear = 'Fear',
    Sacrifice = 'Sacrifice',
    AsservissementSpell = 'AsservissementSpell',
    WaterLine = 'WaterLine',
    FireLine = 'FireLine'
}

let tilemap: TileMap;
let hero: Hero;
let monsters: MonsterCollection;
let effect: WorldEffect;
let places: SpecialPlaces;
export const EffectMaker = {
    set: initEffects,
    createSpell: createSpell
};

function initEffects(game: Game) {
    tilemap = game.tilemap;
    hero = game.hero;
    monsters = game.monsters;
    places = game.places;
    effect = new WorldEffect(tilemap, hero, monsters, places, game);
}

function createSpell(name: SpellNames) {
    microValidator([tilemap, hero, monsters, places], 'createSpell failure: null');
    switch(name) {
        case SpellNames.SpikeTrap: 
            return new TrapSpell(effect);
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
        case SpellNames.RootTrap:
            return new RootTrapSpell(effect);
        case SpellNames.Shadow:
            return createElementalSpell(effect, {
                shapeStrategy: 'around',
                type: EffectTarget.Location,
                affect: new Affect('blind').params(7).create(),
                mapEffect:  MapEffect.Shadow,
                duration: 40,
            });
        case SpellNames.ColdCloud:
            return createElementalSpell(effect, {
                shapeStrategy: 'around',
                type: EffectTarget.Location,
                affect: new Affect('cold').create(),
                mapEffect:  MapEffect.Cold,
                duration: 10,
            });
        case SpellNames.FireCloud:
            return createElementalSpell(effect, {
                shapeStrategy: 'around',
                type: EffectTarget.Location,
                affect: new Affect('fire').turns(2).create(),
                mapEffect:  MapEffect.Fire,
                duration: 10,
            });
        case SpellNames.RainCloud:
            return createElementalSpell(effect, {
                shapeStrategy: 'around2',
                type: EffectTarget.Location,
                affect: new Affect('wet').create(),
                mapEffect:  MapEffect.Water,
                duration: 10,
            });
        case SpellNames.PoisonCloud:
            return createElementalSpell(effect, {
                shapeStrategy: 'around',
                type: EffectTarget.Location,
                affect: new Affect('poison').turns(5).create(),
                mapEffect:  MapEffect.Poison,
                duration: 10,
            });
        case SpellNames.LightningCloud:
            return createElementalSpell(effect, {
                shapeStrategy: 'around',
                type: EffectTarget.Location,
                affect: new Affect('shock').create(),
                mapEffect:  MapEffect.Light,
                duration: 10,
            });
        case SpellNames.FireLine:
            return createElementalSpell(effect, {
                shapeStrategy: 'line',
                type: EffectTarget.Location,
                affect: new Affect('fire').turns(2).create(),
                mapEffect:  MapEffect.Fire,
                duration: 5,
            });
        case SpellNames.WaterLine:
            return createElementalSpell(effect, {
                shapeStrategy: 'line',
                type: EffectTarget.Location,
                affect: new Affect('wet').create(),
                mapEffect:  MapEffect.Water,
                duration: 5,
            });
        case SpellNames.PoisonTrap:
            return new PoisonTrapSpell(effect);
        case SpellNames.UnholySpell:
            return new UnholySpellBook(effect);
        case SpellNames.XPSpell:
            return new XPEffect();
        case SpellNames.CleaningSpell:
            return new CleaningEffect;
        case SpellNames.RogueEventSpell:
            return new RogueEventSpell();
        case SpellNames.Fear:
            return new FearSpell(effect);
        case SpellNames.Sacrifice:
            return new SacrificeSpell(effect);
        case SpellNames.RealityEventSpell:
            return new RealityEventSpell();
        case SpellNames.AsservissementSpell:
            return new AsservissementSpell();
        default:
            throw new Error(`${name} spell not impl`);
    }
}

export class WorldEffect {
    constructor(
        protected tilemap : TileMap,
        protected hero: Hero,
        protected monsters: MonsterCollection,
        protected places: SpecialPlaces,
        protected game: Game
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
    getPlaces() {
        return this.places;
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
    getNearestAttackables() {
        return this.game.getNearestAttackables();
    }
}