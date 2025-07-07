import { createEventDefinition } from 'ts-bus';
import { CommandHandler } from './commands';
import { timePassed } from '../game/events';
import { gameBus } from '../infra/events/game-bus';

export const waitATurn = createEventDefinition<{}>()('waitATurn');

export class PlayerWaitATurnHandler extends CommandHandler {
  handle(event) {
    gameBus.publish(timePassed({ timeSpent: 1 }));
  }
}
