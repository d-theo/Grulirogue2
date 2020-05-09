import { MessageResponse, MessageResponseStatus } from "../utils/types";
import { Attack } from "../fight/fight";
import { HealthStatus } from "../entitybase/health";
import { Hero } from "../hero/hero";
import { Monster } from "../monsters/monster";
import { gameBus, playerTookDammage, effectSet, monsterTookDamage, monsterDead } from "../../eventBus/game-bus";
import { distance } from "../utils/coordinate";
import { MapEffect } from "../../map/map-effect";
import { handleHealthReport } from "./health-report";

export function monsterAttack(args: {target: Hero | Monster, monster: Monster}): MessageResponse {
    const {target, monster} = args; 

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
        if (target.isFriendly && healthReport.status === HealthStatus.Dead) {
            debugger;
        }
        gameBus.publish(monsterTookDamage({
            monster: target
        }));
        if (healthReport.status === HealthStatus.Dead) {
            gameBus.publish(monsterDead({
                monster: target
            }));
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