import { Monster } from "../monsters/monster";
import { Hero } from "../hero/hero";
import { gameBus, playerTookDammage, logPublished, playerAttackedMonster, heroGainedXp, monsterDead, monsterTookDamage } from "../../eventBus/game-bus";
import { HealthReport, HealthStatus } from "../entitybase/health";

export function dealDamages(
    dmg: number,
    source: Monster | Hero | null,
    target: Monster | Hero,
    cause: string): void {
    const r = target.health.take(dmg);
    if (target instanceof Hero) {
        gameBus.publish(playerTookDammage({
            amount: r.amount,
            source: cause,
            baseHp: target.health.baseHp,
            currentHp: target.health.currentHp
        }));
    } else if (target instanceof Monster) {
        if (source instanceof Hero || source === null) {
            handleHealthReport(r, target, dmg);
            if (cause === 'poisoning') {
                gameBus.publish(logPublished({level: 'danger', data: `${target.name} suffers from poisoning`}));
            }
        } else if (source instanceof Monster) {
            gameBus.publish(monsterTookDamage({
                monster: target
            }));
            if (r.status === HealthStatus.Dead) {
                gameBus.publish(monsterDead({
                    monster: target
                }));
                // a friendly killed it
                if (!target.getFriendly()) {
                    gameBus.publish(heroGainedXp({
                        amount: target.xp
                    }));
                }
            }
        }
    }
}

function handleHealthReport(
    healthReport: HealthReport,
    monster: Monster,
    damages: number,
    externalSource?: any) {
    gameBus.publish(playerAttackedMonster({
        amount: damages,
        monster: monster,
        currentHp: monster.health.currentHp,
        baseHp: monster.health.baseHp,
        externalSource
    }));
    if (healthReport.status === HealthStatus.Dead) {
        gameBus.publish(heroGainedXp({
            amount: monster.xp
        }));
        gameBus.publish(monsterDead({
            monster: monster,
        }));
    }
}