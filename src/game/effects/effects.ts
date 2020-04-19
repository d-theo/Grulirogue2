import { Monster } from "../monsters/monster";
import { Hero } from "../hero/hero";
import { gameBus, playerHealed, logPublished, playerTookDammage, playerAttackedMonster, effectSet, playerMoved, itemEquiped, sightUpdated, xpHasChanged, heroGainedXp } from "../../eventBus/game-bus";
import { GameRange } from "../utils/range";
import { WorldEffect, EffectMaker, Effects, SpellNames } from "./effect";
import { pickInRange, pickInArray } from "../utils/random";
import { handleHealthReport } from "../use-cases/health-report";
import { MapEffect } from "../../map/map-effect";
import { Coordinate } from "../utils/coordinate";
import { Armour } from "../entitybase/armour";
import { Weapon } from "../entitybase/weapon";
import { Item } from "../entitybase/item";
import { matrixForEach } from "../utils/matrix";
import { Tile, TileVisibility } from "../tilemap/tile";
import { SkillNames } from "../hero/hero-skills";
import { Terrain } from "../../map/terrain.greece";

export interface IEffect {
    type: string[];
    cast: Function;
    turns?: number;
}

export class TrapSpell implements IEffect {
    type = ['ground'];
    constructor(private readonly world: WorldEffect) {}
    cast(pos: Coordinate) {
        const id = this.world.getTilemap().addTileEffects({
            debuff: EffectMaker.create(Effects.Bleed),
            pos,
            durationAfterWalk: 1,
            type: SpellNames.SpikeTrap
        });
        gameBus.publish(effectSet({
            name: id,
            type: MapEffect.Spike,
            pos
        }));
        gameBus.publish(logPublished({data: `trap has been set`}));
    }
}

export class IdentifiySpell implements IEffect {
    type = ['chose_item'];
    constructor() {}
    cast(item: Item) {
        item.reveal();
        gameBus.publish(logPublished({level: 'success', data: `You identify a ${item.name}`}));
    }
}

export class KnowledgeSpell implements IEffect {
    type = [];
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

export class RogueSpell implements IEffect {
    type = ['spell'];
    constructor(private readonly world: WorldEffect) {}
    cast() {
        this.world.getHero().weapon.additionnalEffects.push({
            effect: EffectMaker.create(Effects.Poison),
            target: 'target'
        });
    }
}

export class HealEffect implements IEffect {
    type = ['monster','hero']
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
    type = ['monster','hero'];
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
            turns: this.turns
        });
        gameBus.publish(logPublished({level: 'success', data:'Your skin seems thicker'}));
    }
}
export class CleaningEffect implements IEffect {
    type = ['monster','hero']
    cast(target: Hero|Monster) {
        target.buffs.cleanBuff();
        gameBus.publish(logPublished({level: 'success', data:`${target.name} looks purified`}));
    }
}

