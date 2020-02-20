import { Game } from "../game";
import { MessageResponse, MessageResponseStatus } from "../utils/types";
import { PlayerAttackMessage } from "../events/messages";
import { Attack } from "../fight/fight";
import { HealthStatus } from "../entitybase/health";
import { InternalEventType } from "../events/events";

export function playerAttack(game: Game, message: PlayerAttackMessage): MessageResponse {
    const attacked = game.getAttackable(message.data.to);
    const damages = new Attack(game.hero, attacked).do();
    const healthReport = attacked.health.take(damages);
    const evts = [];

    if (healthReport.status === HealthStatus.Dead) {
        evts.push({
            type: InternalEventType.MonsterDead,
            data: {
                target: attacked
            }
        });
    }
    
    return {
        timeSpent: 1,
        status: MessageResponseStatus.Ok,
        data: {
            report: {
                healthReport: healthReport,
                target: attacked
            }
        },
        events: evts
    };
}