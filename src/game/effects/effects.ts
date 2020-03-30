import { Monster } from "../monsters/monster";
import { Hero } from "../hero/hero";
import { GameRange } from "../utils/range";
import { Effect } from "./effect";
import { gameBus, playerHealed, logPublished } from "../../eventBus/game-bus";
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
*/
export interface IEffect {
    type: string[];
    cast: Function;
}

export class HealEffect implements IEffect {
    type = ['monster','hero']
    cast(target: Hero|Monster) {
        target.health.currentHp = target.health.baseHp;
        gameBus.publish(playerHealed({}));
    }
}
export class ThicknessEffect implements IEffect {
    type = ['monster','hero']
    cast(target: Hero|Monster) {
        target.addBuff({
            tick: (t: Hero|Monster) => t.armour.baseAbsorb += 5,
            end: (t: Hero|Monster) => t.armour.baseAbsorb -= 5,
            turns: 5
        });
        gameBus.publish(logPublished({data:'Your skin seems thicker'}));
    }
}
/*
export class StunEffect extends Effect  {
    type = ['monster','hero']
    cast(target: Hero|Monster) {
        target.addBuff({
            tick: (t: Hero|Monster) => t.enchants.stuned = true,
            end: (t: Hero|Monster) => t.enchants.stuned = false,
            turns: 5
        });
    }
}

export class BleedEffect extends Effect  {
    type = ['monster','hero']
    cast(target: Hero|Monster) {
        target.addBuff({
            tick: (t: Hero|Monster) => {
                t.enchants.bleeding = true
                t.health.take(new GameRange(3,6).pick())
            },
            end: (t: Hero|Monster) => t.enchants.bleeding = false,
            turns: 7
        });
    }
}

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

export class SwapEffect extends Effect{
    type = ['monster','hero'];
    cast(target1: Hero|Monster, target2: Hero|Monster) {
        const pos = target1.pos;
        target1.pos = target2.pos;
        target2.pos = pos;
    }
}

export class TeleportationEffect extends Effect{
    type = ['monster','hero'];
    cast(target: Hero|Monster) {
        let done = false;
        const rX = new GameRange(0, this.getMapWidth());
        const rY = new GameRange(0, this.getMapHeight());
        while(!done) {
            const pos = {
                x: rX.pick(),
                y: rY.pick()
            };
            if (this.tileIsEmpty(pos) && this.monsterAt(pos) == null) {
                done = true;
                target.pos = pos;
            }
        }
    }
}*/