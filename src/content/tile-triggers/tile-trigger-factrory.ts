import { Entity } from '../../game/entitybase/entity';
import { TileTrigger, TriggerType } from '../../game/tilemap/tile-trigger';
import { Conditions } from '../conditions/conditions';
import { Buff2 } from '../../game/entitybase/buff';

const short = require('short-uuid');

const generateId = () => short.generate();

export class TileTriggerFactory {
  static floralZone(duration): TileTrigger[] {
    return [
      {
        id: generateId(),
        triggerType: TriggerType.OnWalk,
        turns: duration,
        stayOnWalk: true,
        trigger: (e: Entity) => e.enchants.setFloral(+1),
      },
      {
        id: generateId(),
        triggerType: TriggerType.OnLeft,
        turns: duration,
        stayOnWalk: true,
        trigger: (e: Entity) => e.enchants.setFloral(-1),
      },
    ];
  }

  static poisonZone(duration): TileTrigger[] {
    return [
      {
        id: generateId(),
        triggerType: TriggerType.OnWalk,
        turns: duration,
        stayOnWalk: false,
        trigger: (e: Entity) => e.buffs.addBuff(Buff2.create(Conditions.poison).setTurns(3)),
      },
    ];
  }

  static lightningZone(duration): TileTrigger[] {
    return [
      {
        id: generateId(),
        triggerType: TriggerType.OnWalk,
        turns: duration,
        stayOnWalk: false,
        trigger: (e: Entity) => e.buffs.addBuff(Buff2.create(Conditions.shock).setTurns(3)),
      },
    ];
  }

  static shadowZone(duration): TileTrigger[] {
    return [
      {
        id: generateId(),
        triggerType: TriggerType.OnWalk,
        turns: duration,
        stayOnWalk: true,
        trigger: (e: Entity) => e.enchants.setBlind(+1),
      },
      {
        id: generateId(),
        triggerType: TriggerType.OnLeft,
        turns: duration,
        stayOnWalk: true,
        trigger: (e: Entity) => e.enchants.setBlind(-1),
      },
    ];
  }

  static coldZone(duration): TileTrigger[] {
    return [
      {
        id: generateId(),
        triggerType: TriggerType.OnWalk,
        turns: duration,
        stayOnWalk: true,
        trigger: (e: Entity) => e.addBuff(Buff2.create(Conditions.cold).setTurns(2)),
      },
    ];
  }

  static fireZone(duration): TileTrigger[] {
    return [
      {
        id: generateId(),
        triggerType: TriggerType.OnWalk,
        turns: duration,
        stayOnWalk: true,
        trigger: (e: Entity) => e.addBuff(Buff2.create(Conditions.fire).setTurns(2)),
      },
    ];
  }

  static waterZone(duration): TileTrigger[] {
    return [
      {
        id: generateId(),
        triggerType: TriggerType.OnWalk,
        turns: duration,
        stayOnWalk: true,
        trigger: (e: Entity) => e.enchants.setWet(+1),
      },
      {
        id: generateId(),
        triggerType: TriggerType.OnLeft,
        turns: duration,
        stayOnWalk: true,
        trigger: (e: Entity) => e.enchants.setWet(-1),
      },
    ];
  }

  static healOnEnter(duration): TileTrigger {
    return {
      id: generateId(),
      triggerType: TriggerType.OnWalk,
      turns: duration,
      stayOnWalk: false,
      trigger: (e: Entity) => e.health.take(-1),
    };
  }
}
