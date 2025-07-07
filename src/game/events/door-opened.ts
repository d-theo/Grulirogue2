import { createEventDefinition } from 'ts-bus';
import { Coordinate } from '../../utils/coordinate';

export const doorOpened = createEventDefinition<{
  pos: Coordinate;
}>()('doorOpened');
