import { MessageResponse, MessageResponseStatus } from "../utils/types";
import { Attack } from "../fight/fight";
import { HealthStatus } from "../entitybase/health";
import { Hero } from "../hero/hero";
import { Monster } from "../monsters/monster";
import { gameBus, playerTookDammage, effectSet, monsterTookDamage, monsterDead, heroGainedXp } from "../../eventBus/game-bus";
import { distance } from "../utils/coordinate";
import { MapEffect } from "../../map/map-effect";

export function monsterAttack(args: {target: Hero | Monster, monster: Monster}): MessageResponse {
    const {target, monster} = args; 

    if (monster.spells.length > 0 && Math.random() > 0.7) {
        const spell = monster.spells.pop();
        spell?.cast(target.pos);
        return {
            timeSpent: 1,
            status: MessageResponseStatus.Ok,
            data: null
        };
    }

    const damages = new Attack(monster, target).do();
    const healthReport = target.health.take(damages);
    if (distance(monster.pos, target.pos) > 1) {
        gameBus.publish(effectSet({
            animation: 'throw',
            type: MapEffect.Projectile,
            from: monster.pos,
            to: target.pos
        }));
    }

    if (target instanceof Hero) {
        const hero = target;
        if (healthReport.status === HealthStatus.Dammaged) {
            gameBus.publish(playerTookDammage({
                amount: healthReport.amount,
                monster: monster,
                baseHp: hero.health.baseHp,
                currentHp: hero.health.currentHp
            }));
        }
        if (healthReport.status === HealthStatus.Unaffected) {
            gameBus.publish(playerTookDammage({
                amount: 0,
                monster: monster,
                baseHp: hero.health.baseHp,
                currentHp: hero.health.currentHp
            }));
        }
        if (healthReport.status === HealthStatus.Dead) {
            gameBus.publish(playerTookDammage({
                amount: healthReport.amount,
                monster: monster,
                baseHp: hero.health.baseHp,
                currentHp: hero.health.currentHp
            }));
        }
    } else {
        gameBus.publish(monsterTookDamage({
            monster: target,
            amount: healthReport.amount,
            baseHp: target.health.baseHp,
            currentHp: target.health.currentHp,
            externalSource: monster
        }));
        if (healthReport.status === HealthStatus.Dead) {
            gameBus.publish(monsterDead({
                monster: target
            }));
            // a friendly killed it
            if (!monster.getFriendly()) {
                gameBus.publish(heroGainedXp({
                    amount: monster.xp
                }));
            }
        }
    }
    
    return {
        timeSpent: 1,
        status: MessageResponseStatus.Ok,
        data: {
            report: {
                healthReport: healthReport,
                target: target
            }
        },
    };
}