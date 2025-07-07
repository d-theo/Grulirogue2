import { createEventDefinition, EventBus } from 'ts-bus';
import { Item } from '../game/entitybase/item';
import { Hero } from '../game/hero/hero';
import { Coordinate } from '../utils/coordinate';
import { Monster } from '../game/entitybase/monsters/monster';

export const playerUseItem = createEventDefinition<{
  item: Item;
  target: Monster | Hero | Coordinate | Item;
  action: string;
}>()('playerUseItem');
