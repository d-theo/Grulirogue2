import { MessageResponse, MessageResponseStatus } from "../utils/types";
import { Attack } from "../fight/fight";
import { HealthStatus } from "../entitybase/health";
import { InternalEventType } from "../events/events";
import { Hero } from "../hero/hero";
import { TileMap } from "../tilemap/tilemap";
import { Killable } from "../entitybase/killable";
import { Movable } from "../entitybase/movable";
import { Log } from "../log/log";
import { gameBus, playerAttackedMonster, monsterDead } from "../../eventBus/game-bus";
import { Monster } from "../monsters/monster";

export function playerAttack(args: {hero: Hero, attacked: (Killable&Movable)|null, tilemap: TileMap}): MessageResponse {
    const {hero, attacked, tilemap} = args; 
    if (attacked === null) {
        return {
            timeSpent: 0,
            status: MessageResponseStatus.NotAllowed,
        };
    }
    if (!tilemap.hasVisibility({from: hero.pos, to: attacked.pos})) {
        Log.log(`You can't see the ${(attacked as any).name}`);
        return {
            timeSpent: 0,
            status: MessageResponseStatus.NotAllowed,
        };
    }

    const dx = hero.pos.x - attacked.pos.x;
    const dy = hero.pos.y - attacked.pos.y;
    const range = Math.max(Math.abs(dx),Math.abs(dy));
    if (hero.weapon.maxRange < range) {
        Log.log('You are not in range');
        return {
            timeSpent: 0,
            status: MessageResponseStatus.NotAllowed,
        };
    }
    const damages = new Attack(hero, attacked).do();
    const healthReport = attacked.health.take(damages);

    gameBus.publish(playerAttackedMonster({
        amount: damages,
        monster: attacked as any as Monster,
        currentHp: attacked.health.currentHp,
        baseHp: attacked.health.baseHp
    }));
    
    if (healthReport.status === HealthStatus.Dead) {
        gameBus.publish(monsterDead({
            monster: attacked as any as Monster,
        }));
    }
    
    return {
        timeSpent: 1,
        status: MessageResponseStatus.Ok
    };
}