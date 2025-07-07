import { MessageResponse, MessageResponseStatus } from '../../utils/types';
import { Attack } from '../fight/fight';
import { Hero } from '../hero/hero';
import { distance } from '../../utils/coordinate';
import { DamageResolution } from '../fight/damages';
import { gameBus } from '../../infra/events/game-bus';
import { MapEffect } from '../../world/map/map-effect';
import { Monster } from '../entitybase/monsters/monster';
import { effectSet } from '../events';

export function monsterAttack(args: { target: Hero | Monster; monster: Monster }): MessageResponse {
  const { target, monster } = args;

  if (monster.spells.length > 0 && Math.random() > 0.7) {
    const spell = monster.spells.pop();
    spell?.cast(target.pos);
    return {
      timeSpent: 1,
      status: MessageResponseStatus.Ok,
      data: null,
    };
  }

  const damages = new Attack(monster, target).do();
  new DamageResolution(monster, target, damages, null);
  if (distance(monster.pos, target.pos) > 1) {
    gameBus.publish(
      effectSet({
        animation: 'throw',
        type: MapEffect.Projectile,
        from: monster.pos,
        to: target.pos,
      })
    );
  }

  return {
    timeSpent: 1,
    status: MessageResponseStatus.Ok,
  };
}
