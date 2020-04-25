import { MessageResponse, MessageResponseStatus } from "../utils/types";
import { Attack } from "../fight/fight";
import { HealthStatus } from "../entitybase/health";
import { Hero } from "../hero/hero";
import { Monster } from "../monsters/monster";
import { gameBus, playerTookDammage, effectSet } from "../../eventBus/game-bus";
import { distance } from "../utils/coordinate";
import { MapEffect } from "../../map/map-effect";

export function monsterAttack(args: {hero: Hero, monster: Monster}): MessageResponse {
    const {hero, monster} = args; 

    const damages = new Attack(monster, hero).do();
    const healthReport = hero.health.take(damages);
    if (distance(monster.pos, hero.pos) > 1) {
        gameBus.publish(effectSet({
            name: 'rock',
            type: MapEffect.Projectile,
            from: monster.pos,
            to: hero.pos
        }));
    }
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
    
    return {
        timeSpent: 1,
        status: MessageResponseStatus.Ok,
        data: {
            report: {
                healthReport: healthReport,
                target: hero
            }
        },
    };
}