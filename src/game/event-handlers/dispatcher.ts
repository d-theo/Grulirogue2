import { gameBus } from '../../infra/events/game-bus';
import { Game } from '../game';
import { HeroGainedXPHandler } from './hero-gained-xp';
import { ItemRemovedHandler } from './item-removed';
import { MonsterDeadHandler } from './monster-dead';
import { SightHasChangedHandler } from './sight-has-changed';
import { rogueEventHandler } from './rogue-start';
import { EndRogueEventHandler } from './rogue-end';
import {
  endRogueEvent,
  gameStarted,
  heroGainedXp,
  itemRemoved,
  monsterDead,
  nextLevelCreated,
  playerMoved,
  rogueEvent,
} from '../events';
import { RogueEventVars } from '../generation/event-rogue';

export class EventDispatcher {
  constructor(private readonly game: Game) {
    this.init();
  }

  init() {
    gameBus.subscribe(itemRemoved, (event) => new ItemRemovedHandler(this.game.getItems()).handle(event));
    gameBus.subscribe(monsterDead, (event) => new MonsterDeadHandler(this.game.getMonsters()).handle(event));
    gameBus.subscribe(heroGainedXp, (event) => new HeroGainedXPHandler(this.game.getHero()).handle(event));

    gameBus.subscribe(playerMoved, (event) =>
      new SightHasChangedHandler(this.game.getHero(), this.game.getTilemap()).handle(event)
    );
    gameBus.subscribe(nextLevelCreated, (event) =>
      new SightHasChangedHandler(this.game.getHero(), this.game.getTilemap()).handle(event)
    );

    gameBus.subscribe(gameStarted, (event) => {
      new SightHasChangedHandler(this.game.getHero(), this.game.getTilemap()).handle(event);
    });

    gameBus.subscribe(rogueEvent, (event) => new rogueEventHandler().handle(event));
    gameBus.subscribe(endRogueEvent, (event) => new EndRogueEventHandler().handle(event));
    gameBus.subscribe('rogueEvent', () => {
      RogueEventVars.isRogueEventActive = true;
    });
    gameBus.subscribe('endRogueEvent', () => {
      RogueEventVars.isRogueEventActive = false;
      RogueEventVars.eventHappened = true;
    });
  }
}
