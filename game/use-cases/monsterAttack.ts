import { MessageResponse, MessageResponseStatus } from "../utils/types";
import { Attack } from "../fight/fight";
import { HealthStatus } from "../entitybase/health";
import { InternalEventType } from "../events/events";
import { Hero } from "../hero/hero";
import { TileMap } from "../tilemap/tilemap";
import { Monster } from "../monsters/monster";

export function monsterAttack(args: {hero: Hero, monster: Monster}): MessageResponse {
    const {hero, monster} = args; 

    const damages = new Attack(monster, hero).do();
    const healthReport = hero.health.take(damages);
    const evts = [];

    if (healthReport.status === HealthStatus.Dead) {
        evts.push({
            type: InternalEventType.HeroDead,
            data: {
                target: hero
            }
        });
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
        events: evts
    };
}