import { TileMap } from "../tilemap/tilemap";
import { Hero } from "../hero/hero";
import { MonsterCollection } from "../monsters/monsterCollection";
import { Coordinate, around, equalsCoordinate } from "../utils/coordinate";
import { microValidator } from "../utils/micro-validator";
import { SpecialPlaces } from "../places/special-places";
import {
  TrapSpell,
  TeleportationSpell,
  ImproveArmourSpell,
  ImproveWeaponSpell,
  BlinkSpell,
  IdentifiySpell,
  KnowledgeSpell,
  WildFireSpell,
  PoisonTrapSpell,
  UnholySpellBook,
  CleaningEffect,
  XPEffect,
  RogueEventSpell,
  FearSpell,
  SacrificeSpell,
  RealityEventSpell,
  AsservissementSpell,
  createElementalSpell,
  EffectTarget,
  RootTrapSpell,
  WeaknessSpell,
  SummonWeakSpell,
} from "./spells";
import { Game } from "../game";
import { Monster } from "../monsters/monster";
import { MapEffect } from "../../world/map/map-effect";
import { Conditions } from "../../content/conditions/conditions";

/*
export type BuffDefinition = {
    start: Function | null;
    tick?: Function;
    end: Function;
    turns: number,
    isStackable: boolean,
    isTemp: boolean,
    tags: string,
    source?: string|null;
};*/

export enum SpellNames {
  SpikeTrap = "SpikeTrap",
  Teleportation = "Teleportation",
  EnchantWeapon = "EnchantWeapon",
  EnchantArmour = "EnchantArmour",
  Blink = "Blink",
  Identify = "Identify",
  Knowledge = "Knowledge",
  WildFire = "WildFire",
  Shadow = "Shadow",
  RootTrap = "RootTrap",
  PoisonTrap = "PoisonTrap",
  PoisonCloud = "PoisonCloud",
  ColdCloud = "ColdCloud",
  RainCloud = "RainCloud",
  FireCloud = "FireCloud",
  LightningCloud = "LightningCloud",
  UnholySpell = "UnholySpell",
  CleaningSpell = "CleaningSpell",
  XPSpell = "XPSpell",
  RogueEventSpell = "RogueEventSpell",
  RealityEventSpell = "RealityEventSpell",
  Fear = "Fear",
  Sacrifice = "Sacrifice",
  AsservissementSpell = "AsservissementSpell",
  WaterLine = "WaterLine",
  FireLine = "FireLine",
  FloralLine = "FloralLine",
  FloralCloud = "FloralCloud",
  Weakness = "Weakness",
  SummonWeak = "SummonWeak",
}

let tilemap: TileMap;
let hero: Hero;
let monsters: MonsterCollection;
let world: World;
let places: SpecialPlaces;
export const SpellMaker = {
  set: initWorld,
  createSpell: createSpell,
};

function initWorld(game: Game) {
  tilemap = game.tilemap;
  hero = game.hero;
  monsters = game.monsters;
  places = game.places;
  world = new World(tilemap, hero, monsters, places, game);
}

