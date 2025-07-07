import { EventHandler } from './event-handler';
import { Hero } from '../hero/hero';
import { gameBus } from '../../infra/events/game-bus';
import { heroGainedXp, xpHasChanged } from '../events';

export class HeroGainedXPHandler extends EventHandler {
  constructor(private hero: Hero) {
    super();
  }
  handle(event: ReturnType<typeof heroGainedXp>) {
    const report = this.hero.gainXP(event.payload.amount);
    gameBus.publish(xpHasChanged(report));
  }
}
