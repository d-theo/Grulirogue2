import { gameBus } from "./game-bus";
import {
  playerAttemptAttackMonster,
  playerActionMove,
  playerUseItem,
  waitATurn,
  playerChoseSkill,
  playerUseSkill,
  nextLevel,
} from "../../commands";
import { Game } from "../../game/game";
import {
  PlayerAttemptAttackMonsterHandler,
  PlayerActionMoveHandler,
  PlayerUseItemHandler,
  PlayerWaitATurnHandler,
  PlayerChoseSkillhandler,
  PlayerUseSkillHandler,
  NextLevelHandler,
} from "../../use-cases";

/* Commands from UI */

export class CommandDispatcher {
  constructor(private readonly game: Game) {
    this.init();
  }

  init() {
    gameBus.subscribe(playerAttemptAttackMonster, (event) =>
      new PlayerAttemptAttackMonsterHandler(
        this.game.getHero(),
        this.game.getTilemap()
      ).handle(event)
    );
    gameBus.subscribe(playerActionMove, (event) =>
      new PlayerActionMoveHandler(
        this.game.getHero(),
        this.game.getTilemap(),
        this.game.getItems(),
        this.game.getPlaces(),
        this.game.getMonsters()
      ).handle(event)
    );
    gameBus.subscribe(playerUseItem, (event) =>
      new PlayerUseItemHandler(
        this.game.getHero(),
        this.game.getPlaces()
      ).handle(event)
    );
    gameBus.subscribe(waitATurn, (event) =>
      new PlayerWaitATurnHandler().handle(event)
    );
    gameBus.subscribe(playerChoseSkill, (event) =>
      new PlayerChoseSkillhandler(this.game.getHero()).handle(event)
    );
    gameBus.subscribe(playerUseSkill, (event) =>
      new PlayerUseSkillHandler(this.game.getHero()).handle(event)
    );
    gameBus.subscribe(nextLevel, (event) =>
      new NextLevelHandler().handle(event)
    );
  }
}