export class DodgeEffect implements IEffect {
    type = ['monster','hero']
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

export class XPEffect implements IEffect {
    type = ['hero','monster']
    cast(target: Hero | Monster) {
        if (target instanceof Hero) {
            gameBus.publish(heroGainedXp({
                amount: 999999
            }));
            gameBus.publish(logPublished({level: 'success', data:'you are wiser !'}));
        } else {
            gameBus.publish(logPublished({data:'noting happens'}));
        }
    }
}

export class StunEffect implements IEffect   {
    type = ['monster','hero']
    turns = 5;
    cast(target: Hero|Monster) {
        target.addBuff({
            start: (t: Hero|Monster) => t.enchants.setStuned(true),
            tick: (t: Hero|Monster) => gameBus.publish(logPublished({level: 'warning', data: `${target.name} is stuned`})),
            end: (t: Hero|Monster) => t.enchants.setStuned(false),
            turns: this.turns
        });
        gameBus.publish(logPublished({level: 'warning', data: `${target.name} is stuned`}));
    }
}
export class BlindEffect implements IEffect   {
    type = ['monster','hero']
    turns = 10;
    cast(target: Hero|Monster) {
        target.addBuff({
            start: (t: Hero|Monster) => t.sight -= 6,
            end: (t: Hero|Monster) => t.sight += 6,
            turns: this.turns
        });
        gameBus.publish(logPublished({level: 'warning', data: `${target.name} sees nothing !`}));
    }
}

export class WetEffect implements IEffect {
    type = [];
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
    type = ['monster','hero']
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
    type = ['monster','hero']
    turns = 10;
    cast(target: Hero|Monster) {
        const rageLevel = pickInRange('3-5');
        target.addBuff({
            start: (t: Hero|Monster) => {
                t.armour.baseAbsorb -= rageLevel;
                t.weapon.additionnalDmg += rageLevel;
            },
            end: (t: Hero|Monster) => {
                t.weapon.additionnalDmg -= rageLevel;
                t.armour.baseAbsorb += rageLevel;
            },
            turns: this.turns
        });
        gameBus.publish(logPublished({level: 'danger', data: `${target.name} is getting mad !`}));
    }
}

export class TeleportationSpell implements IEffect  {
    type = ['chose_target'];
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
    type = ['chose_location'];
    constructor(private readonly world: WorldEffect) {}
    cast(target: Coordinate) {
        this.world.getHero().pos = target;
        gameBus.publish(playerMoved({}));
    }
}

export class ImproveArmourSpell implements IEffect  {
    type = ['chose_armour'];
    constructor(private world: WorldEffect){}
    cast(target: Armour) {
        target.baseAbsorb += 1;
        gameBus.publish(logPublished({data: `Your ${target.name} glows magically for a moment.`}));
        gameBus.publish(itemEquiped({armour: this.world.getHero().armour}))
    }
}
export class ImproveWeaponSpell implements IEffect  {
    type = ['chose_weapon'];
    constructor(private world: WorldEffect){}
    cast(target: Weapon) {
        target.additionnalDmg += 1;
        gameBus.publish(logPublished({data: `Your ${target.name} glows magically for a moment.`}));
        gameBus.publish(itemEquiped({weapon: this.world.getHero().weapon}))
    }
}

export class BleedEffect implements IEffect  {
    type = ['monster','hero']
    turns = 3;
    cast(target: Hero|Monster) {
        const bleed = (t: Hero | Monster) => {
            const dmg = pickInRange('4-6');
            const healthReport = t.health.take(dmg);
            if (t instanceof Hero) {
                gameBus.publish(playerTookDammage({
                    amount: healthReport.amount,
                    source: 'bleeding',
                    baseHp: t.health.baseHp,
                    currentHp: t.health.currentHp
                }));
            } else if (t instanceof Monster) {
                handleHealthReport(healthReport, t, dmg);
            }
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
    type = ['monster','hero']
    turns = 7;
    cast(target: Hero|Monster) {
        const poison = (t: Hero | Monster) => {
            const dmg = pickInRange('1-3');
            const healthReport = t.health.take(dmg);
            if (t instanceof Hero) {
                gameBus.publish(playerTookDammage({
                    amount: healthReport.amount,
                    source: 'poisoning',
                    baseHp: t.health.baseHp,
                    currentHp: t.health.currentHp
                }));
            } else if (t instanceof Monster) {
                gameBus.publish(logPublished({level: 'danger', data: `${t.name} suffers from poisoning`}))
                handleHealthReport(healthReport, t, dmg);
            }
        }
        target.addBuff({
            start: (t: Hero|Monster) => { 
                t.enchants.setPoisoned(true);
                poison(t);
            },
            tick: (t: Hero|Monster) => poison(t),
            end: (t: Hero|Monster) => t.enchants.setPoisoned(false),
            turns: this.turns
        });
    }
}

export class SpeedEffect implements IEffect  {
    type = ['monster','hero']
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
    type = ['monster','hero']
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

export class SwapEffect implements IEffect {
    type = ['monster','hero'];
    cast(target1: Hero|Monster, target2: Hero|Monster) {
        const pos = target1.pos;
        target1.pos = target2.pos;
        target2.pos = pos;
    }
}