import { createEventDefinition } from 'ts-bus';
import { Armour } from '../entitybase/items/armour';
import { Weapon } from '../entitybase/items/weapon';

export const itemEquiped = createEventDefinition<{
  weapon?: Weapon;
  armour?: Armour;
}>()('itemEquiped');
