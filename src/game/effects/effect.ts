import {TileMap} from '../tilemap/tilemap';
import {Hero} from '../hero/hero';
import {MonsterCollection} from '../monsters/monsterCollection';
import { Coordinate } from '../utils/coordinate';
import { microValidator } from '../utils/micro-validator';
import { SpecialPlaces } from '../places/special-places';
import { TrapSpell, TeleportationSpell, ImproveArmourSpell, ImproveWeaponSpell, BlinkSpell, IdentifiySpell, KnowledgeSpell, WildFireSpell, ShadowSpell, RootTrapSpell, ColdCloudSpell, FireCloudSpell, RainCloudSpell, PoisonCloudSpell, LightningSpell, PoisonTrapSpell, UnholySpellBook, CleaningEffect, XPEffect, RogueEventSpell, FearSpell, SacrificeSpell, RealityEventSpell, AsservissementSpell } from './spells';
import { Game } from '../game';

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
        case SpellNames.Shadow:
            return new ShadowSpell(effect);
        case SpellNames.RootTrap:
            return new RootTrapSpell(effect);
        case SpellNames.ColdCloud:
            return new ColdCloudSpell(effect);
        case SpellNames.FireCloud:
            return new FireCloudSpell(effect);
        case SpellNames.RainCloud:
            return new RainCloudSpell(effect);
        case SpellNames.PoisonCloud:
            return new PoisonCloudSpell(effect);
        case SpellNames.LightningCloud:
            return new LightningSpell(effect);
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