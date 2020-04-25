import { MessageResponse, MessageResponseStatus } from "../utils/types";
import { Attack } from "../fight/fight";
import { Hero } from "../hero/hero";
import { TileMap } from "../tilemap/tilemap";
import { Log } from "../log/log";
import { Monster } from "../monsters/monster";
import { handleHealthReport } from "./health-report";
import { distance } from "../utils/coordinate";
import { gameBus, effectSet } from "../../eventBus/game-bus";
import { MapEffect } from "../../map/map-effect";

export function playerAttack(args: {hero: Hero, attacked:  Monster | null, tilemap: TileMap}): MessageResponse {
    const {hero, attacked, tilemap} = args; 
    if (attacked === null) {
        return {
            timeSpent: 0,
            status: MessageResponseStatus.NotAllowed,
        };
    }
    if (!tilemap.hasVisibility({from: hero.pos, to: attacked.pos})) {
        Log.log(`You can't see the ${(attacked.name)}`);
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
    } else {
        if (distance(attacked.pos, hero.pos) > 1) {
            gameBus.publish(effectSet({
                name: 'rock',
                type: MapEffect.Projectile,
                from: hero.pos,
                to: attacked.pos
            }));
        }
    }
    const damages = new Attack(hero, attacked).do();
    const healthReport = attacked.health.take(damages);

    handleHealthReport(healthReport, attacked, damages);
    
    return {
        timeSpent: 1,
        status: MessageResponseStatus.Ok
    };
}