// a Condition has => onApply onTick onRemove
// a Buff is a Condition with time & extra data
// an Effect is one Shot action with interface Effect { apply(target) }
// an Enchant is a Condition with onHit, onMove, handler...

import { Entity } from './entity';

// A Condition is a set of actions that can be applied to an Entity
export type Condition = {
  onApply?: (entity: Entity) => void;
  onTick?: (entity: Entity) => void;
  onRemove?: (entity: Entity) => void;
  tags?: string;
};

export function applyEffect(target: Entity) {}
