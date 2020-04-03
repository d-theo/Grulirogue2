import {TileMap} from '../tilemap/tilemap';
import {Hero} from '../hero/hero';
import {MonsterCollection} from '../monsters/monsterCollection';
import { Coordinate } from '../utils/coordinate';
import { HealEffect, ThicknessEffect, TeleportationEffect, CleaningEffect, StunEffect, DodgeEffect, XPEffect, BleedEffect, PoisonEffect, StupidityEffect, SwapEffect, SpeedEffect, RageEffect, AccuratyEffect } from './effects';
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
    Swap = 'Swap',
    Teleportation = 'Teleportation',
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
}

let tilemap: TileMap;
let hero: Hero;
let monsters: MonsterCollection;
let effect: WorldEffect;
export const EffectMaker = {
    set: initEffects,
    create: createEffect
};

function initEffects(args: {tilemap : TileMap, hero: Hero, monsters: MonsterCollection}) {
    tilemap = args.tilemap;
    hero = args.hero;
    monsters = args.monsters;
    effect = new WorldEffect(tilemap, hero, monsters);
}

function createEffect(name: Effects) {
    microValidator([tilemap, hero, monsters], 'createEffect failure: null');
    switch(name) {
        case Effects.Heal:
            return new HealEffect();
        case Effects.Thick:
            return new ThicknessEffect();
        case Effects.Teleportation:
            return new TeleportationEffect(effect);
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
        case Effects.Swap:
            return new SwapEffect();
        case Effects.Speed:
            return new SpeedEffect();
        case Effects.Rage:
            return new RageEffect();
        case Effects.Accuraty:
            return new AccuratyEffect();
        default:
            throw new Error(`createEffect ${name} is not implemented`);
        /*case Effects.Teleportation:
            return new TeleportationEffect(tilemap, hero, monsters);*/
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
}