import { Action } from "./action";
import { Monster } from "../monsters/monster";
import { MessageResponseStatus } from "../utils/types";
import { Log } from "../log/log";
import { distance } from "../utils/coordinate";
import { gameBus, effectSet } from "../../eventBus/game-bus";
import { MapEffect } from "../../map/map-effect";
import { Attack } from "../fight/fight";
import { DamageResolution } from "../fight/damages";
import { result } from "lodash";

export class AttackAction extends Action {
    constructor(private readonly args: {monster: Monster}) {
        super();
    }
    execute() {
        const hero = this.game.hero;
        const attacked = this.args.monster;
        const tilemap = this.game.tilemap;

        if (attacked === null) {
            return {
                timeSpent: 0,
                status: MessageResponseStatus.NotAllowed,
            };
        }
        if (!tilemap.hasVisibility({from: hero.pos, to: attacked.pos})) {
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
                    animation: 'throw',
                    type: MapEffect.Projectile,
                    from: hero.pos,
                    to: attacked.pos
                }));
            }
        }
        const damages = new Attack(hero, attacked).do();
        new DamageResolution(hero, attacked, damages, '');
    
        const result = {
            timeSpent: 1,
            status: MessageResponseStatus.Ok
        };

        if (result.status === MessageResponseStatus.Ok) {
            this.game.nextTurn(result.timeSpent);
        }
        return result;
    }
}