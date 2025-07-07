import { createEventDefinition, EventBus } from 'ts-bus';
import { Coordinate } from '../utils/coordinate';

export const playerActionMove = createEventDefinition<{
  to: Coordinate;
}>()('playerActionMove');
