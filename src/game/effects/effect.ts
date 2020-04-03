import {TileMap} from '../tilemap/tilemap';
import {Hero} from '../hero/hero';
import {MonsterCollection} from '../monsters/monsterCollection';
import { Coordinate } from '../utils/coordinate';
import { HealEffect, ThicknessEffect } from './effects';
import { microValidator } from '../utils/micro-validator';

export type BuffDefinition = {
    start: Function | null;
    tick?: Function;
    end: Function;
    turns: number
};

export enum Effects {
    Heal = 'heal',
    Stun = 'stun',
    Bleed = 'bleed',
    Const = 'const',
    Invisibility = 'invisibility',
    Swap = 'swap',
    Teleportation = 'teleportation',
    Thick = 'thick',
}

let tilemap: TileMap;
let hero: Hero;
let monsters: MonsterCollection;
let effect: Effect;
export const EffectMaker = {
    set: initEffects,
    create: createEffect
};

function initEffects(args: {tilemap : TileMap, hero: Hero, monsters: MonsterCollection}) {
    tilemap = args.tilemap;
    hero = args.hero;
    monsters = args.monsters;
    effect = new Effect(tilemap, hero, monsters);
}

function createEffect(name: Effects) {
    microValidator([tilemap, hero, monsters], 'createEffect failure: null');
    switch(name) {
        case Effects.Heal:
            return new HealEffect();
        case Effects.Thick:
            return new ThicknessEffect();
        default:
            throw new Error(`createEffect ${name} is not implemented`);
        /*case Effects.Teleportation:
            return new TeleportationEffect(tilemap, hero, monsters);*/
    }
}

export class Effect {
    constructor(
        protected tilemap : TileMap,
        protected hero: Hero,
        protected monsters: MonsterCollection,
    ) {}

    protected monsterAt(pos: Coordinate) {
        return this.monsters.getAt(pos);
    }
    protected getMapWidth() {
        return this.tilemap.widthM1;
    }
    protected getMapHeight() {
        return this.tilemap.heightM1;
    }
    protected tileIsEmpty(pos: Coordinate) {
        return this.tilemap.getAt(pos).isEmpty();
    }
    protected getHero() {
        return this.hero;
    }
    protected tileAt(pos: Coordinate) {
        return this.tilemap.getAt(pos);
    }
    protected map() {
        return this.tilemap.tiles;
    }
}