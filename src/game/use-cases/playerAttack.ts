import { MessageResponse, MessageResponseStatus } from "../utils/types";
import { Attack } from "../fight/fight";
import { HealthStatus } from "../entitybase/health";
import { InternalEventType } from "../events/events";
import { Hero } from "../hero/hero";
import { TileMap } from "../tilemap/tilemap";
import { Killable } from "../entitybase/killable";
import { Movable } from "../entitybase/movable";

export function playerAttack(args: {hero: Hero, attacked: (Killable&Movable)|null, tilemap: TileMap}): MessageResponse {
    const {hero, attacked, tilemap} = args; 
    if (attacked === null || !tilemap.hasVisibility({from: hero.pos, to: attacked.pos})) {
        return {
            timeSpent: 0,
            status: MessageResponseStatus.NotAllowed,
        };
    }

    const damages = new Attack(hero, attacked).do();
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