import { TileMap } from '../../game/tilemap/tilemap';
import { Hero } from '../../game/hero/hero';
import { SpecialPlaces } from '../../game/places/special-places';
import { Game } from '../../game/game';
import { World } from '../../game/effects/world-ctx';
import { microValidator } from '../../utils/micro-validator';
import {
  AsservissementSpell,
  BlinkSpell,
  CleaningEffect,
  FearSpell,
  IdentifiySpell,
  ImproveArmourSpell,
  ImproveWeaponSpell,
  KnowledgeSpell,
  PoisonTrapSpell,
  RealityEventSpell,
  RogueEventSpell,
  RootTrapSpell,
  SacrificeSpell,
  SummonWeakSpell,
  TeleportationSpell,
  TrapSpell,
  UnholySpellBook,
  WeaknessSpell,
  WildFireSpell,
  XPEffect,
} from './spells';
import { createAoESpell } from '../../game/effects/spells';
import { TileTriggerFactory } from '../tile-triggers/tile-trigger-factrory';
import { MapEffect } from '../../world/map/map-effect';
import { MonsterCollection } from '../../game/entitybase/monsters/monsterCollection';

export enum SpellNames {
  SpikeTrap = 'SpikeTrap',
  Teleportation = 'Teleportation',
  EnchantWeapon = 'EnchantWeapon',
  EnchantArmour = 'EnchantArmour',
  Blink = 'Blink',
  Identify = 'Identify',
  Knowledge = 'Knowledge',
  WildFire = 'WildFire',
  Shadow = 'Shadow',
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
  RogueEventSpell = 'RogueEventSpell',
  RealityEventSpell = 'RealityEventSpell',
  Fear = 'Fear',
  Sacrifice = 'Sacrifice',
  AsservissementSpell = 'AsservissementSpell',
  WaterLine = 'WaterLine',
  FireLine = 'FireLine',
  FloralLine = 'FloralLine',
  FloralCloud = 'FloralCloud',
  Weakness = 'Weakness',
  SummonWeak = 'SummonWeak',
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
  microValidator([tilemap, hero, monsters, places], 'createSpell failure: null');
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
      return createAoESpell(world, {
        shapeStrategy: 'around2',
        triggerFactory: () => TileTriggerFactory.shadowZone(10),
        mapEffect: MapEffect.Shadow,
      });
    case SpellNames.ColdCloud:
      return createAoESpell(world, {
        shapeStrategy: 'around',
        triggerFactory: () => TileTriggerFactory.coldZone(10),
        mapEffect: MapEffect.Cold,
      });
    case SpellNames.FireCloud:
      return createAoESpell(world, {
        shapeStrategy: 'around',
        triggerFactory: () => TileTriggerFactory.fireZone(2),
        mapEffect: MapEffect.Fire,
      });
    case SpellNames.RainCloud:
      return createAoESpell(world, {
        shapeStrategy: 'around2',
        triggerFactory: () => TileTriggerFactory.waterZone(15),
        mapEffect: MapEffect.Water,
      });
    case SpellNames.PoisonCloud:
      return createAoESpell(world, {
        shapeStrategy: 'around',
        triggerFactory: () => TileTriggerFactory.poisonZone(10),
        mapEffect: MapEffect.Poison,
      });
    case SpellNames.LightningCloud:
      return createAoESpell(world, {
        shapeStrategy: 'around',
        triggerFactory: () => TileTriggerFactory.lightningZone(10),
        mapEffect: MapEffect.Light,
      });
    case SpellNames.FireLine:
      return createAoESpell(world, {
        shapeStrategy: 'line',
        triggerFactory: () => TileTriggerFactory.fireZone(5),
        mapEffect: MapEffect.Fire,
      });
    case SpellNames.FloralLine:
      return createAoESpell(world, {
        shapeStrategy: 'line',
        triggerFactory: () => TileTriggerFactory.floralZone(25),
        mapEffect: MapEffect.Floral,
      });
    case SpellNames.FloralCloud:
      return createAoESpell(world, {
        shapeStrategy: 'around',
        triggerFactory: () => TileTriggerFactory.floralZone(25),
        mapEffect: MapEffect.Floral,
      });
    case SpellNames.WaterLine:
      return createAoESpell(world, {
        shapeStrategy: 'line',
        triggerFactory: () => TileTriggerFactory.waterZone(15),
        mapEffect: MapEffect.Water,
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
