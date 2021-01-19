import { Monster } from "../monsters/monster";
import { Hero } from "../hero/hero";
import { gameBus } from "../../eventBus/game-bus";
import { AGING, BuffDefinition, SACRIFICE, SICKNESS, slowState, weakState, WILDFIRE } from "./effect";
import { MapEffect } from "../../map/map-effect";
import { Coordinate, around } from "../utils/coordinate";


import { BloodFountain } from "../places/places";
import { line } from "../tilemap/sight";
import { effectSet, logPublished, sightUpdated, playerMoved, itemEquiped, heroGainedXp, rogueEvent, endRogueEvent, monsterSpawned, playerHealed } from "../../events";
import { AbstractSpellShell } from "./abstract-spell-shell";
import { Magic } from "../entitybase/magic";
import { EffectTarget } from "./definitions";

interface ElementSpell {
    shapeStrategy: string;
    type: EffectTarget;
    affect: () => BuffDefinition;
    mapEffect: MapEffect;
    duration: number;
}

export class ElementalSpell extends AbstractSpellShell {
    type: EffectTarget;
    strategy: Function;
    init(strategy: Function, builder: ElementSpell) {
        this.type = builder.type;
        this.strategy = strategy;
    }
    cast(pos: Coordinate) {
        this.strategy(pos);
    }
    getWorld() {
        return this.world;
    }
}

export function createElementalSpell (builder: ElementSpell) {
    let strategy;
    let spell = new ElementalSpell();
    let world = spell.getWorld();
    switch (builder.shapeStrategy) {
        case 'around':
            strategy = aroundStrategy(builder)
            break;
        case 'around2':
            strategy = around2Strategy(builder)
            break;
        case 'line': 
            strategy = lineStategy(builder)
            break;
        case 'custom':
            strategy = customStrategy(builder)
            break;
        default: throw new Error('not implemented Spell shape');
    }
    spell.init(strategy, builder);
    return spell;
    function aroundStrategy(builder: ElementSpell) {
        return (pos: Coordinate) => {
            around(pos, 1).forEach(p => {
                const id = world.getTilemap().addTileEffects({
                    debuff: builder.affect,
                    pos: p,
                    duration: builder.duration,
                    stayOnWalk: true,
                    debugId: builder.mapEffect
                });
                if (id !== null) {
                    gameBus.publish(effectSet({
                        id: id,
                        type: builder.mapEffect,
                        pos: p,
                        animation: 'static'
                    }));
                }
            });
        }
    }
    function around2Strategy(builder: ElementSpell) {
        return (pos: Coordinate) => {
            around(pos, 2).forEach(p => {
                const id = world.getTilemap().addTileEffects({
                    debuff: builder.affect,
                    pos: p,
                    duration: builder.duration,
                    stayOnWalk: true,
                    debugId: builder.mapEffect
                });
                if (id !== null) {
                    gameBus.publish(effectSet({
                        id: id,
                        type: builder.mapEffect,
                        pos: p,
                        animation: 'static'
                    }));
                }
            });
        }
    }
    function lineStategy(builder: ElementSpell) {
        return (pos: Coordinate) => {
            const l: Coordinate[] = line({from: world.getHero().pos, to: pos});
            l.shift();
            l.forEach((p: Coordinate) => {
                const id = world.getTilemap().addTileEffects({
                    debuff: builder.affect,
                    pos: p,
                    duration: builder.duration,
                    stayOnWalk: true,
                    debugId: builder.mapEffect
                });
                if (id !== null) {
                    gameBus.publish(effectSet({
                        id: id,
                        type: builder.mapEffect,
                        pos: p,
                        animation: 'static'
                    }));
                }
            });
        }
    }
    function customStrategy(builder: ElementSpell) {
        return (pos: Coordinate) => {
            const l: Coordinate[] = line({from: world.getHero().pos, to: pos});
            l.shift();
            l.forEach((p: Coordinate) => {
                const id = world.getTilemap().addTileEffects({
                    debuff: builder.affect,
                    pos: p,
                    duration: builder.duration,
                    stayOnWalk: true,
                    debugId: builder.mapEffect
                });
                if (id !== null) {
                    gameBus.publish(effectSet({
                        id: id,
                        type: builder.mapEffect,
                        pos: p,
                        animation: 'static'
                    }));
                }
            });
        }
    }
}