import { MapEffect } from "../../map/map-effect";
import { Entity } from "../entitybase/entity";
import { Magic } from "../entitybase/magic";
import { randomProc } from "../utils/random";
import { EffectTarget } from "./definitions";
import { FRACTURE_SPELL, SHOCK } from "./effect";
import { createElementalSpell } from "./spells";
import { AgeSpell } from "./spells/age-spell";
import { AsservissementSpell } from "./spells/asservissement-spell";
import { BlinkSpell } from "./spells/blink-spell";
import { DashSpell } from "./spells/dash-spell";
import { FearSpell } from "./spells/fear-spell";
import { FlashbackSpell } from "./spells/flashback-spell";
import { IdentifiySpell } from "./spells/identify-spell";
import { ImproveArmourSpell } from "./spells/improve-armour-spell";
import { ImproveWeaponSpell } from "./spells/improve-weapon-spell";
import { KnowledgeSpell } from "./spells/knowledge-spell";
import { PoisonTrapSpell } from "./spells/poisontrap-spell";
import { RealityEventSpell } from "./spells/reality";
import { RogueEventSpell } from "./spells/rogue";
import { RootTrapSpell } from "./spells/root-trap-spell";
import { SacrificeSpell } from "./spells/sacrifice-spell";
import { SlowSpell } from "./spells/slow-spell";
import { SummonWeakSpell } from "./spells/summon-weak-spell";
import { TeleportationSpell } from "./spells/teleportation-spell";
import { TrapSpell } from "./spells/trap-spell";
import { UnholySpellBook } from "./spells/unholy-spell";
import { WeaknessSpell } from "./spells/weakness-spell";
import { WildFireSpell } from "./spells/wildfire-spell";
import { XPEffect } from "./spells/xp-spell";

export const SpellBook = {
    AgeSpell: () => new AgeSpell(),
    FlashbackSpell: () => new FlashbackSpell(),
    DashSpell: () =>new DashSpell(),
    SlowSpell: () =>new SlowSpell(),
    TrapSpell: () =>new TrapSpell(),
    TeleportationSpell: () =>new TeleportationSpell(),
    ImproveArmourSpell:() => new ImproveArmourSpell(),
    ImproveWeaponSpell: () =>new ImproveWeaponSpell(),
    BlinkSpell: () =>new BlinkSpell(),
    IdentifiySpell:() => new IdentifiySpell(),
    KnowledgeSpell:() => new KnowledgeSpell(),
    WildFireSpell:() => new WildFireSpell(),
    RootTrapSpell:() => new RootTrapSpell(),
    PoisonTrapSpell:() => new PoisonTrapSpell(),
    UnholySpellBook:() => new UnholySpellBook(),
    XPEffect:() => new XPEffect(),
    RogueEventSpell:() => new RogueEventSpell(),
    FearSpell:() => new FearSpell(),
    SacrificeSpell:() => new SacrificeSpell(),
    RealityEventSpell:() => new RealityEventSpell(),
    AsservissementSpell:() => new AsservissementSpell(),
    WeaknessSpell:() => new WeaknessSpell(),
    SummonWeakSpell:() => new SummonWeakSpell(),

    // Custom
    WaterLine:() => createElementalSpell({
        shapeStrategy: 'line',
        type: EffectTarget.Location,
        affect: () => ({
            magic: new Magic({wet: true}),
            turns: 1
        }),
        mapEffect:  MapEffect.Water,
        duration: 40,
    }),
    Fracture:() => createElementalSpell({
        shapeStrategy: 'line',
        type: EffectTarget.Location,
        affect: () => ({
            magic: new Magic({
                onTurn: (me) => me.takeDamage(8, FRACTURE_SPELL)
            }),
            turns: 1
        }),
        mapEffect:  MapEffect.Cold,
        duration: 5,
    }),
    Shadow:() => createElementalSpell({
        shapeStrategy: 'around2',
        type: EffectTarget.Location,
        affect: () => ({
            magic: new Magic({sigth: -4}),
            turns: 1
        }),
        mapEffect:  MapEffect.Shadow,
        duration: 40,
    }),
    ColdCloud:() => createElementalSpell({
        shapeStrategy: 'around',
        type: EffectTarget.Location,
        affect: () => ({
            magic: new Magic({speed: -0.5}),
            turns: 1
        }),
        mapEffect:  MapEffect.Cold,
        duration: 10,
    }),
    FireCloud:() => createElementalSpell({
        shapeStrategy: 'around',
        type: EffectTarget.Location,
        affect: () => ({
            magic: new Magic({burn: true}),
            turns: 2
        }),
        mapEffect:  MapEffect.Fire,
        duration: 10,
    }),
    RainCloud:() => createElementalSpell({
        shapeStrategy: 'around2',
        type: EffectTarget.Location,
        affect: () => ({
            magic: new Magic({wet: true}),
            turns: 1
        }),
        mapEffect:  MapEffect.Water,
        duration: 10,
    }),
    PoisonCloud:() => createElementalSpell({
        shapeStrategy: 'around',
        type: EffectTarget.Location,
        affect: () => ({
            magic: new Magic({poison: true}),
            turns: 5
        }),
        mapEffect:  MapEffect.Poison,
        duration: 10,
    }),
    LightningCloud:() => createElementalSpell({
        shapeStrategy: 'around',
        type: EffectTarget.Location,
        affect: () => ({magic: new Magic({onTurn: (me: Entity) => {
            if (randomProc(10)) {
                me.addBuff({
                    turns: 5,
                    magic: new Magic({stun: true})
                });
            }
            if (me.isWet) {
                me.takeDamage(5, SHOCK);
            }
        }}), turns: 1}),
        mapEffect:  MapEffect.Light,
        duration: 10,
    }),
    FireLine:() => createElementalSpell({
        shapeStrategy: 'line',
        type: EffectTarget.Location,
        affect: () => ({magic: new Magic({onTurn: (me: Entity) => {
            me.addBuff({magic: new Magic({burn: true}), turns: 10})
        }}), turns: 2}),
        mapEffect:  MapEffect.Fire,
        duration: 5,
    }),
    FloralLine:() => createElementalSpell({
        shapeStrategy: 'line',
        type: EffectTarget.Location,
        affect: () => ({
            magic: new Magic({inBushes: true}),
            turns: 1
        }),
        mapEffect:  MapEffect.Floral,
        duration: 40,
    }),
    FloralCloud:() =>  createElementalSpell({
        shapeStrategy: 'around',
        type: EffectTarget.Location,
        affect: () => ({
            magic: new Magic({inBushes: true}),
            turns: 1
        }),
        mapEffect:  MapEffect.Floral,
        duration: 40,
    }),
}