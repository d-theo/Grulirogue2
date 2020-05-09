import { HealthReport, HealthStatus } from "../entitybase/health";
import { Monster } from "../monsters/monster";
import { gameBus, heroGainedXp, monsterDead, playerAttackedMonster } from "../../eventBus/game-bus";

export function handleHealthReport(
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