function createSpell(name: SpellNames) {
  microValidator(
    [tilemap, hero, monsters, places],
    "createSpell failure: null"
  );
  switch (name) {
    case SpellNames.SpikeTrap:
      return new TrapSpell(world);
    case SpellNames.Teleportation:
      return new TeleportationSpell(world);
    case SpellNames.EnchantArmour:
      return new ImproveArmourSpell(world);
    case SpellNames.EnchantWeapon:
      return new ImproveWeaponSpell(world);
    case SpellNames.Blink:
      return new BlinkSpell(world);
    case SpellNames.Identify:
      return new IdentifiySpell();
    case SpellNames.Knowledge:
      return new KnowledgeSpell(world);
    case SpellNames.WildFire:
      return new WildFireSpell(world);
    case SpellNames.RootTrap:
      return new RootTrapSpell(world);
    case SpellNames.Shadow:
      return createElementalSpell(world, {
        shapeStrategy: "around2",
        type: EffectTarget.Location,
        spell: () => new Affect("blind").params(7).create(),
        mapEffect: MapEffect.Shadow,
        duration: 40,
      });
    case SpellNames.ColdCloud:
      return createElementalSpell(world, {
        shapeStrategy: "around",
        type: EffectTarget.Location,
        spell: () => new Affect("cold").create(),
        mapEffect: MapEffect.Cold,
        duration: 10,
      });
    case SpellNames.FireCloud:
      return createElementalSpell(world, {
        shapeStrategy: "around",
        type: EffectTarget.Location,
        spell: () => new Affect("fire").turns(2).create(),
        mapEffect: MapEffect.Fire,
        duration: 10,
      });
    case SpellNames.RainCloud:
      return createElementalSpell(world, {
        shapeStrategy: "around2",
        type: EffectTarget.Location,
        spell: () => new Affect("wet").create(),
        mapEffect: MapEffect.Water,
        duration: 10,
      });
    case SpellNames.PoisonCloud:
      return createElementalSpell(world, {
        shapeStrategy: "around",
        type: EffectTarget.Location,
        spell: () => new Affect("poison").turns(5).create(),
        mapEffect: MapEffect.Poison,
        duration: 10,
      });
    case SpellNames.LightningCloud:
      return createElementalSpell(world, {
        shapeStrategy: "around",
        type: EffectTarget.Location,
        spell: () => new Affect("shock").create(),
        mapEffect: MapEffect.Light,
        duration: 10,
      });
    case SpellNames.FireLine:
      return createElementalSpell(world, {
        shapeStrategy: "line",
        type: EffectTarget.Location,
        spell: () => new Affect("fire").turns(2).create(),
        mapEffect: MapEffect.Fire,
        duration: 5,
      });
    case SpellNames.FloralLine:
      return createElementalSpell(world, {
        shapeStrategy: "line",
        type: EffectTarget.Location,
        spell: () => new Affect("floral").create(),
        mapEffect: MapEffect.Floral,
        duration: 40,
      });
    case SpellNames.FloralCloud:
      return createElementalSpell(world, {
        shapeStrategy: "around",
        type: EffectTarget.Location,
        spell: () => new Affect("floral").create(),
        mapEffect: MapEffect.Floral,
        duration: 40,
      });
    case SpellNames.WaterLine:
      return createElementalSpell(world, {
        shapeStrategy: "line",
        type: EffectTarget.Location,
        spell: () => Conditions.wet(),
        mapEffect: MapEffect.Water,
        duration: 40,
      });
    case SpellNames.PoisonTrap:
      return new PoisonTrapSpell(world);
    case SpellNames.UnholySpell:
      return new UnholySpellBook(world);
    case SpellNames.XPSpell:
      return new XPEffect();
    case SpellNames.CleaningSpell:
      return new CleaningEffect();
    case SpellNames.RogueEventSpell:
      return new RogueEventSpell();
    case SpellNames.Fear:
      return new FearSpell(world);
    case SpellNames.Sacrifice:
      return new SacrificeSpell(world);
    case SpellNames.RealityEventSpell:
      return new RealityEventSpell();
    case SpellNames.AsservissementSpell:
      return new AsservissementSpell();
    case SpellNames.Weakness:
      return new WeaknessSpell(world);
    case SpellNames.SummonWeak:
      return new SummonWeakSpell(world);
    default:
      throw new Error(`${name} spell not impl`);
  }
}

export class World {
  constructor(
    protected tilemap: TileMap,
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

  nearestEmptyTileFrom(pos: Coordinate) {
    let i = 1;
    let found = false;
    while (!found) {
      const positions = around(pos, i);
      for (const p of positions) {
        const isEmpty = this.tilemap.getAt(p).isEmpty();
        const noEnemy = this.monsters.getAt(p) === null;
        if (isEmpty && noEnemy && !equalsCoordinate(pos, p)) {
          return p;
        }
      }
      i++;
    }
  }

  addMonster(m: Monster) {
    this.monsters.monstersArray().push(m);
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
