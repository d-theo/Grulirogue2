import { Monster } from "../monsters/monster";
import { Hero } from "../hero/hero";
import { gameBus, logPublished, playerTookDammage, effectSet, playerMoved, itemEquiped, sightUpdated, heroGainedXp } from "../../eventBus/game-bus";
import { GameRange } from "../utils/range";
import { WorldEffect, EffectMaker } from "./effect";
import { handleHealthReport } from "../use-cases/health-report";
import { MapEffect } from "../../map/map-effect";
import { Coordinate, around } from "../utils/coordinate";
import { Item } from "../entitybase/item";
import { matrixForEach } from "../utils/matrix";
import { Tile, TileVisibility } from "../tilemap/tile";
import { Armour } from "../items/armour";
import { Weapon } from "../items/weapon";
import { BloodFountain } from "../places/places";
import { Affect } from "./affects";

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

export class TrapSpell implements IEffect {
    type = EffectTarget.Location;
    constructor(private readonly world: WorldEffect) {}
    cast(pos: Coordinate) {
        const bleed = new Affect('bleed').turns(3).create();
        const id = this.world.getTilemap().addTileEffects({
            debuff: bleed,
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

export class RootTrapSpell implements IEffect {
    type = EffectTarget.Location;
    constructor(private readonly world: WorldEffect) {}
    cast() {
        const id = this.world.getTilemap().addTileEffects({
            debuff: new Affect('stun').turns(5).create(),
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

export class PoisonTrapSpell implements IEffect {
    type = EffectTarget.Location;
    constructor(private readonly world: WorldEffect) {}
    cast() {
        const pos = this.world.getHero().pos;
        const poison = new Affect('poison')
            .turns(3)
            .create();
        const id = this.world.getTilemap().addTileEffects({
            debuff: poison,
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

export class WildFireSpell implements IEffect {
    type = EffectTarget.Location;
    area = 1;
    constructor(private readonly world: WorldEffect) {}
    cast(pos: Coordinate) {
        around(pos, 1).forEach(p => {
            const dmg = new Affect('damage').params(0.5,'4-6','wild fire').create(); // FIXME
            const id = this.world.getTilemap().addTileEffects({
                debuff: dmg,
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

export class LightningSpell implements IEffect {
    type = EffectTarget.Location;
    area = 1;
    constructor(private readonly world: WorldEffect) {}
    cast(pos: Coordinate) {
        around(pos, 1).forEach(p => {
            const id = this.world.getTilemap().addTileEffects({
                debuff: new Affect('shock').create(),
                pos: p,
                duration: 10,
                stayOnWalk: true,
                debugId: "LightningSpell"
            });
            if (id !== null) {
                gameBus.publish(effectSet({
                    id: id,
                    type: MapEffect.Light,
                    pos: p,
                    animation: 'static'
                }));
            }
        });
    }
}

export class PoisonCloudSpell implements IEffect {
    type = EffectTarget.Location;
    area = 1;
    constructor(private readonly world: WorldEffect) {}
    cast(pos: Coordinate) {
        around(pos, 1).forEach(p => {
            const id = this.world.getTilemap().addTileEffects({
                debuff: new Affect('poison').turns(5).create(),
                pos: p,
                duration: 10,
                stayOnWalk: true,
                debugId: "PoisonCloudSpell"
            });
            if (id !== null) {
                gameBus.publish(effectSet({
                    id: id,
                    type: MapEffect.Poison,
                    pos: p,
                    animation: 'static'
                }));
            }
        });
    }
}

export class ColdCloudSpell implements IEffect {
    type = EffectTarget.Location;
    area = 1;
    constructor(private readonly world: WorldEffect) {}
    cast(pos: Coordinate) {
        around(pos, 1).forEach(p => {
            const id = this.world.getTilemap().addTileEffects({
                debuff: new Affect('cold').create(),
                pos: p,
                duration: 10,
                stayOnWalk: true,
                debugId: "ColdCloudSpell"
            });
            if (id !== null) {
                gameBus.publish(effectSet({
                    id: id,
                    type: MapEffect.Cold,
                    pos: p,
                    animation: 'static'
                }));
            }
        });
    }
}

export class RainCloudSpell implements IEffect {
    type = EffectTarget.Location;
    area = 1;
    constructor(private readonly world: WorldEffect) {}
    cast(pos: Coordinate) {
        around(pos, 2).forEach(p => {
            const id = this.world.getTilemap().addTileEffects({
                debuff: new Affect('wet').create(),
                pos: p,
                duration: 10,
                stayOnWalk: true,
                debugId: "RainCloudSpell"
            });
            if (id !== null) {
                gameBus.publish(effectSet({
                    id: id,
                    type: MapEffect.Water,
                    pos: p,
                    animation: 'static'
                }));
            }
        });
    }
}

export class FireCloudSpell implements IEffect {
    type = EffectTarget.Location;
    area = 1;
    constructor(private readonly world: WorldEffect) {}
    cast(pos: Coordinate) {
        around(pos, 1).forEach(p => {
            const id = this.world.getTilemap().addTileEffects({
                debuff: new Affect('fire').create(),
                pos: p,
                duration: 10,
                stayOnWalk: true,
                debugId: "FireCloudSpell"
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

export class ShadowSpell implements IEffect {
    type = EffectTarget.Location;
    area = 2;
    constructor(private readonly world: WorldEffect) {}
    cast(pos: Coordinate) {
        around(pos, 2).forEach(p => {
            const id = this.world.getTilemap().addTileEffects({
                debuff: new Affect('blind').params(7).create(),
                pos: p,
                duration: 40,
                stayOnWalk: true,
                debugId: "ShadowSpell"
            });
            if (id !== null) {
                gameBus.publish(effectSet({
                    id: id,
                    type: MapEffect.Shadow,
                    pos: p,
                    animation: 'static'
                }));
            }
        });
    }
}

export class UnholySpellBook implements IEffect {
    type = EffectTarget.None;
    turns = 1;
    constructor(private world: WorldEffect){}
    cast() {
        const hpos = this.world.getHero().pos;
        const place = this.world.getPlaces().getAt(hpos);

        if (place != null && place instanceof BloodFountain) {
            gameBus.publish(logPublished({level: 'warning', data: `The blood inside the fountain is bubbling !!`}));
            place.cursed = false;
        } else {
            doDamages(1, this.world.getHero(), 'sickness');
            gameBus.publish(logPublished({level: 'warning', data: `Reading this book is making you nauseous`}));
        }
    }
}

export class IdentifiySpell implements IEffect {
    type = EffectTarget.Item;
    constructor() {}
    cast(item: Item) {
        item.reveal();
        gameBus.publish(logPublished({level: 'success', data: `You identify a ${item.name}`}));
    }
}

export class KnowledgeSpell implements IEffect {
    type = EffectTarget.None;
    constructor(private readonly world: WorldEffect){}
    cast() {
        matrixForEach<Tile>(this.world.getTilemap().tiles, (t: Tile) => {
            t.viewed = true;
            if (t.visibility !== TileVisibility.OnSight) t.setObscurity();
        });
        gameBus.publish(logPublished({level: 'success', data:'Yee see everything !'}));
        gameBus.publish(sightUpdated({}));
    }
}
export class TeleportationSpell implements IEffect  {
    type = EffectTarget.Movable;
    constructor(private readonly world: WorldEffect) {}
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

export class BlinkSpell implements IEffect  {
    type = EffectTarget.Location;
    constructor(private readonly world: WorldEffect) {}
    cast(target: Coordinate) {
        this.world.getHero().pos = target;
        gameBus.publish(playerMoved({}));
    }
}

export class ImproveArmourSpell implements IEffect  {
    type = EffectTarget.Armour;
    constructor(private world: WorldEffect){}
    cast(target: Armour) {
        target.baseAbsorb += 1;
        gameBus.publish(logPublished({data: `Your ${target.name} glows magically for a moment.`}));
        gameBus.publish(itemEquiped({armour: this.world.getHero().armour}))
    }
}
export class ImproveWeaponSpell implements IEffect  {
    type = EffectTarget.Weapon;
    constructor(private world: WorldEffect){}
    cast(target: Weapon) {
        target.additionnalDmg += 1;
        gameBus.publish(logPublished({data: `Your ${target.name} glows magically for a moment.`}));
        gameBus.publish(itemEquiped({weapon: this.world.getHero().weapon}))
    }
}

/// SHOULD BE SPELLS
export class CleaningEffect implements IEffect {
    type = EffectTarget.Movable;
    cast(target: Hero|Monster) {
        target.buffs.cleanBuff();
        target.enchants.clean();
        gameBus.publish(logPublished({level: 'success', data:`${target.name} looks purified`}));
    }
}

export class XPEffect implements IEffect {
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

 /// END SPELLS
/*
export class HealEffect implements IEffect {
    type = EffectTarget.Movable;
    cast(target: Hero) {
        let bonus = pickInRange('10-20');
        bonus += 10 * target.heroSkills.getSkillLevel(SkillNames.Alchemist);
        target.health.take(-bonus);
        gameBus.publish(playerHealed({
            baseHp: target.health.baseHp,
            currentHp: target.health.currentHp
        }));
    }
}
export class ThicknessEffect implements IEffect {
    type = EffectTarget.Movable;
    turns = 5
    cast(target: Hero|Monster) {
        target.addBuff({
            start: (t: Hero|Monster) => {
                t.armour.baseAbsorb += 5;
                t.speed = t.speed * 2;
                gameBus.publish(itemEquiped({armour: t.armour}));
            },
            end: (t: Hero|Monster) => {
                t.armour.baseAbsorb -= 5;
                t.speed = t.speed / 2;
                gameBus.publish(itemEquiped({armour: t.armour}));
            },
            turns: this.turns,
        });
        gameBus.publish(logPublished({level: 'success', data:'Your skin seems thicker'}));
    }
}

export class DodgeEffect implements IEffect {
    type = EffectTarget.Movable;
    turns = 15;
    cast(target: Hero|Monster) {
        target.addBuff({
            start: (t: Hero|Monster) => {
                t.enchants.setAgile(true);
                t.dodge += 0.2
            },
            end: (t: Hero|Monster) => {
                t.dodge -= 0.2
                t.enchants.setAgile(false);
            },
            turns: this.turns
        });
        gameBus.publish(logPublished({level: 'success', data:`${target.name} feels more agile`}));
    }
}

export class StunEffect implements IEffect   {
    type = EffectTarget.Movable;
    stunKind = 'stuned';
    turns = 5;
    cast(target: Hero|Monster) {
        target.addBuff({
            start: (t: Hero|Monster) => t.enchants.setStuned(true),
            tick: (t: Hero|Monster) => gameBus.publish(logPublished({level: 'warning', data: `${target.name} is stuned`})),
            end: (t: Hero|Monster) => t.enchants.setStuned(false),
            turns: this.turns
        });
        gameBus.publish(logPublished({level: 'warning', data: `${target.name} is ${this.stunKind}`}));
    }
}
export class BlindEffect implements IEffect   {
    type = EffectTarget.Movable;
    turns = 10;
    cast(target: Hero|Monster) {
        target.addBuff({
            start: (t: Hero|Monster) => {
                t.enchants.setBlind(true);
                t.sight -=6;
            },
            end: (t: Hero|Monster) => { 
                t.enchants.setBlind(false);
                t.sight +=6;
            },
            turns: this.turns
        });
        gameBus.publish(logPublished({level: 'warning', data: `${target.name} sees nothing !`}));
    }
}

export class WetEffect implements IEffect {
    type = EffectTarget.None;
    turns = 3;
    cast(target: Hero|Monster) {
        target.addBuff({
            start: (t: Hero|Monster) => t.enchants.setWet(true),
            end: (t: Hero|Monster) => t.enchants.setWet(false),
            turns: this.turns
        });
    }
}

export class AccuratyEffect implements IEffect   {
    type = EffectTarget.Movable;
    turns = 15;
    cast(target: Hero|Monster) {
        target.addBuff({
            start: (t: Hero|Monster) => {
                t.enchants.setConfident(true);
                t.weapon.maxRange += 1;
            },
            end: (t: Hero|Monster) => {
                t.enchants.setConfident(false);
                t.weapon.maxRange -= 1
            },
            turns: this.turns
        });
        gameBus.publish(logPublished({level: 'success', data: `${target.name} feels more confident`}));
    }
}

export class RageEffect implements IEffect   {
    type = EffectTarget.Movable;
    turns = 10;
    cast(target: Hero|Monster) {
        const rageLevel = pickInRange('3-5');
        target.addBuff({
            start: (t: Hero|Monster) => {
                t.armour.baseAbsorb -= rageLevel;
                t.weapon.additionnalDmg += rageLevel;
                t.enchants.setMoreDamage(true);
                t.enchants.setMoreVulnerable(true);
            },
            end: (t: Hero|Monster) => {
                t.enchants.setMoreDamage(false);
                t.enchants.setMoreVulnerable(false);
                t.weapon.additionnalDmg -= rageLevel;
                t.armour.baseAbsorb += rageLevel;
            },
            turns: this.turns
        });
        gameBus.publish(logPublished({level: 'danger', data: `${target.name} is getting mad !`}));
    }
}

export class BleedEffect implements IEffect  {
    type = EffectTarget.Movable;
    turns = 3;
    cast(target: Hero|Monster) {
        const bleed = (t: Hero | Monster) => {
            const dmg = pickInRange('4-6');
            doDamages(dmg, target, 'bleeding');
        }

        target.addBuff({
            start: (t: Hero|Monster) => {t.enchants.setBleeding(true); bleed(t)},
            tick: (t: Hero|Monster) => bleed(t),
            end: (t: Hero|Monster) => t.enchants.setBleeding(false),
            turns: this.turns
        });
        gameBus.publish(logPublished({level: 'danger', data: `${target.name} starts bleeding`}));
    }
}
export class PoisonEffect implements IEffect  {
    type = EffectTarget.Movable;
    turns = 5;
    cast(target: Hero|Monster) {
        const poison = (t: Hero | Monster) => {
            const dmg = pickInRange('1-2');
            doDamages(dmg, target, 'poisoning');
            if (target.enchants.getBurned()) {
                const bleed = EffectMaker.create(Effects.Bleed) as BleedEffect;
                bleed.turns = 2;
                bleed.cast(target);
            }
        }
        target.addBuff();
    }
}

export class SpeedEffect implements IEffect  {
    type = EffectTarget.Movable;
    turns = 8;
    cast(target: Hero|Monster) {
        gameBus.publish(logPublished({level: 'success', data:'you are boosted!'}));
        target.addBuff({
            start: (t: Hero|Monster) => {
                t.enchants.setSpeed(true);
                t.speed = t.speed/2;
            },
            end: (t: Hero|Monster) => {
                t.enchants.setSpeed(false);
                t.speed = t.speed * 2;
            },
            turns: this.turns
        });
    }
}
export class StupidityEffect implements IEffect  {
    type = EffectTarget.Movable;
    turns = 10;
    cast(target: Hero|Monster) {
        gameBus.publish(logPublished({level: 'warning', data:'?????'}));
        target.addBuff({
            start: (t: Hero|Monster) => t.enchants.setStupid (true),
            end: (t: Hero|Monster) => t.enchants.setStupid(false),
            turns: this.turns
        });
    }
}
export class RawDamageEffet implements IEffect {
    type = EffectTarget.Movable;
    chanceOfDodge = 0.4;
    cast(target: Hero|Monster) {
        if (this.chanceOfDodge > Math.random()) return;
        const dmg = pickInRange('5-10');
        doDamages(dmg, target, 'burning');
    }
}
export class ShadowEffet implements IEffect {
    type = EffectTarget.Movable;
    turns = 1;
    cast(target: Hero|Monster) {
        target.addBuff({
            start: (t: Hero|Monster) => {
                t.enchants.setBlind(true);
                t.sight -= 7;
            },
            end: (t: Hero|Monster) => {
                t.enchants.setBlind(false);
                t.sight += 7;
            },
            turns: this.turns
        });
    }
}

export class ShockEffect implements IEffect {
    type = EffectTarget.Movable;
    turns = 1;
    cast(target: Hero|Monster) {
        
    }
}

export class ColdEffect implements IEffect {
    type = EffectTarget.Movable;
    turns = 1;
    cast(target: Hero|Monster) {
        
    }
}

export class FireEffect implements IEffect {
    type = EffectTarget.Movable;
    turns = 3;
    cast(t: Hero|Monster) {
        const burn = (target: Hero|Monster) => {
            if (target.enchants.getBurned()) {
                doDamages(pickInRange('1-1'), target, 'burning');
                if (target.enchants.getPoisoned() && !target.enchants.getBleeding()) {
                    const bleed = EffectMaker.create(Effects.Bleed) as BleedEffect;
                    bleed.turns = 2;
                    bleed.cast(target);
                }
            }
        }
        const wet = (target: Hero|Monster) => {
            if (target.enchants.getWet()) {
                target.enchants.setBurned(false);
                gameBus.publish(logPublished({level: 'warning', data: `${t.name} stops the burn`}));
            }
        }
        t.addBuff({
            start: (t: Hero|Monster) => {
                t.enchants.setBurned(true);
                wet(t);
            },
            tick: (t: Hero|Monster) => {
                wet(t);
                burn(t);
            },
            end: (t: Hero|Monster) => { 
                t.enchants.setBurned(false);
            },
            turns: this.turns
        });
        gameBus.publish(logPublished({level: 'warning', data: `${t.name} is burning`}));
    }
}*/

export function doDamages(dmg: number, target: Monster | Hero, cause: string): void {
    const r = target.health.take(dmg);
    if (target instanceof Hero) {
        gameBus.publish(playerTookDammage({
            amount: r.amount,
            source: cause,
            baseHp: target.health.baseHp,
            currentHp: target.health.currentHp
        }));
    } else if (target instanceof Monster) {
        handleHealthReport(r, target, dmg);
        if (cause === 'poisoning') {
            gameBus.publish(logPublished({level: 'danger', data: `${target.name} suffers from poisoning`}));
        }
    }
}