import { Buff2 } from '../../game/entitybase/buff';
import { Monster } from '../../game/entitybase/monsters/monster';
import { logPublished, playerHealed, monsterTookDamage } from '../../game/events';
import { DamageResolution } from '../../game/fight/damages';
import { Hero } from '../../game/hero/hero';
import { gameBus } from '../../infra/events/game-bus';
import { Conditions } from './conditions';

export type EnchantInteractionRule = {
  condition: (target: Hero | Monster) => boolean;
  effect: (target: Hero | Monster) => void;
};

export const EnchantInteractionRules: EnchantInteractionRule[] = [
  {
    condition: (t) => t.enchants.getWet(),
    effect: (t) => t.buffs.cleanBuffType('burn'),
  },
  {
    condition: (t) => t.enchants.getBurned(),
    effect: (t) => {
      gameBus.publish(logPublished({ level: 'warning', data: `${t.name} is burning` }));
      new DamageResolution(null, t, 1, 'burning');
    },
  },
  {
    condition: (t) => t.enchants.getBurned() && t.enchants.getPoisoned(),
    effect: (t) => t.addBuff(Buff2.create(Conditions.bleed).setTurns(1).setIsStackable(true)),
  },
  {
    condition: (t) => t.enchants.getFloral() && t.enchants.getWet(),
    effect: (t) => {
      t.health.take(-1);
      const payload = {
        baseHp: t.health.baseHp,
        currentHp: t.health.currentHp,
      };
      if (t instanceof Hero) gameBus.publish(playerHealed(payload));
      else gameBus.publish(monsterTookDamage({ ...payload, monster: t, amount: -1 }));
    },
  },
];
