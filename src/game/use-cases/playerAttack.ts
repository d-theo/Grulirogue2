import { MessageResponse, MessageResponseStatus } from '../../utils/types';
import { Attack } from '../fight/fight';
import { Hero } from '../hero/hero';
import { TileMap } from '../tilemap/tilemap';
import { Log } from '../log/log';
import { distance } from '../../utils/coordinate';
import { gameBus } from '../../infra/events/game-bus';
import { DamageResolution } from '../fight/damages';
import { MapEffect } from '../../world/map/map-effect';
import { Monster } from '../entitybase/monsters/monster';
import { effectSet } from '../events';

export function playerAttack(args: { hero: Hero; attacked: Monster | null; tilemap: TileMap }): MessageResponse {
  const { hero, attacked, tilemap } = args;
  if (attacked === null) {
    return {
      timeSpent: 0,
      status: MessageResponseStatus.NotAllowed,
    };
  }
  if (!tilemap.hasVisibility({ from: hero.pos, to: attacked.pos })) {
    Log.log(`You can't see the ${attacked.name}`);
    return {
      timeSpent: 0,
      status: MessageResponseStatus.NotAllowed,
    };
  }

  const dx = hero.pos.x - attacked.pos.x;
  const dy = hero.pos.y - attacked.pos.y;
  const range = Math.max(Math.abs(dx), Math.abs(dy));
  if (hero.weapon.maxRange < range) {
    Log.log('You are not in range');
    return {
      timeSpent: 0,
      status: MessageResponseStatus.NotAllowed,
    };
  } else {
    if (distance(attacked.pos, hero.pos) > 1) {
      gameBus.publish(
        effectSet({
          animation: 'throw',
          type: MapEffect.Projectile,
          from: hero.pos,
          to: attacked.pos,
        })
      );
    }
  }
  const damages = new Attack(hero, attacked).do();
  new DamageResolution(hero, attacked, damages, '');
  return {
    timeSpent: 1,
    status: MessageResponseStatus.Ok,
  };
}
