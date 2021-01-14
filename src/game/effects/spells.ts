import { Monster } from "../monsters/monster";
import { Hero } from "../hero/hero";
import { gameBus } from "../../eventBus/game-bus";
import { GameRange } from "../utils/range";
import { WorldEffect, BuffDefinition } from "./effect";
import { MapEffect } from "../../map/map-effect";
import { Coordinate, around } from "../utils/coordinate";
import { Item } from "../entitybase/item";
import { matrixForEach } from "../utils/matrix";
import { Tile, TileVisibility } from "../tilemap/tile";
import { Armour } from "../items/armour";
import { Weapon } from "../items/weapon";
import { BloodFountain } from "../places/places";
import { Affect } from "./affects";
import { line } from "../tilemap/sight";
import { DamageResolution } from "../fight/damages";
import { effectSet, logPublished, sightUpdated, playerMoved, itemEquiped, heroGainedXp, rogueEvent, endRogueEvent, monsterSpawned, playerHealed } from "../../events";
import { Bestiaire } from "../monsters/bestiaire";
import { sightHasChanged } from "../../events/sight-has-changed";
import { AbstractSpellShell } from "./abstract-spell-shell";
import { SpellBook } from "./spell-book";

export enum EffectTarget { 
    Location = 'location',
    AoE = 'AoE',
    Armour =  'armour',
    Item = 'item',
    Weapon = 'weapon',
    Movable = 'movable',
    Hero = 'hero',
    None = '',
};

export interface IEffect {
    type: EffectTarget;
    cast: Function;
    turns?: number;
}

export class TrapSpell extends AbstractSpellShell {
    type = EffectTarget.Location;
    
    cast(pos: Coordinate) {
        const bleed = new Affect('bleed').turns(3).create();
        const id = this.world.getTilemap().addTileEffects({
            debuff: () => bleed,
            pos,
            duration: 1,
            stayOnWalk: false,
            debugId: "TrapSpell",
        });
        if (id !== null) {
            gameBus.publish(effectSet({
                animation: 'static',
                id: id,
                type: MapEffect.Spike,
                pos
            }));
        }
        gameBus.publish(logPublished({data: `trap has been set`}));
    }
}

export class RootTrapSpell extends AbstractSpellShell {
    type = EffectTarget.Location;

    cast() {
        const id = this.world.getTilemap().addTileEffects({
            debuff: () => new Affect('stun').turns(5).create(),
            pos: this.world.getHero().pos,
            duration: 1,
            stayOnWalk: false,
            debugId: "RootTrapSpell",
        });
        gameBus.publish(effectSet({
            animation: 'static',
            id: id,
            type: MapEffect.Root,
            pos: this.world.getHero().pos
        }));
        
        gameBus.publish(logPublished({data: `trap has been set`}));
    }
}

export class PoisonTrapSpell extends AbstractSpellShell {
    type = EffectTarget.Location;

    cast() {
        const pos = this.world.getHero().pos;
        const poison = new Affect('poison')
            .turns(3)
            .create();
        const id = this.world.getTilemap().addTileEffects({
            debuff: () => poison,
            pos,
            duration: 1,
            stayOnWalk: false,
            debugId: "PoisonTrapSpell",
        });
        gameBus.publish(effectSet({
            animation: 'static',
            id: id,
            type: MapEffect.PoisonTrap,
            pos
        }));
        
        gameBus.publish(logPublished({data: `trap has been set`}));
    }
}

export class WildFireSpell extends AbstractSpellShell {
    type = EffectTarget.Location;
    area = 1;

    cast(pos: Coordinate) {
        around(pos, 1).forEach(p => {
            const dmg = new Affect('damage').params(0.5,'4-6','wild fire').create(); // FIXME
            const id = this.world.getTilemap().addTileEffects({
                debuff: () => dmg,
                pos: p,
                duration: 10,
                stayOnWalk: true,
                debugId: "WildFireSpell"
            });
            if (id !== null) {
                gameBus.publish(effectSet({
                    id: id,
                    type: MapEffect.Fire,
                    pos: p,
                    animation: 'static'
                }));
            }
        });
    }
}

