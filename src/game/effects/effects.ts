import { Monster } from "../monsters/monster";
import { Hero } from "../hero/hero";
import { gameBus, playerHealed, logPublished, playerTookDammage } from "../../eventBus/game-bus";
import { GameRange } from "../utils/range";
import { WorldEffect } from "./effect";
import { pickInRange, pickInArray } from "../utils/random";
/*
    'blind',
    'stun',
    'constitution',
    'precision',
    'force',
    'stupidity',
    'weakness',
    'hole',
    'filling',
    'invisibility',
    'fire',
    'ice',
    'poison',
    'teleportation',
    'swap',
    'summoning',
    'haste',
    'bleed',
    'experience',
    'explosive',
    'weapon_enchant',
    'armour_enchant'
    fog
*/
export interface IEffect {
    type: string[];
    cast: Function;
}

export class HealEffect implements IEffect {
    type = ['monster','hero']
    cast(target: Hero) {
        let bonus = pickInRange('10-20');
        if (target.skillFlags.improvedPotionEffect > 0) {
            bonus += 10 * target.skillFlags.improvedPotionEffect;
        }
        target.health.take(-bonus);
        gameBus.publish(playerHealed({
            baseHp: target.health.baseHp,
            currentHp: target.health.currentHp
        }));
    }
}
export class ThicknessEffect implements IEffect {
    type = ['monster','hero']
    cast(target: Hero|Monster) {
        target.addBuff({
            start: (t: Hero|Monster) => {
                t.armour.baseAbsorb += 5;
                t.speed = t.speed * 2;
            },
            end: (t: Hero|Monster) => {
                t.armour.baseAbsorb -= 5;
                t.speed = t.speed / 2;
            },
            turns: 5
        });
        gameBus.publish(logPublished({data:'Your skin seems thicker'}));
    }
}
export class CleaningEffect implements IEffect {
    type = ['monster','hero']
    cast(target: Hero|Monster) {
        target.buffs.cleanBuff();
        gameBus.publish(logPublished({data:`${target.name} looks purified`}));
    }
}

export class DodgeEffect implements IEffect {
    type = ['monster','hero']
    cast(target: Hero|Monster) {
        target.addBuff({
            start: (t: Hero|Monster) => t.armour.baseAbsorb += 5,
            end: (t: Hero|Monster) => t.armour.baseAbsorb -= 5,
            turns: 5
        });
        gameBus.publish(logPublished({data:`${target.name} feels more agile`}));
    }
}

export class XPEffect implements IEffect {
    type = ['hero','monster']
    cast(target: Hero | Monster) {
        if (target.xp) {
            (target as Hero).levelUp();
            gameBus.publish(logPublished({data:'you are wiser !'}));
        } else {
            gameBus.publish(logPublished({data:'noting happens'}));
        }
    }
}

export class StunEffect implements IEffect   {
    type = ['monster','hero']
    cast(target: Hero|Monster) {
        target.addBuff({
            start: (t: Hero|Monster) => t.enchants.stuned = true,
            end: (t: Hero|Monster) => t.enchants.stuned = false,
            turns: 5
        });
        gameBus.publish(logPublished({data: `${target.name} is stuned`}));
    }
}
export class BlindEffect implements IEffect   {
    type = ['monster','hero']
    cast(target: Hero|Monster) {
        target.addBuff({
            start: (t: Hero|Monster) => t.sight -= 6,
            end: (t: Hero|Monster) => t.sight += 6,
            turns: 15
        });
        gameBus.publish(logPublished({data: `${target.name} is stuned`}));
    }
}

export class AccuratyEffect implements IEffect   {
    type = ['monster','hero']
    cast(target: Hero|Monster) {
        target.addBuff({
            start: (t: Hero|Monster) => t.weapon.maxRange += 1,
            end: (t: Hero|Monster) => t.weapon.maxRange -= 1,
            turns: 15
        });
        gameBus.publish(logPublished({data: `${target.name} feels more confident`}));
    }
}

export class RageEffect implements IEffect   {
    type = ['monster','hero']
    cast(target: Hero|Monster) {
        const rageLevel = pickInRange('3-5');
        target.addBuff({
            start: (t: Hero|Monster) => {
                t.armour.baseAbsorb -= rageLevel;
                t.weapon.baseDamage += rageLevel;
            },
            end: (t: Hero|Monster) => {
                t.armour.baseAbsorb -= rageLevel;
                t.weapon.baseDamage += rageLevel;
            },
            turns: 10
        });
        gameBus.publish(logPublished({data: `${target.name} is getting mad !`}));
    }
}

export class TeleportationEffect implements IEffect  {
    type = ['monster','hero'];
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
export class BleedEffect implements IEffect  {
    type = ['monster','hero']
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
            }
        }

        target.addBuff({
            start: (t: Hero|Monster) => {t.enchants.bleeding = true; bleed(t)},
            tick: (t: Hero|Monster) => bleed(t),
            end: (t: Hero|Monster) => t.enchants.bleeding = false,
            turns: 3
        });
        gameBus.publish(logPublished({data: `${target.name} starts bleeding`}));
    }
}
export class PoisonEffect implements IEffect  {
    type = ['monster','hero']
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
            }
        }
        target.addBuff({
            start: (t: Hero|Monster) => { 
                t.enchants.poisoned = true;
                poison(t);
            },
            tick: (t: Hero|Monster) => poison(t),
            end: (t: Hero|Monster) => t.enchants.poisoned = false,
            turns: 7
        });
    }
}
export class SpeedEffect implements IEffect  {
    type = ['monster','hero']
    cast(target: Hero|Monster) {
        target.addBuff({
            start: (t: Hero|Monster) => {
                t.enchants.speed = true;
                t.speed = t.speed/2;
            },
            end: (t: Hero|Monster) => {
                t.enchants.speed = false;
                t.speed = t.speed * 2;
            },
            turns: 7
        });
    }
}
export class StupidityEffect implements IEffect  {
    type = ['monster','hero']
    cast(target: Hero|Monster) {
        target.addBuff({
            start: (t: Hero|Monster) => t.enchants.stupid = true,
            end: (t: Hero|Monster) => t.enchants.stupid = false,
            turns: 10
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

/*
export class ConstEffect extends Effect {
    type = ['monster','hero']
    cast(target: Hero|Monster) {
        target.addBuff({
            tick: (t: Hero|Monster) => t.health.currentHp += target.level * 7,
            end: (t: Hero|Monster) => t.health.currentHp -= target.level * 7,
            turns: 15
        });
    }
}

export class InvisibilityEffect extends Effect{
    type = ['monster','hero'];
    cast(target: Hero|Monster) {
        target.addBuff({
            tick: (t: Hero|Monster) => t.enchants.invisibility = true,
            end: (t: Hero|Monster) => t.enchants.invisibility = false,
            turns: 15
        });
    }
}
*/