export class UnholySpellBook extends AbstractSpellShell {
    type = EffectTarget.None;
    turns = 1;

    cast() {
        const hpos = this.world.getHero().pos;
        const place = this.world.getPlaces().getAt(hpos);

        if (place != null && place instanceof BloodFountain) {
            gameBus.publish(logPublished({level: 'warning', data: `The blood inside the fountain is bubbling !!`}));
            place.cursed = false;
        } else {
            new DamageResolution(null, this.world.getHero(), 1, 'sickness');
            gameBus.publish(logPublished({level: 'warning', data: `Reading this book is making you nauseous`}));
        }
    }
}

export class IdentifiySpell extends AbstractSpellShell {
    type = EffectTarget.Item;

    cast(item: Item) {
        item.reveal();
        gameBus.publish(logPublished({level: 'success', data: `You identify a ${item.name}`}));
    }
}

export class KnowledgeSpell extends AbstractSpellShell {
    type = EffectTarget.None;

    cast() {
        matrixForEach<Tile>(this.world.getTilemap().tiles, (t: Tile) => {
            t.viewed = true;
            if (t.visibility !== TileVisibility.OnSight) t.setObscurity();
        });
        gameBus.publish(logPublished({level: 'success', data:'Yee see everything !'}));
        gameBus.publish(sightUpdated({}));
    }
}
export class TeleportationSpell extends AbstractSpellShell  {
    type = EffectTarget.Movable;

    cast(target: Hero|Monster) {
        let done = false;
        const rX = new GameRange(0, this.world.getMapWidth());
        const rY = new GameRange(0, this.world.getMapHeight());
        while(!done) {
            const pos = {
                x: rX.pick(),
                y: rY.pick()
            };
            if (this.world.tileIsEmpty(pos) && this.world.monsterAt(pos) == null) {
                done = true;
                target.pos = pos;
            }
        }
    }
}

export class BlinkSpell extends AbstractSpellShell  {
    type = EffectTarget.Location;

    cast(target: Coordinate) {
        this.world.getHero().pos = target;
        gameBus.publish(playerMoved({}));
    }
}
export class DashSpell extends AbstractSpellShell {
    type = EffectTarget.Location;

    cast(target: Coordinate) {
        const l = line({from: this.world.getHero().pos, to: target});
        const n = Math.min(4, l.length);
        for (let i = 1; i < n; i ++) {
            const pos = l[i];
            if (this.world.monsterAt(pos) != null || !this.world.tileIsEmpty(pos)) {
                this.world.getHero().pos = l[i - i];
                gameBus.publish(playerMoved({}));
                return;
            }
        }
        this.world.getHero().pos = l[n-1];
        gameBus.publish(playerMoved({}));
    }
}

export class ImproveArmourSpell extends AbstractSpellShell  {
    type = EffectTarget.Armour;

    cast(target: Armour) {
        target.addAbsorbEnchant(1);
        gameBus.publish(logPublished({data: `Your ${target.name} glows magically for a moment.`}));
        gameBus.publish(itemEquiped({armour: this.world.getHero().armour}))
    }
}
export class ImproveWeaponSpell extends AbstractSpellShell  {
    type = EffectTarget.Weapon;

    cast(target: Weapon) {
        target.modifyAdditionnalDmg(+1);
        gameBus.publish(logPublished({data: `Your ${target.name} glows magically for a moment.`}));
        gameBus.publish(itemEquiped({weapon: this.world.getHero().weapon}))
    }
}

export class WeaknessSpell extends AbstractSpellShell  {
    type = EffectTarget.Movable;

    cast(t: Hero|Monster) {
        new Affect('weak').turns(15).target(t).cast();
    }
}
export class AgeSpell extends AbstractSpellShell  {
    type = EffectTarget.Movable;
    cast(t: Hero|Monster) {
        const halfCurr = t.health.currentHp / 2;
        new DamageResolution(null, t, halfCurr, 'fast aging');
    }
}
export class FlashbackSpell extends AbstractSpellShell  {
    type = EffectTarget.Hero;

    cast() {
        const state = this.world.getHero().pastStates[0];
        this.world.getHero().pos = state.pos;
        this.world.getHero().health.currentHp = state.hp;
        gameBus.publish(playerMoved({}));
        gameBus.publish(sightHasChanged({}));
        gameBus.publish(playerHealed({baseHp:this.world.getHero().health.baseHp, currentHp: state.hp}));
    }
}
export class SlowSpell extends AbstractSpellShell {
    type = EffectTarget.Movable;
    cast(t: Hero|Monster) {
        new Affect('slow').turns(15).target(t).cast();
    }
}
export class SummonWeakSpell extends AbstractSpellShell  {
    type = EffectTarget.None;

    cast() {
        const pos = this.world.getHero().pos;
        const mobs = [Bestiaire.Greece.Bat, Bestiaire.Greece.Rat, Bestiaire.Greece.Rat];
        for (let i = 0; i < 3; i++) {
            const posMob = this.world.nearestEmptyTileFrom(pos);
            const friend = Monster
                .makeMonster({...mobs[i], pos: {x: posMob.x, y: posMob.y}})
                .setAligment('good');
            this.world.addMonster(friend);
            gameBus.publish(monsterSpawned({monster: friend}));
        }
    }
}

/// SHOULD BE SPELLS
export class CleaningEffect extends AbstractSpellShell {
    type = EffectTarget.Movable;
    cast(target: Hero|Monster) {
        target.buffs.cleanBuff();
        target.enchants.clean();
        gameBus.publish(logPublished({level: 'success', data:`${target.name} looks purified`}));
    }
}

export class XPEffect extends AbstractSpellShell {
    type = EffectTarget.Movable;
    cast(target: Hero | Monster) {
        if (target instanceof Hero) {
            gameBus.publish(heroGainedXp({
                amount: 999999
            }));
            gameBus.publish(logPublished({level: 'success', data:'you are wiser !'}));
        } else {
            gameBus.publish(logPublished({data:'nothing happens'}));
        }
    }
}

export class RogueEventSpell extends AbstractSpellShell {
    type = EffectTarget.None;
    cast() {
        gameBus.publish(rogueEvent({}));
        gameBus.publish(logPublished({level: 'danger', data:'where the heck are you ?!'}));
    }
}
export class RealityEventSpell extends AbstractSpellShell {
    type = EffectTarget.None;
    cast() {
        gameBus.publish(endRogueEvent({}));
        gameBus.publish(logPublished({level: 'success', data:'Yeah, back to the quest !'}));
    }
}

export class FearSpell extends AbstractSpellShell {
    type = EffectTarget.None;

    cast() {
        const mobs = this.world.getNearestAttackables();
        mobs.forEach(m => {
            new Affect('fear').turns(10).target(m).cast();
        });
    }
}

export class SacrificeSpell extends AbstractSpellShell {
    type = EffectTarget.Movable;

    cast(t: Hero|Monster) {
        const hero = this.world.getHero();
        const sacrifice = Math.floor(hero.health.baseHp * 0.25);
        const curse = Math.floor(t.health.baseHp * 0.5);
        const target = t;
        hero.health.getWeakerByHp(sacrifice);
        target.health.getWeakerByHp(curse);
        gameBus.publish(logPublished({level: 'danger', data: `You used a forbidden blood magic, hoping this sacrifice is worth the price...`}));
        new DamageResolution(null, t, curse, 'sacrifice');
        new DamageResolution(null, hero, sacrifice, 'sacrifice');
    }
}
export class AsservissementSpell extends AbstractSpellShell {
    type = EffectTarget.Movable;
    cast(target: Hero | Monster) {
        if (target instanceof Hero) {
            gameBus.publish(logPublished({data: `You cannot do that`}));
            return;
        }

        target.setAligment('good');
    }
}

interface ElementSpell {
    shapeStrategy: string;
    type: EffectTarget;
    affect: () => BuffDefinition;
    mapEffect: MapEffect;
    duration: number;
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